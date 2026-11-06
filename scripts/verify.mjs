import fs from 'node:fs/promises';
import path from 'node:path';
const root = path.join(process.cwd(), 'dist');
const mustExist = ['index.html', 'brands/index.html', 'compare/index.html', 'posts/index.html', 'topics/index.html', 'tools/index.html', 'sitemap.xml', 'robots.txt', 'rss.xml', 'styles.css', 'app.js'];
const missing = [];
for (const file of mustExist) { try { await fs.access(path.join(root, file)); } catch { missing.push(file); } }
const html = await fs.readFile(path.join(root, 'index.html'), 'utf8');
for (const needle of ['选机场', '光年梯', 'GNT80', 'canonical', 'application/ld+json']) if (!html.includes(needle)) missing.push(`index.html:${needle}`);
const entries = await fs.readdir(root, { recursive: true });
if (entries.filter((entry) => entry.endsWith('index.html')).length < 20) missing.push('route-count');
if (missing.length) { console.error(`Verification failed: ${missing.join(', ')}`); process.exit(1); }
console.log(`Verified ${entries.filter((entry) => entry.endsWith('.html')).length} HTML files, sitemap, RSS and SEO metadata.`);
