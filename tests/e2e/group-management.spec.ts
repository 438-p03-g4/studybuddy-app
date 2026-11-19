import { expect, test } from '@playwright/test';

const randomGroups = [
  { id: 1, name: 'CST438 Study Group', course: 'CST438' },
  { id: 2, name: 'Mobile Developers', course: 'CST499' },
];

test('opens My Study Groups and shows the empty state', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.getByText('My Study Groups', { exact: true }).click();

  await expect(page).toHaveURL(/\/study-groups$/);
  await expect(page.getByText('My Study Groups', { exact: true })).toBeVisible();
  await expect(page.getByText('No Active Study Groups', { exact: true })).toBeVisible();
});

test('searches groups and opens the group creation page', async ({ page }) => {
  await page.route('**/groups*', async (route) => {
    const query = new URL(route.request().url()).searchParams.get('query');
    const groups = query ? [randomGroups[0]] : randomGroups;

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(groups),
    });
  });

  await page.goto('/find-study-groups');
  await expect(page.getByText('CST438 Study Group', { exact: true })).toBeVisible();
  await expect(page.getByText('Mobile Developers', { exact: true })).toBeVisible();

  await page.getByLabel('Search study groups').fill('CST438');
  await expect(page.getByText('CST438 Study Group', { exact: true })).toBeVisible();
  await expect(page.getByText('Mobile Developers', { exact: true })).toHaveCount(0);

  await page.getByRole('button', { name: 'Create Group' }).click();
  await expect(page).toHaveURL(/\/create-group$/);
  await expect(page.getByText('Create Study Group', { exact: true })).toBeVisible();
});

test('cancels group creation and resets the form', async ({ page }) => {
  await page.goto('/create-group');
  await page.getByLabel('Group name').fill('Temporary Group');
  await page.getByLabel('Course').fill('CST438');
  await page.getByRole('button', { name: 'Cancel group creation' }).click();

  await expect(page).toHaveURL(/\/find-study-groups$/);
  await page.goto('/create-group');
  await expect(page.getByLabel('Group name')).toHaveValue('');
  await expect(page.getByLabel('Course')).toHaveValue('');
});

test('Open Group posts the form and returns to Find Study Groups', async ({ page }) => {
  let postedGroup: Record<string, unknown> | undefined;

  await page.route('**/groups*', async (route) => {
    if (route.request().method() === 'POST') {
      postedGroup = route.request().postDataJSON() as Record<string, unknown>;
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 9,
          name: postedGroup.name,
          course: postedGroup.course,
          iconUrl: postedGroup.iconUrl,
          description: postedGroup.description,
        }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: '[]',
    });
  });

  await page.goto('/create-group');
  await page.getByLabel('Group name').fill('CST438 Group');
  await page.getByLabel('Group icon image URL').fill('https://example.com/icon.png');
  await page.getByLabel('Course').fill('CST438');
  await page.getByLabel('Group description').fill('Weekly study sessions');
  await page.getByRole('button', { name: 'Open Group' }).click();

  await expect(page).toHaveURL(/\/find-study-groups$/);
  expect(postedGroup).toEqual({
    name: 'CST438 Group',
    course: 'CST438',
    iconUrl: 'https://example.com/icon.png',
    description: 'Weekly study sessions',
  });
});
