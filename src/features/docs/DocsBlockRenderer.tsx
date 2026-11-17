import { Info } from '@phosphor-icons/react';
import type { DocContentBlock } from '@/types/docs';
import { CopyCodeBlock } from '@/components/ui/CopyCodeBlock';

interface DocsBlockRendererProps {
  block: DocContentBlock;
  copyLabel: string;
  copiedLabel: string;
  copiedToast: string;
}

/**
 * 【文档内容块】【结构化渲染】将正文段落、可复制代码块、双列参数卡、快捷键矩阵、圆角提示框与实机截图渲染为统一视觉组件
 * @param props 单个文档内容块与复制文案
 * @returns 对应内容块节点
 */
export function DocsBlockRenderer({
  block,
  copyLabel,
  copiedLabel,
  copiedToast,
}: DocsBlockRendererProps) {
  if (block.kind === 'prose') {
    return (
      <div className="space-y-3 text-[0.96875rem] leading-[1.72] text-[var(--soft)]">
        {block.paragraphs.map((text, idx) => (
          <p key={idx}>{text}</p>
        ))}
      </div>
    );
  }

  if (block.kind === 'code') {
    return (
      <CopyCodeBlock
        label={block.label}
        code={block.code}
        copyLabel={copyLabel}
        copiedLabel={copiedLabel}
        toastText={copiedToast}
      />
    );
  }

  if (block.kind === 'kvGrid') {
    const gridCols =
      block.columns === 3
        ? 'grid-cols-1 md:grid-cols-3'
        : 'grid-cols-1 sm:grid-cols-2';
    return (
      <ul className={`grid gap-3.5 ${gridCols}`}>
        {block.items.map((item) => (
          <li
            key={item.term}
            className="flex flex-col justify-between gap-2 rounded-2xl border border-[var(--rule)] bg-[var(--card)] p-4"
          >
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-[family-name:var(--sans)] text-[0.9375rem] font-medium text-[var(--ink)]">
                  {item.term}
                </span>
                {item.badge ? (
                  <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-0.5 font-[family-name:var(--mono)] text-[0.6875rem] font-medium text-[var(--accent)]">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <p className="mt-1.5 text-[0.875rem] leading-[1.6] text-[var(--soft)]">
                {item.detail}
              </p>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  if (block.kind === 'keyGrid') {
    return (
      <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {block.items.map((item) => (
          <li
            key={`${item.keys}-${item.action}`}
            className="flex flex-col justify-between gap-1.5 rounded-xl border border-[var(--rule)] bg-[var(--card)] px-3.5 py-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <kbd className="rounded-md border border-[var(--rule)] bg-[var(--frame)] px-2 py-0.5 font-[family-name:var(--mono)] text-[0.75rem] font-semibold text-[var(--ink)]">
                {item.keys}
              </kbd>
              {item.configKey ? (
                <span className="font-[family-name:var(--mono)] text-[0.6875rem] text-[var(--quiet)]">
                  {item.configKey}
                </span>
              ) : null}
            </div>
            <span className="font-[family-name:var(--sans)] text-[0.84rem] leading-[1.5] text-[var(--soft)]">
              {item.action}
            </span>
          </li>
        ))}
      </ul>
    );
  }

  if (block.kind === 'callout') {
    // 遵循规范：采用同色系全圆角细边卡片，严禁左侧异色锐角竖条
    return (
      <div className="rounded-2xl border border-[color-mix(in_srgb,var(--accent)_28%,transparent)] bg-[var(--accent-soft)] p-4">
        <div className="flex items-center gap-2 font-[family-name:var(--sans)] text-[0.875rem] font-semibold text-[var(--accent)]">
          <Info size={16} weight="bold" />
          <span>{block.title}</span>
        </div>
        <p className="mt-1.5 text-[0.875rem] leading-[1.62] text-[var(--ink)]">
          {block.body}
        </p>
      </div>
    );
  }

  return (
    <figure className="overflow-hidden rounded-2xl border border-[var(--rule)] bg-[var(--frame)]">
      <img
        src={block.src}
        alt={block.alt}
        loading="lazy"
        className="max-h-[380px] w-full object-cover object-top"
      />
      <figcaption className="border-t border-[var(--rule)] bg-[var(--card)] px-4 py-2.5 text-center font-[family-name:var(--sans)] text-[0.8125rem] text-[var(--quiet)]">
        {block.caption}
      </figcaption>
    </figure>
  );
}
