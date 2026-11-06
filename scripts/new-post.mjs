import fs from 'node:fs/promises';
import path from 'node:path';
const slug = process.argv[2] || 'new-post';
const title = process.argv.slice(3).join(' ') || '新文章标题';
const file = path.join(process.cwd(), 'content', 'posts', `${slug}.md`);
try { await fs.access(file); throw new Error(`已有文章：${file}`); } catch (error) { if (error.code !== 'ENOENT') throw error; }
await fs.writeFile(file, `---\ntitle: "${title}"\ndescription: "补充文章摘要与 SEO 描述。"\ndate: ${new Date().toISOString().slice(0, 10)}\nupdated: ${new Date().toISOString().slice(0, 10)}\ntopic: choose\ntags: [机场]\n---\n\n## 开始写作\n\n在这里补充内容。\n`);
console.log(`Created ${file}`);
