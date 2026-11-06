import fs from 'node:fs/promises';
import path from 'node:path';
const root = path.join(process.cwd(), 'dist');
const basePath = (process.env.BASE_PATH || '').replace(/\/$/, '');
const mustExist = ['index.html', 'brands/index.html', 'compare/index.html', 'posts/index.html', 'topics/index.html', 'tools/index.html', 'questions/index.html', 'alerts/index.html', 'sitemap.xml', 'sitemap-index.xml', 'robots.txt', 'rss.xml', 'llms.txt', 'search-index.json', 'og-default.png', 'styles.css', 'app.js', 'theme.js', '404.html'];
const missing = [];
for (const file of mustExist) { try { await fs.access(path.join(root, file)); } catch { missing.push(file); } }
const html = await fs.readFile(path.join(root, 'index.html'), 'utf8');
for (const needle of ['选机场', '光年梯', 'GNT80', 'canonical', 'application/ld+json']) if (!html.includes(needle)) missing.push(`index.html:${needle}`);
const entries = await fs.readdir(root, { recursive: true });
const sourceCount = (await fs.readdir(path.join(process.cwd(), 'content/posts'))).filter((file) => file.endsWith('.md')).length;
if (entries.filter((entry) => entry.endsWith('index.html')).length < sourceCount + 22) missing.push('route-count');
const titles = new Set();
const documents = new Map();
for (const entry of entries.filter((item) => item.endsWith('.html'))) documents.set(entry.replaceAll('\\', '/'), await fs.readFile(path.join(root, entry), 'utf8'));
for (const [entry, document] of documents) {
  const title = document.match(/<title>(.*?)<\/title>/)?.[1];
  if (!title || titles.has(title)) missing.push(`duplicate-or-empty-title:${entry}`);
  titles.add(title);
  if ((document.match(/<h1[ >]/g) || []).length !== 1) missing.push(`h1:${entry}`);
  if (!document.includes('name="description"') || !document.includes('rel="canonical"')) missing.push(`seo:${entry}`);
  for (const block of document.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) { try { JSON.parse(block[1]); } catch { missing.push(`jsonld:${entry}`); } }
  for (const match of document.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = match[1].replaceAll('&amp;', '&');
    if (!url.startsWith('/') && !url.startsWith('#')) continue;
    const [prefixedPath, anchor] = url.split('#');
    const pathname = basePath && prefixedPath.startsWith(`${basePath}/`) ? prefixedPath.slice(basePath.length) : prefixedPath;
    const target = pathname ? (pathname.endsWith('/') ? `${pathname.slice(1)}index.html` : pathname.slice(1)) : entry;
    try { const stat = await fs.stat(path.join(root, target)); if (!stat.isFile()) missing.push(`non-file:${entry}:${url}`); } catch { missing.push(`broken:${entry}:${url}`); }
    if (anchor && documents.has(target) && !documents.get(target).includes(`id="${decodeURIComponent(anchor)}"`)) missing.push(`anchor:${entry}:${url}`);
  }
}
const search = JSON.parse(await fs.readFile(path.join(root, 'search-index.json'), 'utf8'));
if (search.length !== sourceCount) missing.push(`search-count:${search.length}/${sourceCount}`);
const sitemap = await fs.readFile(path.join(root, 'sitemap.xml'), 'utf8');
for (const entry of documents.keys()) if (entry !== '404.html') { const url = `https://xjichang.com/${entry.replace(/index\.html$/, '')}`; if (!sitemap.includes(`<loc>${url}</loc>`)) missing.push(`sitemap-missing:${entry}`); }
if (missing.length) { console.error(`Verification failed: ${missing.join(', ')}`); process.exit(1); }
console.log(`Verified ${entries.filter((entry) => entry.endsWith('.html')).length} HTML files, sitemap, RSS and SEO metadata.`);
