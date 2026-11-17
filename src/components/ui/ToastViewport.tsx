import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { CheckCircle } from '@phosphor-icons/react';
import { TOAST_EVENT_NAME, type ToastMessage } from '@/hooks/use-toast';

/**
 * 【全局反馈】【提示容器】订阅剪贴板与画布动作事件，展示紧凑胶囊形 Toast 提示
 * @returns React Toast 浮层节点
 */
export function ToastViewport() {
  const [activeToast, setActiveToast] = useState<ToastMessage | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let timerId: number | undefined;

    // 1. 监听全局自定义 Toast 广播并刷新自动关闭计时器
    const handleToast = (event: Event) => {
      const customEvent = event as CustomEvent<ToastMessage>;
      setActiveToast(customEvent.detail);
      if (timerId !== undefined) {
        window.clearTimeout(timerId);
      }
      timerId = window.setTimeout(() => {
        setActiveToast(null);
      }, 2400);
    };

    window.addEventListener(TOAST_EVENT_NAME, handleToast);
    return () => {
      window.removeEventListener(TOAST_EVENT_NAME, handleToast);
      if (timerId !== undefined) {
        window.clearTimeout(timerId);
      }
    };
  }, []);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
    >
      <AnimatePresence mode="wait">
        {activeToast ? (
          <motion.div
            key={activeToast.id}
            initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-[var(--rule)] bg-[var(--card)] px-4 py-2 font-[family-name:var(--sans)] text-[0.8125rem] text-[var(--ink)] shadow-[0_12px_32px_-12px_rgba(15,23,42,0.28)]"
          >
            <CheckCircle
              size={16}
              weight="fill"
              className="shrink-0 text-[var(--accent)]"
            />
            <span>{activeToast.text}</span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
