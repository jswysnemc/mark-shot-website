import { emitToast } from '@/hooks/use-toast';

/**
 * 【剪贴板交互】【文本复制】写入系统剪贴板并弹出项目统一 Toast 通知
 * @param content 待复制的命令、配置或 SHA-256 字符串
 * @param toastMessage 复制成功后展示的提示文案
 * @returns 复制是否成功的布尔结果
 */
export async function copyTextWithToast(
  content: string,
  toastMessage: string
): Promise<boolean> {
  // 1. 校验运行环境是否处于浏览器客户端
  if (typeof navigator === 'undefined') {
    return false;
  }

  try {
    // 2. 优先调用现代异步 Clipboard 接口写入文本
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(content);
      emitToast(toastMessage);
      return true;
    }

    // 3. 非安全上下文回退至隐藏文本域复制方案
    const helper = document.createElement('textarea');
    helper.value = content;
    helper.style.position = 'fixed';
    helper.style.opacity = '0';
    document.body.appendChild(helper);
    helper.select();
    document.execCommand('copy');
    document.body.removeChild(helper);
    emitToast(toastMessage);
    return true;
  } catch {
    return false;
  }
}
