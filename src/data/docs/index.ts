import type { DocsBundle } from '@/types/docs';
import type { Locale } from '@/types/locale';
import { withBase } from '@/utils/paths';
import { docsGettingStartedZh } from '@/data/docs/docs-getting-started-zh';
import { docsToolsMediaZh } from '@/data/docs/docs-tools-media-zh';
import { docsConfigPlatformZh } from '@/data/docs/docs-config-platform-zh';
import { docsGettingStartedEn } from '@/data/docs/docs-getting-started-en';
import { docsToolsMediaEn } from '@/data/docs/docs-tools-media-en';
import { docsConfigPlatformEn } from '@/data/docs/docs-config-platform-en';

/**
 * 【细则文档库】【按语言装配】聚合五大分类与十个核心章节，并统一解析静态截图的 BASE_PATH 前缀
 * @param locale 目标语言标识
 * @returns 完整结构化文档数据包
 */
export function getDocsBundle(locale: Locale): DocsBundle {
  const isZh = locale === 'zh-cn';
  const rawChapters = isZh
    ? [...docsGettingStartedZh, ...docsToolsMediaZh, ...docsConfigPlatformZh]
    : [...docsGettingStartedEn, ...docsToolsMediaEn, ...docsConfigPlatformEn];

  // 1. 为文档内的实机截图路径补全 GitHub Pages 子路径前缀
  const chapters = rawChapters.map((chapter) => ({
    ...chapter,
    sections: chapter.sections.map((sec) => ({
      ...sec,
      blocks: sec.blocks.map((block) =>
        block.kind === 'screenshot'
          ? { ...block, src: withBase(block.src) }
          : block
      ),
    })),
  }));

  // 2. 组装语言对应的导航分类组与搜索提示文案
  if (isZh) {
    return {
      searchPlaceholder: '搜索文档或快捷键...',
      searchEmptyText: '未匹配到相关章节，请尝试搜索如 OCR、Wayland、Ctrl+P 或 upload',
      searchHitPrefix: '搜索匹配结果',
      tocHeading: '本页小节',
      mobileNavButton: '目录与检索',
      prevChapterLabel: '上一章',
      nextChapterLabel: '下一章',
      categories: [
        { id: 'getting-started', label: '开始使用', iconName: 'rocket' },
        { id: 'pin-scroll', label: '贴图与长截图', iconName: 'pin' },
        { id: 'annotation', label: '标注与测量', iconName: 'pencil' },
        { id: 'ocr-record', label: '识别、翻译与录屏', iconName: 'scan' },
        { id: 'config-platform', label: '配置、快捷键与平台', iconName: 'sliders' },
      ],
      chapters,
    };
  }

  return {
    searchPlaceholder: 'Search manual...',
    searchEmptyText: 'No matching chapters found. Try OCR, Wayland, Ctrl+P, or upload.',
    searchHitPrefix: 'Search matches',
    tocHeading: 'On this page',
    mobileNavButton: 'Chapters',
    prevChapterLabel: 'Previous',
    nextChapterLabel: 'Next',
    categories: [
      { id: 'getting-started', label: 'Getting Started', iconName: 'rocket' },
      { id: 'pin-scroll', label: 'Pin & Scroll Capture', iconName: 'pin' },
      { id: 'annotation', label: 'Annotation & Rulers', iconName: 'pencil' },
      { id: 'ocr-record', label: 'OCR, Translate & Record', iconName: 'scan' },
      { id: 'config-platform', label: 'Config, Keys & Backends', iconName: 'sliders' },
    ],
    chapters,
  };
}
