import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

/**
 * 【构建配置】【静态站点】组装兼容本地开发与 GitHub Pages 子路径部署的 Astro 配置
 * @returns Astro 构建配置对象
 */
function createAstroConfig() {
  // 1. 读取 CI 注入的站点源地址，本地默认回退至 GitHub Pages 用户域名
  const siteOrigin = process.env.SITE_ORIGIN || 'https://jswysnemc.github.io';
  // 2. 读取 CI 注入的子路径前缀，根路径部署时保持未定义以避免多余斜杠
  const rawBase = process.env.BASE_PATH || '';
  const normalizedBase = rawBase && rawBase !== '/' ? rawBase : undefined;

  return defineConfig({
    site: siteOrigin,
    base: normalizedBase,
    trailingSlash: 'always',
    output: 'static',
    integrations: [react()],
    vite: {
      plugins: [tailwindcss()],
    },
  });
}

export default createAstroConfig();
