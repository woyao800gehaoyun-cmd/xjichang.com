# 选机场 · xjichang.com

中文机场博客，包含 28 篇原创资料文章、4 家品牌档案、8 个专题和 50 个静态页面。参考 ClashLab 的内容组织方式与用户提供的导航截图，自行编写内容与界面，不依赖运行时服务器。

## 本地运行

直接预览已经生成的博客：双击项目根目录的 `index.html`，或打开 `dist/index.html`。样式、图片、搜索、工具与文章跳转均支持本地文件打开；请保留整个 `dist/` 文件夹，不要只复制其中一个 HTML。修改源内容后需要重新构建，才能在 `dist/` 看到更新。

需要 Node.js 22 或更新版本，GitHub Actions 使用 Node.js 24。

```sh
npm ci
npm run verify
npm run dev
```

预览地址为 `http://localhost:4173`。`npm run dev` 会监听内容、样式和构建脚本变化，修改后刷新浏览器即可。只查看已构建版本可运行 `npm run preview`。

## 长期更新

新增文章：

```sh
npm run new:post -- article-slug "文章标题"
```

在 `content/posts/` 编辑生成的 Markdown，填写摘要、日期、专题和标签。专题标识可以是 `choose`、`reviews`、`clients`、`network`、`scenes`、`troubleshooting`、`deals`、`regions`。文内用 `[说明](/posts/article-slug/)` 链接相关文章。

品牌参数集中维护于 `content/brands.json`。价格、流量、优惠码或外部链接变化时，更新该文件以及对应测评正文、FAQ 与 `content/site.json` 的 `reviewedAt`，避免正文与卡片不一致。更新文章时修改 `updated`，保留真实的首次发布日期。

提交到 `main` 会触发构建、内链与元数据验证，验证通过后发布 GitHub Pages。

## 域名与发布

目前 SEO 正式地址配置为 `https://xjichang.com`。GitHub 仓库的 **Settings → Pages → Source** 应选择 **GitHub Actions**。如要在该域名上线，还需在 Pages 中设置自定义域名，并将域名 DNS 指向 GitHub Pages。域名未完成绑定前，不能把构建成功等同于正式域名上线。

HTML 内的资源和内部链接按页面层级生成相对路径，兼容本地文件、正式域名和 GitHub 项目路径。工作流仍会读取 Pages 配置，使用 `BASE_PATH` 生成在线搜索索引地址。正式 canonical 和站点地图仍指向 `https://xjichang.com`，应完成域名绑定后再提交搜索引擎。静态产物在 `dist/`。其他主机部署到子路径时可用 `BASE_PATH` 指定路径。

## SEO 与 GEO

- 每页独立标题、描述、canonical、Open Graph 与 Twitter 元数据。
- Article、WebSite、BreadcrumbList；问题库的可见答案与 FAQPage 同步。
- `sitemap.xml`、`sitemap-index.xml`、`robots.txt`、RSS、404 与 `llms.txt`。
- 全文静态 HTML、目录锚点、专题内链、相关内容和全站本地搜索。
- 文章标注来源、整理日期、推广关系与未知参数；不生成虚假测速、评分或解锁数据。

Google/Bing 验证值可填入 `content/site.json` 中相应字段；留空时不会输出占位验证码。上线后在自己的站长后台验证域名并提交 `https://xjichang.com/sitemap.xml`。不要把站点地图生成误认为已经向搜索引擎提交或获得排名。`llms.txt` 是内容索引，不保证 AI 抓取或引用。

分享预览图为已提交的 `public/og-default.png`。可选重绘脚本 `scripts/create-social-image.py` 需要 Pillow 和中文字体，不参与正常构建。

## 内容边界

四家价格、线路和优惠码来自站方提供的信息。折扣比例、有效期、节点地区、协议、设备数、实际稳定性和解锁情况尚未核实。鲲鹏加速流量未提供，暂无优惠码。光年梯主推依据为同价位 120GB 相比 100GB 的标称流量优势，未伪装成真实测速排名。

没有收到 Telegram 频道地址，所以“订阅更新”提供 RSS 与频道未开放说明；共享 ID 栏目提供客户端获取与账号安全指南；跑路预警栏目说明证据标准，没有捏造运营状态。
