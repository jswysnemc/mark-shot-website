import { useState } from 'react';
import { ArrowRight } from '@phosphor-icons/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { WorkflowRoleItem } from '@/data/workflows-data';
import { CopyCodeBlock } from '@/components/ui/CopyCodeBlock';

interface WorkflowRoleSwitcherProps {
  isZh: boolean;
  docsBaseHref: string;
  items: WorkflowRoleItem[];
  copyLabel: string;
  copiedLabel: string;
  copiedToast: string;
}

/**
 * 【角色工作流】【场景切换面板】融合 PixPin 多人群场景选项卡与真实终端命令及实机截图预览
 * @param props 语言标识、文档基路径、四类场景数据及复制按钮文案
 * @returns 可平滑切换的四角色工作流区块
 */
export function WorkflowRoleSwitcher({
  isZh,
  docsBaseHref,
  items,
  copyLabel,
  copiedLabel,
  copiedToast,
}: WorkflowRoleSwitcherProps) {
  const [activeId, setActiveId] = useState<WorkflowRoleItem['id']>('dev');
  const reduceMotion = useReducedMotion();
  const current = items.find((entry) => entry.id === activeId) ?? items[0]!;

  return (
    <section className="relative" data-section data-hatch-band>
      <div className="wrap pt-16 pb-16 md:pt-22 md:pb-24">
        <div className="max-w-[42rem]">
          <h2 className="text-[clamp(1.65rem,2.6vw,2.3rem)] leading-[1.14] font-normal text-[var(--ink)]">
            {isZh ? '不同的工作流，同一个顺手的工具' : 'Different workflows, one native tool'}
          </h2>
          <p className="mt-3 text-[1rem] leading-[1.65] text-[var(--soft)]">
            {isZh
              ? '无论终端排障、界面像素验收、编写带步骤的技术文档还是敏感信息打码归档，均可在同一次框选内完成。'
              : 'From terminal debugging and pixel QA to step-numbered docs and offline redaction, every task finishes in one pass.'}
          </p>
        </div>

        {/* 顶部四角色胶囊切换轨 */}
        <div
          role="tablist"
          aria-label={isZh ? '典型工作流角色' : 'Workflow roles'}
          className="no-scrollbar mt-7 flex gap-1.5 overflow-x-auto rounded-2xl border border-[var(--rule)] bg-[var(--frame)] p-1.5 font-[family-name:var(--sans)] sm:inline-flex"
        >
          {items.map((item) => {
            const selected = item.id === current.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveId(item.id)}
                className={`shrink-0 cursor-pointer rounded-xl px-4 py-2 text-[0.875rem] transition-colors ${
                  selected
                    ? 'bg-[var(--card)] font-medium text-[var(--ink)] shadow-xs ring-1 ring-[var(--rule)]'
                    : 'text-[var(--soft)] hover:text-[var(--ink)]'
                }`}
              >
                {item.tabLabel}
              </button>
            );
          })}
        </div>

        {/* 当前角色工作流详情与实机截图对照面板 */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current.id}
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 grid grid-cols-1 gap-6 rounded-2xl border border-[var(--rule)] bg-[var(--card)] p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center"
          >
            <div className="space-y-4">
              <div className="font-[family-name:var(--mono)] text-[0.75rem] text-[var(--accent)]">
                {current.roleTitle}
              </div>

              <h3 className="text-[1.35rem] leading-[1.24] font-normal text-[var(--ink)]">
                {current.headline}
              </h3>

              <p className="text-[0.9375rem] leading-[1.65] text-[var(--soft)]">
                {current.summary}
              </p>

              <ul className="flex flex-wrap gap-2 font-[family-name:var(--sans)] text-[0.78rem]">
                {current.keySequence.map((step, idx) => (
                  <li
                    key={step}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[var(--rule)] bg-[var(--paper)] px-3 py-1 text-[var(--ink)]"
                  >
                    <span className="font-[family-name:var(--mono)] text-[0.7rem] font-semibold text-[var(--accent)]">
                      {idx + 1}.
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>

              <CopyCodeBlock
                code={current.commandSnippet}
                copyLabel={copyLabel}
                copiedLabel={copiedLabel}
                toastText={copiedToast}
              />

              <a
                href={`${docsBaseHref}${current.docAnchor}`}
                className="inline-flex items-center gap-1.5 pt-1 font-[family-name:var(--sans)] text-[0.875rem] font-medium text-[var(--accent)] hover:opacity-80"
              >
                <span>{current.docLinkText}</span>
                <ArrowRight size={14} weight="bold" />
              </a>
            </div>

            <figure className="overflow-hidden rounded-xl border border-[var(--rule)] bg-[var(--frame)]">
              <img
                src={current.screenshotPath}
                alt={current.screenshotCaption}
                loading="lazy"
                className="h-[250px] w-full object-cover object-top sm:h-[296px]"
              />
              <figcaption className="border-t border-[var(--rule)] bg-[var(--paper)] px-3.5 py-2 font-[family-name:var(--sans)] text-[0.8125rem] text-[var(--quiet)]">
                {current.screenshotCaption}
              </figcaption>
            </figure>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
