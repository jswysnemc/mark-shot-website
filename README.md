# Mark Shot Website

Mark Shot 官方网站静态源码仓库，覆盖简体中文（`/zh-cn/`）与英文（`/`）首页及独立下载与版本记录页（`/downloads/`）。

## 技术栈

- Astro 静态渲染与路由
- React 交互岛屿与 Motion 物理过渡
- Tailwind CSS v4
- 本地打包 Newsreader、Geist 与 JetBrains Mono 可变字体

## 本地开发与构建

```sh
pnpm install
pnpm dev
pnpm build
pnpm preview
```

## GitHub Pages 部署

推送至 `main` 分支后，`.github/workflows/deploy.yml` 会通过 `actions/configure-pages` 自动解析站点源地址与 `base_path`，完成静态构建并发布至 GitHub Pages。
