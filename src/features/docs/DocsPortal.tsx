import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  List,
  MagnifyingGlass,
  PencilLine,
  PushPin,
  RocketLaunch,
  Scan,
  SlidersHorizontal,
  X,
} from '@phosphor-icons/react';
import type {
  DocCategoryGroup,
  DocChapter,
  DocsBundle,
} from '@/types/docs';
import { DocsBlockRenderer } from '@/features/docs/DocsBlockRenderer';
import { DocsTocRail } from '@/features/docs/DocsTocRail';

interface DocsPortalProps {
  bundle: DocsBundle;
  copyLabel: string;
  copiedLabel: string;
  copiedToast: string;
}

interface SearchHit {
  chapterId: string;
  chapterTitle: string;
  subId: string;
  subHeading: string;
  snippet: string;
}

/**
 * 【分类图标】【映射渲染】根据文档一级分类图标标识返回对应 Phosphor 线性图标
 * @param name 图标枚举名
 * @returns 图标节点
 */
function renderCategoryIcon(name: DocCategoryGroup['iconName']) {
  if (name === 'rocket') return <RocketLaunch size={15} />;
  if (name === 'pin') return <PushPin size={15} />;
  if (name === 'pencil') return <PencilLine size={15} />;
  if (name === 'scan') return <Scan size={15} />;
  return <SlidersHorizontal size={15} />;
}

/**
 * 【全文检索】【扁平提取】将单个章节内的全部文本扁平化以便关键字即时匹配
 * @param chapter 文档章节对象
 * @param keyword 小写检索词
 * @returns 匹配到的小节摘要列表
 */
function matchChapterHits(chapter: DocChapter, keyword: string): SearchHit[] {
  const hits: SearchHit[] = [];
  for (const sec of chapter.sections) {
    const bucket: string[] = [chapter.title, chapter.summary, sec.heading];
    for (const block of sec.blocks) {
      if (block.kind === 'prose') bucket.push(...block.paragraphs);
      if (block.kind === 'code') bucket.push(block.label, block.code);
      if (block.kind === 'callout') bucket.push(block.title, block.body);
      if (block.kind === 'kvGrid') {
        block.items.forEach((it) =>
          bucket.push(it.term, it.badge ?? '', it.detail)
        );
      }
      if (block.kind === 'keyGrid') {
        block.items.forEach((it) =>
          bucket.push(it.keys, it.action, it.configKey ?? '')
        );
      }
    }
    const joined = bucket.join(' · ');
    const idx = joined.toLowerCase().indexOf(keyword);
    if (idx !== -1) {
      const start = Math.max(0, idx - 32);
      const snippet = joined.slice(start, start + 118);
      hits.push({
        chapterId: chapter.id,
        chapterTitle: chapter.title,
        subId: sec.id,
        subHeading: sec.heading,
        snippet: start > 0 ? `...${snippet}...` : `${snippet}...`,
      });
    }
  }
  return hits;
}

/**
 * 【细则文档中心】【三栏主门户】融合 PixPin 文档站左导航+Ctrl+K 搜索、中栏细则卡片流与右栏本页目录
 * @param props 结构化双语文档包与复制提示文案
 * @returns 响应式三栏文档门户组件
 */
export function DocsPortal({
  bundle,
  copyLabel,
  copiedLabel,
  copiedToast,
}: DocsPortalProps) {
  const [activeChapterId, setActiveChapterId] = useState<string>(
    bundle.chapters[0]?.id ?? 'overview'
  );
  const [query, setQuery] = useState('');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // 1. 解析 URL hash 锚点，支持从首页卡片直接深跳至指定章节或二级小节
  useEffect(() => {
    const syncFromHash = () => {
      const raw = window.location.hash.replace(/^#/, '').trim();
      if (!raw) {
        return;
      }
      const directChapter = bundle.chapters.find((ch) => ch.id === raw);
      if (directChapter) {
        setActiveChapterId(directChapter.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      for (const ch of bundle.chapters) {
        const sub = ch.sections.find((s) => s.id === raw);
        if (sub) {
          setActiveChapterId(ch.id);
          window.setTimeout(() => {
            document
              .getElementById(sub.id)
              ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 60);
          return;
        }
      }
    };

    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, [bundle.chapters]);

  // 2. 绑定全局 Ctrl+K / Cmd+K 聚焦左侧检索框
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const currentIdx = Math.max(
    0,
    bundle.chapters.findIndex((ch) => ch.id === activeChapterId)
  );
  const currentChapter = bundle.chapters[currentIdx] ?? bundle.chapters[0]!;
  const currentCategory = bundle.categories.find(
    (cat) => cat.id === currentChapter.categoryId
  );
  const prevChapter = currentIdx > 0 ? bundle.chapters[currentIdx - 1] : null;
  const nextChapter =
    currentIdx < bundle.chapters.length - 1
      ? bundle.chapters[currentIdx + 1]
      : null;

  const searchHits = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return [];
    }
    return bundle.chapters.flatMap((ch) => matchChapterHits(ch, trimmed));
  }, [bundle.chapters, query]);

  /**
   * 【章节切换】【更新锚点】切换激活章节、关闭移动抽屉并同步地址栏 hash
   * @param chapterId 目标章节 ID
   * @param subId 可选二级小节 ID
   * @returns 无返回值
   */
  const selectChapter = (chapterId: string, subId?: string) => {
    setActiveChapterId(chapterId);
    setQuery('');
    setMobileDrawerOpen(false);
    const nextHash = `#${subId ?? chapterId}`;
    window.history.replaceState(null, '', nextHash);
    if (subId) {
      window.setTimeout(() => {
        document
          .getElementById(subId)
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderCategoryTree = () => (
    <nav aria-label="Documentation chapters" className="space-y-5 font-[family-name:var(--sans)]">
      {bundle.categories.map((cat) => {
        const catChapters = bundle.chapters.filter(
          (ch) => ch.categoryId === cat.id
        );
        return (
          <div key={cat.id} className="space-y-1.5">
            <div className="flex items-center gap-1.5 px-2.5 text-[0.78rem] font-semibold text-[var(--quiet)]">
              {renderCategoryIcon(cat.iconName)}
              <span>{cat.label}</span>
            </div>
            <ul className="space-y-0.5">
              {catChapters.map((ch) => {
                const active = ch.id === currentChapter.id && !query.trim();
                return (
                  <li key={ch.id}>
                    <button
                      type="button"
                      onClick={() => selectChapter(ch.id)}
                      className={`w-full cursor-pointer rounded-xl px-3 py-2 text-left text-[0.85rem] leading-[1.38] transition-colors ${
                        active
                          ? 'bg-[var(--accent-soft)] font-medium text-[var(--accent)]'
                          : 'text-[var(--soft)] hover:bg-[color-mix(in_srgb,var(--ink)_5%,transparent)] hover:text-[var(--ink)]'
                      }`}
                    >
                      {ch.title}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );

  return (
    <section className="relative" data-section>
      <div className="wrap pt-6 pb-16 md:pt-9 md:pb-24">
        {/* 移动端顶部快捷检索与章节目录展开栏 */}
        <div className="mb-5 flex flex-col gap-2.5 lg:hidden">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileDrawerOpen((v) => !v)}
              className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-[var(--rule)] bg-[var(--card)] px-3 py-2 font-[family-name:var(--sans)] text-[0.84rem] font-medium text-[var(--ink)]"
            >
              {mobileDrawerOpen ? <X size={16} /> : <List size={16} />}
              <span>{bundle.mobileNavButton}</span>
            </button>

            <div className="relative flex-1">
              <MagnifyingGlass
                size={15}
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[var(--quiet)]"
              />
              <input
                id="docs-mobile-search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={bundle.searchPlaceholder}
                aria-label={bundle.searchPlaceholder}
                className="h-9.5 w-full rounded-xl border border-[var(--rule)] bg-[var(--card)] pr-3 pl-9 font-[family-name:var(--sans)] text-[0.84rem] text-[var(--ink)] placeholder:text-[var(--quiet)] focus:border-[var(--accent)] focus:outline-none"
              />
            </div>
          </div>

          {mobileDrawerOpen ? (
            <div className="rounded-2xl border border-[var(--rule)] bg-[var(--card)] p-4 shadow-lg">
              {renderCategoryTree()}
            </div>
          ) : null}
        </div>

        {/* 桌面三栏主体：左分类与搜索 + 中栏细则正文 + 右栏本页小节目录 */}
        <div className="mx-auto grid max-w-[1160px] grid-cols-1 gap-8 lg:grid-cols-[244px_minmax(0,1fr)] xl:grid-cols-[244px_minmax(0,1fr)_200px]">
          {/* 左侧固定章节与搜索栏 */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 max-h-[calc(100dvh-6rem)] space-y-5 overflow-y-auto pr-2">
              <div className="relative">
                <MagnifyingGlass
                  size={15}
                  className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[var(--quiet)]"
                />
                <input
                  id="docs-desktop-search"
                  ref={searchInputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={bundle.searchPlaceholder}
                  aria-label={bundle.searchPlaceholder}
                  className="h-9.5 w-full rounded-xl border border-[var(--rule)] bg-[var(--card)] pr-15 pl-9 font-[family-name:var(--sans)] text-[0.8125rem] text-[var(--ink)] placeholder:text-[var(--quiet)] focus:border-[var(--accent)] focus:outline-none"
                />
                <kbd className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 rounded border border-[var(--rule)] bg-[var(--frame)] px-1.5 py-0.5 font-[family-name:var(--mono)] text-[0.65rem] text-[var(--quiet)]">
                  Ctrl K
                </kbd>
              </div>

              {renderCategoryTree()}
            </div>
          </aside>

          {/* 中栏：全文检索结果流 或 当前激活章节细则正文 */}
          <div className="min-w-0">
            {query.trim() ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--rule)] pb-3 font-[family-name:var(--sans)] text-[0.875rem] text-[var(--soft)]">
                  <span>
                    {bundle.searchHitPrefix} ({searchHits.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    aria-label="Clear search"
                    className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-[var(--accent)] transition-colors hover:bg-[var(--accent-soft)]"
                  >
                    <X size={15} />
                  </button>
                </div>

                {searchHits.length === 0 ? (
                  <div className="rounded-2xl border border-[var(--rule)] bg-[var(--card)] p-8 text-center font-[family-name:var(--sans)] text-[0.9rem] text-[var(--soft)]">
                    {bundle.searchEmptyText}
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {searchHits.map((hit) => (
                      <li key={`${hit.chapterId}-${hit.subId}`}>
                        <button
                          type="button"
                          onClick={() => selectChapter(hit.chapterId, hit.subId)}
                          className="w-full cursor-pointer rounded-2xl border border-[var(--rule)] bg-[var(--card)] p-4 text-left transition-colors hover:border-[var(--accent)]"
                        >
                          <div className="font-[family-name:var(--sans)] text-[0.78rem] font-medium text-[var(--accent)]">
                            {hit.chapterTitle} / {hit.subHeading}
                          </div>
                          <p className="mt-1.5 font-[family-name:var(--sans)] text-[0.85rem] leading-[1.55] text-[var(--soft)]">
                            {hit.snippet}
                          </p>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <article className="space-y-10">
                <header className="border-b border-[var(--rule)] pb-6">
                  {currentCategory ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-soft)] px-3 py-0.5 font-[family-name:var(--sans)] text-[0.78rem] font-medium text-[var(--accent)]">
                      {renderCategoryIcon(currentCategory.iconName)}
                      <span>{currentCategory.label}</span>
                    </span>
                  ) : null}

                  <h1 className="mt-3 text-[clamp(1.75rem,2.8vw,2.4rem)] leading-[1.16] font-normal text-[var(--ink)]">
                    {currentChapter.title}
                  </h1>
                  <p className="mt-3 text-[1.03rem] leading-[1.65] text-[var(--soft)]">
                    {currentChapter.summary}
                  </p>
                </header>

                <div className="space-y-11">
                  {currentChapter.sections.map((sec) => (
                    <section
                      key={sec.id}
                      id={sec.id}
                      className="scroll-mt-24 space-y-4"
                    >
                      <h2 className="font-[family-name:var(--sans)] text-[1.22rem] font-semibold leading-[1.3] text-[var(--ink)]">
                        {sec.heading}
                      </h2>
                      <div className="space-y-4">
                        {sec.blocks.map((block, bIdx) => (
                          <DocsBlockRenderer
                            key={bIdx}
                            block={block}
                            copyLabel={copyLabel}
                            copiedLabel={copiedLabel}
                            copiedToast={copiedToast}
                          />
                        ))}
                      </div>
                    </section>
                  ))}
                </div>

                {/* 底部上下章翻页卡片 */}
                <footer className="grid grid-cols-1 gap-3.5 border-t border-[var(--rule)] pt-7 font-[family-name:var(--sans)] sm:grid-cols-2">
                  {prevChapter ? (
                    <button
                      type="button"
                      onClick={() => selectChapter(prevChapter.id)}
                      className="flex cursor-pointer flex-col items-start gap-1 rounded-2xl border border-[var(--rule)] bg-[var(--card)] p-4 text-left transition-colors hover:border-[var(--accent)]"
                    >
                      <span className="inline-flex items-center gap-1 text-[0.75rem] text-[var(--quiet)]">
                        <ArrowLeft size={13} />
                        <span>{bundle.prevChapterLabel}</span>
                      </span>
                      <span className="text-[0.9375rem] font-medium text-[var(--ink)]">
                        {prevChapter.title}
                      </span>
                    </button>
                  ) : (
                    <div />
                  )}

                  {nextChapter ? (
                    <button
                      type="button"
                      onClick={() => selectChapter(nextChapter.id)}
                      className="flex cursor-pointer flex-col items-end gap-1 rounded-2xl border border-[var(--rule)] bg-[var(--card)] p-4 text-right transition-colors hover:border-[var(--accent)]"
                    >
                      <span className="inline-flex items-center gap-1 text-[0.75rem] text-[var(--quiet)]">
                        <span>{bundle.nextChapterLabel}</span>
                        <ArrowRight size={13} />
                      </span>
                      <span className="text-[0.9375rem] font-medium text-[var(--ink)]">
                        {nextChapter.title}
                      </span>
                    </button>
                  ) : null}
                </footer>
              </article>
            )}
          </div>

          {/* 右栏：本页二级小节目录 */}
          <DocsTocRail
            heading={bundle.tocHeading}
            chapterId={currentChapter.id}
            sections={query.trim() ? [] : currentChapter.sections}
          />
        </div>
      </div>
    </section>
  );
}
