# smallhandsome · 技术与思考

一个轻量、响应式的中文技术博客与个人介绍网站。无需安装任何 npm 依赖，适用于 GitHub Pages 的仓库子路径。

## 包含什么

- 首页、精选文章、分类筛选与即时搜索。
- 三篇明确标注的示例技术文章，独立文章页、目录、阅读进度与代码复制。
- 浅色/深色模式，记住手动选择；未选择时跟随系统设置。
- 手机与桌面布局、键盘导航、跳转主内容链接、减少动画偏好支持。
- 个人介绍占位区，不编造经历、技能、联系方式或项目成果。
- 无第三方字体、跟踪脚本、CDN 或运行时网络依赖。

## 本地构建

使用 Node.js 20 或更新版本：

```sh
npm run build
npm test
```

生成的网站位于 `dist/`，可由任意静态 HTTP 服务器预览。打开 `dist/index.html` 也能查看主要内容，但剪贴板复制通常要求 HTTPS 或 localhost 安全上下文。

## 修改内容

- `content/site.json`：站名、介绍、GitHub 地址和可选邮箱。
- `content/posts.json`：文章标题、摘要、分类及正文。
- `assets/style.css`：样式与响应式布局。
- `assets/app.js`：主题、筛选、搜索、代码复制、阅读进度。
- `scripts/build.mjs`：静态页面生成器。

文章正文支持 `p`、`h2`（提供唯一 `id`）、`list`、`code` 和 `note` 类型。新增文章时使用唯一的英文 `slug`。把示例替换为真实文章时，请同时修改模板中的示例标识与首页说明，不要将示例经历包装成个人履历。

## GitHub Pages

仓库中提供 `.github/workflows/pages.yml`。在 GitHub 仓库的 Settings → Pages 中选择 **GitHub Actions** 后，每次推送到 `main` 都会构建、检查并部署 `dist/`。

所有资源均使用相对路径，无需硬编码仓库名。仓库若使用 `smallhandsome`，默认网址是 `https://<GitHub用户名>.github.io/smallhandsome/`。这不是购买的独立域名。

如果发布环境无法使用 Actions，也可以把 `dist/` 的内容发布到独立的 `gh-pages` 分支，并将 Pages 设为从该分支根目录发布。源码和构建产物应分开保存。

## 验证

`npm test` 检查输出页面数量、HTML 基本标记、唯一 ID、站内链接、锚点、资源路径、JavaScript 语法、示例说明和 `.nojekyll` 标记。桌面与手机布局、搜索筛选、主题切换以及文章导航另外通过浏览器验证。

## 隐私与内容

这个网站不包含分析追踪、远程表单或个人数据收集。当前文章为教学示例；个人介绍应由站点主人确认后替换。不要将密码、令牌、密钥或私人资料写进公开仓库。
