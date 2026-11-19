import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const port = Number(process.env.PORT ?? 4173);

const contentTypes = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

const server = createServer((request, response) => {
  const requestPath = decodeURIComponent(request.url?.split('?')[0] ?? '/');
  const relativePath = normalize(requestPath).replace(/^([.][.][/\\])+/, '');
  let filePath = join(root, relativePath === '/' ? 'index.html' : relativePath);

  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    filePath = join(root, 'index.html');
  }

  response.writeHead(200, {
    'Content-Type': contentTypes[extname(filePath)] ?? 'application/octet-stream',
  });
  createReadStream(filePath).pipe(response);
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Serving dist on http://127.0.0.1:${port}`);
});
