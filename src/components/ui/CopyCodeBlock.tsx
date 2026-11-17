import { useState } from 'react';
import { Check, Copy } from '@phosphor-icons/react';
import { copyTextWithToast } from '@/utils/clipboard';

interface CopyCodeBlockProps {
  code: string;
  label?: string;
  copyLabel: string;
  copiedLabel: string;
  toastText: string;
}

/**
 * 【代码展示】【一键复制】展示终端命令或配置片段并提供带状态切换的复制按钮
 * @param props 代码文本与多语言按钮文案
 * @returns 可复制代码块组件
 */
export function CopyCodeBlock({
  code,
  label,
  copyLabel,
  copiedLabel,
  toastText,
}: CopyCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  /**
   * 【交互动作】【执行复制】写入剪贴板并在短时间内切换按钮确认态
   * @returns Promise<void>
   */
  const handleCopy = async () => {
    // 1. 调用统一剪贴板工具并触发胶囊 Toast
    const ok = await copyTextWithToast(code, toastText);
    if (!ok) {
      return;
    }
    // 2. 更新按钮勾选态并在 1.8 秒后复位
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--rule)] bg-[var(--card)]">
      {label ? (
        <div className="flex items-center justify-between border-b border-[var(--rule)] px-4 py-2 font-[family-name:var(--mono)] text-[0.75rem] text-[var(--quiet)]">
          <span>{label}</span>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1 font-[family-name:var(--sans)] text-[0.75rem] text-[var(--soft)] transition-colors hover:bg-[var(--frame)] hover:text-[var(--ink)] active:scale-[0.98]"
          >
            {copied ? (
              <Check size={14} weight="bold" className="text-[var(--accent)]" />
            ) : (
              <Copy size={14} />
            )}
            <span>{copied ? copiedLabel : copyLabel}</span>
          </button>
        </div>
      ) : null}
      <div className="relative flex items-start justify-between gap-3 px-4 py-3.5">
        <pre className="no-scrollbar overflow-x-auto font-[family-name:var(--mono)] text-[0.8125rem] leading-[1.65] text-[var(--ink)]">
          <code>{code}</code>
        </pre>
        {!label ? (
          <button
            type="button"
            onClick={handleCopy}
            aria-label={copyLabel}
            className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--rule)] bg-[var(--paper)] px-2.5 py-1.5 font-[family-name:var(--sans)] text-[0.75rem] text-[var(--soft)] transition-colors hover:text-[var(--ink)] active:scale-[0.98]"
          >
            {copied ? (
              <Check size={14} weight="bold" className="text-[var(--accent)]" />
            ) : (
              <Copy size={14} />
            )}
            <span>{copied ? copiedLabel : copyLabel}</span>
          </button>
        ) : null}
      </div>
    </div>
  );
}
