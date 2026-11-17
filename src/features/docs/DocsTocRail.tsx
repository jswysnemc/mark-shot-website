import { useEffect, useState } from 'react';
import { ListBullets } from '@phosphor-icons/react';
import type { DocSubSection } from '@/types/docs';

interface DocsTocRailProps {
  heading: string;
  chapterId: string;
  sections: DocSubSection[];
}

/**
 * 【右栏目录】【本页小节追踪】基于 IntersectionObserver 追踪当前阅读小节并以柔和圆角胶囊高亮，零 scroll 事件监听
 * @param props 目录标题、当前章节标识与二级小节列表
 * @returns 右侧吸顶目录栏节点
 */
export function DocsTocRail({ heading, chapterId, sections }: DocsTocRailProps) {
  const [activeSubId, setActiveSubId] = useState<string>(sections[0]?.id ?? '');

  useEffect(() => {
    setActiveSubId(sections[0]?.id ?? '');
    const elements = sections
      .map((sec) => document.getElementById(sec.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) {
      return;
    }

    // 1. 通过视口上方观察区自动切换当前阅读小节标识
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible?.target.id) {
          setActiveSubId(visible.target.id);
        }
      },
      { rootMargin: '-84px 0px -68% 0px', threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [chapterId, sections]);

  if (sections.length === 0) {
    return null;
  }

  return (
    <aside className="hidden xl:block">
      <div className="sticky top-22 space-y-2.5 font-[family-name:var(--sans)]">
        <div className="flex items-center gap-1.5 px-2.5 text-[0.78rem] font-medium text-[var(--quiet)]">
          <ListBullets size={15} />
          <span>{heading}</span>
        </div>

        <ul className="space-y-1 text-[0.8125rem]">
          {sections.map((sec) => {
            const isActive = sec.id === activeSubId;
            return (
              <li key={sec.id}>
                <a
                  href={`#${sec.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveSubId(sec.id);
                    document
                      .getElementById(sec.id)
                      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`block rounded-lg px-2.5 py-1.5 leading-[1.4] transition-colors ${
                    isActive
                      ? 'bg-[var(--accent-soft)] font-medium text-[var(--accent)]'
                      : 'text-[var(--soft)] hover:bg-[color-mix(in_srgb,var(--ink)_5%,transparent)] hover:text-[var(--ink)]'
                  }`}
                >
                  {sec.heading}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
