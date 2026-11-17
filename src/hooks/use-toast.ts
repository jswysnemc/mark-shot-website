/**
 * Toast 消息实体结构
 */
export interface ToastMessage {
  id: number;
  text: string;
}

const TOAST_EVENT_NAME = 'mark-shot:toast';

/**
 * 【交互反馈】【消息派发】通过浏览器自定义事件触发全局统一胶囊 Toast，替代原生弹窗
 * @param text 需要展示的简短反馈文本
 * @returns 无返回值
 */
export function emitToast(text: string): void {
  // 1. 服务端渲染阶段跳过事件派发
  if (typeof window === 'undefined') {
    return;
  }

  // 2. 组装唯一消息标识并向窗口广播自定义事件
  const detail: ToastMessage = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    text,
  };
  window.dispatchEvent(new CustomEvent<ToastMessage>(TOAST_EVENT_NAME, { detail }));
}

export { TOAST_EVENT_NAME };
