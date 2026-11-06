import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execFile, execFileSync } from 'node:child_process';

const root = path.join(process.cwd(), 'dist');
const port = Number(process.env.PORT || 4173);
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json; charset=utf-8', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8' };
if (!fs.existsSync(path.join(root, 'index.html')) || process.argv.includes('--watch')) execFileSync(process.execPath, ['scripts/build.mjs'], { stdio: 'inherit' });
const server = http.createServer((req, res) => {
  let url;
  try { url = decodeURIComponent(new URL(req.url || '/', 'http://localhost').pathname); } catch { res.writeHead(400); res.end('Bad request'); return; }
  if (url.endsWith('/')) url += 'index.html';
  let file = path.resolve(root, url.replace(/^\/+/, ''));
  if (path.relative(root, file).startsWith('..')) { res.writeHead(403); res.end('Forbidden'); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) { res.writeHead(301, { Location: `${url}/` }); res.end(); return; }
  const found = fs.existsSync(file);
  if (!found) file = path.join(root, '404.html');
  fs.readFile(file, (error, data) => { if (error) { res.writeHead(404); res.end('Not found'); return; } res.writeHead(found ? 200 : 404, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' }); res.end(data); });
});
server.listen(port, () => console.log(`Preview: http://localhost:${port}`));
if (process.argv.includes('--watch')) {
  let building = false;
  let timer;
  const rebuild = () => { clearTimeout(timer); timer = setTimeout(() => { if (building) return; building = true; execFile(process.execPath, ['scripts/build.mjs'], (error, stdout, stderr) => { if (stdout) console.log(stdout.trim()); if (error) console.error(stderr || error.message); building = false; }); }, 200); };
  for (const directory of ['content', 'public', 'scripts']) fs.watch(path.join(process.cwd(), directory), { recursive: true }, rebuild);
}
