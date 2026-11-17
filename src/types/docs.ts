/**
 * 细则文档章节所属的一级分类标识
 */
export type DocCategoryId =
  | 'getting-started'
  | 'pin-scroll'
  | 'annotation'
  | 'ocr-record'
  | 'config-platform';

/**
 * 细则文档内单个结构化内容块联合类型
 */
export type DocContentBlock =
  | {
      kind: 'prose';
      paragraphs: string[];
    }
  | {
      kind: 'code';
      label: string;
      code: string;
    }
  | {
      kind: 'kvGrid';
      columns?: 2 | 3;
      items: Array<{
        term: string;
        badge?: string;
        detail: string;
      }>;
    }
  | {
      kind: 'keyGrid';
      items: Array<{
        keys: string;
        action: string;
        configKey?: string;
      }>;
    }
  | {
      kind: 'callout';
      title: string;
      body: string;
    }
  | {
      kind: 'screenshot';
      src: string;
      alt: string;
      caption: string;
    };

/**
 * 章节下的二级小节定义（用于右栏本页目录锚点）
 */
export interface DocSubSection {
  id: string;
  heading: string;
  blocks: DocContentBlock[];
}

/**
 * 细则文档独立章节结构
 */
export interface DocChapter {
  id: string;
  categoryId: DocCategoryId;
  title: string;
  summary: string;
  sections: DocSubSection[];
}

/**
 * 左侧导航分类组结构
 */
export interface DocCategoryGroup {
  id: DocCategoryId;
  label: string;
  iconName: 'rocket' | 'pin' | 'pencil' | 'scan' | 'sliders';
}

/**
 * 完整语言版本的细则文档数据包
 */
export interface DocsBundle {
  searchPlaceholder: string;
  searchEmptyText: string;
  searchHitPrefix: string;
  tocHeading: string;
  mobileNavButton: string;
  prevChapterLabel: string;
  nextChapterLabel: string;
  categories: DocCategoryGroup[];
  chapters: DocChapter[];
}
