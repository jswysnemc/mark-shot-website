import { useState } from 'react';
import { Check, Copy, ImageSquare, TerminalWindow } from '@phosphor-icons/react';
import type { ThemeProtocolItem } from '@/data/themes-protocols-data';
import type { SiteCopy } from '@/types/locale';
import { copyTextWithToast } from '@/utils/clipboard';

interface ThemeProtocolShowcaseProps {
  copy: SiteCopy['themesProtocols'];
  commonCopy: SiteCopy['common'];
  items: ThemeProtocolItem[];
  isZh: boolean;
}

/**
 * 【主题与协议】【双栏切换】左侧选择明暗画布主题或合成器协议，右侧实时切换配置文件与实机截图
 * @param props 分区标题文案、配置条目数组及复制提示文案
 * @returns 双栏交互切换面板组件
 */
export function ThemeProtocolShowcase({
  copy,
  commonCopy,
  items,
  isZh,
}: ThemeProtocolShowcaseProps) {
  const [activeId, setActiveId] = useState<ThemeProtocolItem['id']>('light-ui');
  const [viewTab, setViewTab] = useState<'code' | 'screenshot'>('code');
  const [copied, setCopied] = useState(false);

  const current = items.find((entry) => entry.id === activeId) ?? items[0];

  /**
   * 【配置复制】【剪贴板同步】将当前展示的配置或命令合并为纯文本写入剪贴板
   * @returns Promise<void>
   */
  const handleCopyCurrent = async () => {
    // 1. 拼接当前配置面板的所有代码行
    const rawText = current.codeLines.map((line) => line.content).join('\n');
    const ok = await copyTextWithToast(rawText, commonCopy.copiedToast);
    if (!ok) {
      return;
    }
    // 2. 短暂点亮复制确认图标
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section id="platforms" className="relative" data-section data-hatch-band>
      <div className="wrap pt-16 pb-16 md:pt-22 md:pb-24">
        <div className="max-w-[42rem]">
          <h2 className="text-[clamp(1.65rem,2.5vw,2.25rem)] leading-[1.12] font-normal text-[var(--ink)]">
            {copy.heading}
          </h2>
          <p className="mt-3 text-[1rem] leading-[1.65] text-[var(--soft)]">
            {copy.subheading}
          </p>
        </div>

        <div className="mt-9 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.55fr)] lg:gap-10">
          {/* 左侧：使用圆角细竖条与透明度层级标识选中项，杜绝异色尖角描边 */}
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {items.map((item) => {
              const isSelected = item.id === current.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(item.id)}
                    className={`relative flex w-full cursor-pointer flex-col gap-1 py-2 pl-4 text-left transition-opacity ${
                      isSelected ? 'opacity-100' : 'opacity-65 hover:opacity-95'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute inset-y-1 left-0 w-0.5 rounded-full transition-colors ${
                        isSelected ? 'bg-[var(--ink)]' : 'bg-[var(--rule)]'
                      }`}
                    />
                    <span className="text-[1.2rem] leading-[1.2] text-[var(--ink)]">
                      {item.title}
                    </span>
                    <span className="text-[0.875rem] leading-[1.5] text-[var(--soft)]">
                      {item.subtitle}
                    </span>
                    <span className="mt-1.5 flex items-center gap-1.5" aria-hidden="true">
                      {item.swatches.map((hex) => (
                        <i
                          key={hex}
                          style={{ backgroundColor: hex }}
                          className="block h-2.5 w-2.5 rounded-full ring-1 ring-black/15 dark:ring-white/20"
                        />
                      ))}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* 右侧：配置文件与实机界面预览窗口 */}
          <div className="flex min-h-[22rem] flex-col overflow-hidden rounded-2xl border border-[var(--rule)] bg-[var(--card)] shadow-[0_24px_56px_-34px_rgba(15,23,42,0.35)]">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--rule)] bg-[var(--paper)] px-4 py-2.5 font-[family-name:var(--sans)] text-[0.75rem]">
              <span className="font-[family-name:var(--mono)] text-[var(--soft)]">
                {current.fileName}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setViewTab('code')}
                  className={`inline-flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1 transition-colors ${
                    viewTab === 'code'
                      ? 'bg-[var(--accent-soft)] font-medium text-[var(--accent)]'
                      : 'text-[var(--soft)] hover:text-[var(--ink)]'
                  }`}
                >
                  <TerminalWindow size={14} />
                  <span>{isZh ? '配置与命令' : 'Config & CLI'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewTab('screenshot')}
                  className={`inline-flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1 transition-colors ${
                    viewTab === 'screenshot'
                      ? 'bg-[var(--accent-soft)] font-medium text-[var(--accent)]'
                      : 'text-[var(--soft)] hover:text-[var(--ink)]'
                  }`}
                >
                  <ImageSquare size={14} />
                  <span>{isZh ? '实机界面' : 'Native UI'}</span>
                </button>

                {viewTab === 'code' ? (
                  <button
                    type="button"
                    onClick={handleCopyCurrent}
                    className="ml-1 inline-flex cursor-pointer items-center gap-1 rounded-lg border border-[var(--rule)] bg-[var(--card)] px-2 py-1 text-[var(--soft)] transition-colors hover:text-[var(--ink)] active:scale-[0.98]"
                  >
                    {copied ? (
                      <Check size={13} weight="bold" className="text-[var(--accent)]" />
                    ) : (
                      <Copy size={13} />
                    )}
                    <span>{copied ? commonCopy.copiedLabel : commonCopy.copyLabel}</span>
                  </button>
                ) : null}
              </div>
            </div>

            {viewTab === 'code' ? (
              <div className="no-scrollbar flex-1 overflow-x-auto p-4 sm:p-5 font-[family-name:var(--mono)] text-[0.8125rem] leading-[1.8]">
                {current.codeLines.map((row) => (
                  <div key={row.lineNo} className="flex whitespace-pre">
                    <span className="mr-5 inline-block w-6 select-none text-right text-[var(--quiet)]">
                      {row.lineNo}
                    </span>
                    <span
                      className={
                        row.tone === 'comment'
                          ? 'text-[var(--quiet)] italic'
                          : row.tone === 'section'
                            ? 'font-medium text-[var(--accent)]'
                            : 'text-[var(--ink)]'
                      }
                    >
                      {row.content}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-1 flex-col justify-between bg-[var(--frame)] p-4">
                <div className="overflow-hidden rounded-xl border border-[var(--rule)] bg-[var(--card)]">
                  <img
                    src={current.previewScreenshot}
                    alt={current.previewCaption}
                    loading="lazy"
                    className="max-h-[18.5rem] w-full object-contain"
                  />
                </div>
                <p className="mt-2.5 font-[family-name:var(--sans)] text-[0.75rem] text-[var(--soft)]">
                  {current.previewCaption}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
