import type { Locale } from '@/types/locale';

/**
 * Bento 能力卡片插画种类
 */
export type CapabilityVisualKind =
  | 'tools'
  | 'frame'
  | 'pin'
  | 'ocr'
  | 'scroll'
  | 'record-cli';

/**
 * 首页 6 列不对称 Bento 单元格数据
 */
export interface CapabilityCardItem {
  id: CapabilityVisualKind;
  span: 2 | 3 | 4;
  title: string;
  description: string;
}

/**
 * 【能力矩阵】【数据读取】返回 6 项严格对应 6 列网格的不对称 Bento 能力描述（无空白格）
 * @param locale 当前语言代码
 * @returns 6 个 Bento 单元格配置（列宽分布为 4+2 / 2+4 / 3+3）
 */
export function getCapabilitiesData(locale: Locale): CapabilityCardItem[] {
  // 1. 中文版能力卡片列表
  if (locale === 'zh-cn') {
    return [
      {
        id: 'tools',
        span: 4,
        title: '19 种矢量标注与双框放大镜',
        description:
          '内凹实心直箭头双击即可插入控制点弯曲路径；序号支持数字、字母、罗马数字与天干七种计数；放大镜源框与镜框独立平移并按倍率联动缩放。',
      },
      {
        id: 'frame',
        span: 2,
        title: '圆角阴影导出外框',
        description:
          '复制或保存时自动叠加透明留白、圆角与柔和投影，设置面板支持实时像素级预览，贴图保持无框原图。',
      },
      {
        id: 'pin',
        span: 2,
        title: '置顶贴图与划词复制',
        description:
          '截图或剪贴板图文一键置顶；在文字区域拖动即可选字复制，其余区域拖动窗口，滚轮无级缩放。',
      },
      {
        id: 'ocr',
        span: 4,
        title: '本地 PP-OCRv5 与原位译文覆盖',
        description:
          '离线识别文字与表格结构，一键导出 TSV、CSV、Markdown 或 HTML；接入 Index-Translate、OpenAI、Claude、Gemini 等翻译接口并将译文贴回原图位置。',
      },
      {
        id: 'scroll',
        span: 3,
        title: '18x24 亮度签名滚动长截图',
        description:
          '在原始帧直接比对亮度签名跳过重复帧，固定像素块按需增长，长图复制采用 64 KiB 匿名流式传输。',
      },
      {
        id: 'record-cli',
        span: 3,
        title: '硬件编码录屏与 JSON 无界面截图',
        description:
          '支持 MP4、MKV 与逐帧量化 GIF，自动启用硬件编码并采集系统或麦克风音频；脚本调用直接输出结构化 JSON 报告。',
      },
    ];
  }

  // 2. 英文版能力卡片列表
  return [
    {
      id: 'tools',
      span: 4,
      title: '19 Vector Tools & Linked Dual-Box Magnifier',
      description:
        'Double-click concave arrows to bend curves; place 7 numeral styles from Arabic to Roman; pan magnifier source and lens boxes independently at locked zoom.',
    },
    {
      id: 'frame',
      span: 2,
      title: 'Rounded Shadow Export Frame',
      description:
        'Add transparent padding, corner radius, and soft drop shadows on save or copy with live settings preview while keeping pins borderless.',
    },
    {
      id: 'pin',
      span: 2,
      title: 'Topmost Pins & Text Drag-Copy',
      description:
        'Pin captures or clipboard content above workspaces; drag across detected text to copy words, or drag elsewhere to reposition.',
    },
    {
      id: 'ocr',
      span: 4,
      title: 'Local PP-OCRv5 & In-Place Translation',
      description:
        'Extract editable text and export tables to TSV, CSV, Markdown, or HTML; overlay translations via Index-Translate, OpenAI, Claude, Gemini, or custom scripts.',
    },
    {
      id: 'scroll',
      span: 3,
      title: 'Luminance-Signature Scroll Stitching',
      description:
        'Deduplicate frames via 18x24 luminance signatures before cropping and stream multi-megapixel PNGs to Wayland clipboards in 64 KiB chunks.',
    },
    {
      id: 'record-cli',
      span: 3,
      title: 'Hardware Recording & Headless JSON CLI',
      description:
        'Record MP4, MKV, or per-frame quantized GIF with pause/resume and audio capture, or run headless captures emitting compact JSON summaries.',
    },
  ];
}
