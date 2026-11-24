# StudyBuddy app

Expo / React Native application for web and Android. This repository contains the StudyBuddy client.

## Prerequisites

Git, Node.js 22.13.0 (the version used in current CI), npm, and Internet access
for dependency installation. Start with web; Android requires a configured
emulator/device and is not a replacement for the local API onboarding check.

For the developer backend, install Docker Desktop with Docker Compose v2. The
backend Docker image includes Java 25; native backend testing requires JDK 25.

## Fresh clone and web startup

~~~powershell
git clone https://github.com/438-p03-g4/studybuddy-app.git
cd studybuddy-app
git switch main
git rev-parse HEAD
Copy-Item .env.example .env
npm ci
npm run web
~~~

Open the URL printed by Expo, normally http://localhost:8081. Stop with Ctrl+C.
Expected current behavior: home screen, menu, local Todo creation and storage,
study-group pages, and group discovery through the authenticated API.

If PowerShell blocks npm.ps1, use npm.cmd ci and npx.cmd expo start --web.
After changing .env, restart Expo. Use npx.cmd expo start -c to clear its cache
when old environment values appear to be loaded.

## Frontend environment variables

The .env file is local-only and must not be committed. .env.example contains
safe defaults.

| Variable | Purpose | Local default |
|---|---|---|
| EXPO_PUBLIC_API_URL | Backend base URL | http://localhost:8080 on web; Android emulator uses http://10.0.2.2:8080 when unset |
| EXPO_PUBLIC_DEV_AUTH_BYPASS | Development-only offline sign-in bypass | false |

To work on the frontend without a running API or OAuth session, set:

~~~text
EXPO_PUBLIC_DEV_AUTH_BYPASS=true
~~~

In development builds, the API connection-error screen shows a Dev bypass
button and the app uses a local developer user. The bypass is gated by Expo's
development flag and is unavailable in production builds. It bypasses only
authentication; API-backed group data still requires a running backend.

The account popup opens by clicking the account name or profile image. It
contains app and user settings, dark mode, high contrast, proportional text
size, hidden Party Mode, a profile-image URL, and display-name changes. Email,
password, and account deletion currently open Coming soon placeholder dialogs.

## Developer backend: local API and PostgreSQL

The backend lives in https://github.com/438-p03-g4/studybudy-backend.
It is a Java 25 / Spring Boot 4.1.1 API with PostgreSQL and Spring Security OAuth2.
Use its README and docs/runbook.md for the Docker API/database setup and the
backend test suite.

### Clone, configure and start the backend

PowerShell on Windows:

~~~powershell
git clone https://github.com/438-p03-g4/studybudy-backend.git
cd studybudy-backend
git switch main
git rev-parse HEAD
Copy-Item .env.example .env
docker --version
docker compose version
docker info
docker compose config --quiet
docker compose up --build -d
docker compose ps
curl.exe --fail http://localhost:8080/actuator/health
~~~

macOS/Linux: replace Copy-Item .env.example .env with cp .env.example .env
and curl.exe with curl. Other commands are the same.

The build may take several minutes. If the health request is too early, inspect
docker compose logs --tail=100 db and docker compose logs --tail=100 api,
then retry. Expected: HTTP 200 and a JSON body with "status":"UP".

The Compose database is local PostgreSQL 17. No Neon account or real secret is
required for this startup check. The API is exposed at http://localhost:8080
and the frontend normally runs at http://localhost:8081.

### Backend environment variables and OAuth

The backend .env.example contains local-only values:

~~~text
LOCAL_DATABASE_PASSWORD=studybuddy_local_only
GOOGLE_CLIENT_ID=onboarding-not-a-real-client
GOOGLE_CLIENT_SECRET=onboarding-not-a-real-secret
GITHUB_CLIENT_ID=onboarding-not-a-real-client
GITHUB_CLIENT_SECRET=onboarding-not-a-real-secret
~~~

Compose supplies the database variables internally:

~~~text
DATABASE_URL=jdbc:postgresql://db:5432/studybuddy
DATABASE_USERNAME=studybuddy
DATABASE_PASSWORD=studybuddy_local_only
~~~

For real OAuth development, configure real provider clients and use these
callback URLs:

~~~text
http://localhost:8080/login/oauth2/code/google
http://localhost:8080/login/oauth2/code/github
~~~

The frontend starts OAuth through /oauth2/authorization/google and
/oauth2/authorization/github. Configure FRONTEND_ORIGIN as
http://localhost:8081 and FRONTEND_SUCCESS_URL as
http://localhost:8081/login/success for local web development.

The sample OAuth values cannot authenticate a user. Health success alone is not
proof of a working login flow. Protected endpoints such as /groups require an
authenticated StudyBuddy session in the current implementation.

### Run backend tests

From the backend repository:

~~~powershell
docker compose --profile test run --build --rm tests
~~~

Expected: BUILD SUCCESSFUL, exit code 0. Current tests use isolated H2
databases; they do not test the running PostgreSQL container or a complete OAuth
flow. The audited main commit had 15 tests. Record the actual count for the
tested commit.

Without Docker, a diagnostic alternative is JDK 25 plus:

~~~powershell
.\gradlew.bat test --no-daemon --console=plain
~~~

macOS/Linux: ./gradlew test --no-daemon --console=plain. This fallback does not
satisfy the required Docker-stack attempt by itself.

### Local demo data

After the API health check succeeds, add one repeatable local example. Never run
this against Neon or production:

~~~powershell
docker compose exec -T db psql -U studybuddy -d studybuddy -v ON_ERROR_STOP=1 -c "INSERT INTO study_group (name, course) SELECT 'CST438 Onboarding Group', 'CST438' WHERE NOT EXISTS (SELECT 1 FROM study_group WHERE name = 'CST438 Onboarding Group' AND course = 'CST438');"
docker compose exec -T db psql -U studybuddy -d studybuddy -c "SELECT id, name, course FROM study_group ORDER BY id;"
~~~

Expected: the example group appears once. This creates no user or login session.
There is currently no documented, working backend test-only auth mechanism; use
the frontend developer bypass only for local UI work.

### Connect the frontend to the backend

In another terminal:

~~~powershell
cd studybuddy-app
Copy-Item .env.example .env
npm ci
npm run typecheck
npm run web
~~~

Leave EXPO_PUBLIC_API_URL unset for the default web URL, or set
EXPO_PUBLIC_API_URL=http://localhost:8080. For an Android emulator, use
EXPO_PUBLIC_API_URL=http://10.0.2.2:8080.

The group-search page calls GET /groups with an optional query parameter.
With no query, the API returns up to 20 randomized groups; with a query, it
performs a case-insensitive partial match against group names and courses.

## Checks

In another terminal in the frontend repository root:

~~~powershell
npm run typecheck
npx --no-install expo export --platform web
npx playwright install chromium
npm run test:e2e
~~~

The Playwright tests serve the exported web client and mock the group API so
they can verify navigation, searching, form reset, and the group-creation POST
without requiring OAuth credentials or a running backend. Protected frontend
routes use a signed-in test user fixture.

## Optional hosted deployment: Neon and Render

The local Compose path above does not need these credentials. For hosted
deployment, create or select a Neon project and configure the backend with:

- DATABASE_URL: jdbc:postgresql://<host>/<database>?sslmode=require&channel_binding=require
- DATABASE_USERNAME: Neon role name
- DATABASE_PASSWORD: Neon role password

Convert Neon postgresql:// URIs to jdbc:postgresql://. Do not commit real
credentials; use deployment secrets. During development, Hibernate updates the
Neon schema from JPA entities (ddl-auto: update). For production, use versioned
SQL migrations instead.

For Render, create a Web Service for the backend repository, choose Docker as
the runtime, keep the Dockerfile path as ./Dockerfile, and configure the Neon
database variables. Render supplies the PORT environment variable (10000 by
default). Add OAuth variables and deployed FRONTEND_ORIGIN /
FRONTEND_SUCCESS_URL when OAuth is configured. Never put database credentials
in the Dockerfile.

## Troubleshooting

| Symptom | Check / action |
|---|---|
| docker not found | Install Docker Desktop/Engine through the normal team setup; verify Compose v2 before class. |
| Cannot connect to Docker daemon | Start Docker and wait for the engine, then run docker info. |
| Port 8080 occupied | Stop the conflicting local service, or change only the host side of the port mapping and record the new URL. |
| Database connection refused | Read database health and API logs; confirm Compose is being run from the backend repo root. |
| Password mismatch after editing .env | Existing PostgreSQL volumes keep their original password. Restore the original local password or back up and explicitly reset only disposable local data. |
| Missing OAuth placeholder | Re-copy .env.example to a new local .env and check the required variable names. Real sign-in requires real development-client configuration. |
| Redirect at /groups | Current server requires OAuth login; a redirect is not successful group retrieval. Record the auth gap if the README could not get you signed in. |
| npm.ps1 cannot be loaded | Use npm.cmd/npx.cmd, or follow the team's approved PowerShell execution-policy guidance. |
| @react-native-community/slider cannot be resolved | Copy the current package.json and package-lock.json, run npm.cmd ci, then restart Expo with npx.cmd expo start -c. |
| Dev bypass button is missing | Create .env, set EXPO_PUBLIC_DEV_AUTH_BYPASS=true, and restart Expo with its cache cleared. It appears on the API connection-error screen only in development builds. |
| Group data does not load | Confirm the backend is healthy, EXPO_PUBLIC_API_URL points to it, and an authenticated session exists. The developer bypass does not create a backend session. |
| Expo menu closes without navigating | Known placeholder in current client. Record actual behavior rather than claiming group search works. |
| Test failure | Record exact test command, exit code, first failing test and output; include the XML/HTML test report if available. |

Do not paste private environment values into shared command logs. This runbook
does not instruct visitors to request access to the production Neon database.

## Stop the local stack

From the backend repository:

~~~powershell
docker compose down
~~~

This keeps the local database volume. Volume deletion is intentionally not part
of normal onboarding; use it only for explicitly disposable data after checking
what will be lost.

## Onboarding issues

File client blockers here with label onboarding, one issue per problem. Include
the README step, exact command and text output, expected result, OS and Docker
versions. If the complete attempt succeeds, file one clean-run issue instead.

Hosts assign an owner or reply with a plan before class ends. Hosts never take
over the visitor's keyboard.
