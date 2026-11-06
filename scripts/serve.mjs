import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';

const root = path.join(process.cwd(), 'dist');
const port = Number(process.env.PORT || 4173);
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8' };
const server = http.createServer((req, res) => {
  let url = decodeURIComponent((req.url || '/').split('?')[0]);
  if (url.endsWith('/')) url += 'index.html';
  let file = path.join(root, url.replace(/^\/+/, ''));
  if (!file.startsWith(root)) { res.writeHead(403); res.end('Forbidden'); return; }
  if (!fs.existsSync(file)) file = path.join(root, '404.html');
  fs.readFile(file, (error, data) => { if (error) { res.writeHead(404); res.end('Not found'); return; } res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' }); res.end(data); });
});
server.listen(port, () => console.log(`Preview: http://localhost:${port}`));
if (process.argv.includes('--watch')) {
  let building = false;
  fs.watch(path.join(process.cwd(), 'content'), { recursive: true }, () => { if (building) return; building = true; execFile(process.execPath, ['scripts/build.mjs'], (error, stdout, stderr) => { if (stdout) console.log(stdout.trim()); if (error) console.error(stderr || error.message); building = false; }); });
}
