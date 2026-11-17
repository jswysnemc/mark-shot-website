/**
 * 【站点路由】【路径拼接】将站内相对路径与 Astro BASE_URL 安全拼接，适配 GitHub Pages 子目录部署
 * @param relativePath 站内路径（例如 '/zh-cn/' 或 '/images/settings-zh.png'）
 * @returns 拼接完成的可访问路径
 */
export function withBase(relativePath: string): string {
  // 1. 外部协议链接或纯页内锚点直接原样返回
  if (
    /^(https?:|mailto:|tel:)/.test(relativePath) ||
    relativePath.startsWith('#')
  ) {
    return relativePath;
  }

  // 2. 规范化构建期注入的基础路径，去除尾部多余斜杠
  const rawBase = import.meta.env.BASE_URL || '/';
  const cleanBase = rawBase === '/' ? '' : rawBase.replace(/\/+$/, '');

  // 3. 确保目标路径以单斜杠开头并拼接查询参数或哈希后缀
  const normalizedTarget = relativePath.startsWith('/')
    ? relativePath
    : `/${relativePath}`;

  return `${cleanBase}${normalizedTarget}`;
}
