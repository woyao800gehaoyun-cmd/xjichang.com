import fs from 'node:fs/promises';
import path from 'node:path';
const slug = process.argv[2] || 'new-post';
if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('slug 只能包含小写英文字母、数字与连字符');
const title = process.argv.slice(3).join(' ') || '新文章标题';
const file = path.join(process.cwd(), 'content', 'posts', `${slug}.md`);
try { await fs.access(file); throw new Error(`已有文章：${file}`); } catch (error) { if (error.code !== 'ENOENT') throw error; }
await fs.writeFile(file, `---\ntitle: ${JSON.stringify(title)}\ndescription: "补充文章摘要与 SEO 描述。"\ndate: ${new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai' }).format(new Date())}\nupdated: ${new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai' }).format(new Date())}\ntopic: choose\ntags: [机场]\n---\n\n## 开始写作\n\n在这里补充内容。\n`);
console.log(`Created ${file}`);
