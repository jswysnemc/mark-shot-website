export const STAGE_W = 1160;
export const STAGE_H = 702;

export type DrawToolId =
  | 'selection'
  | 'pick'
  | 'pen'
  | 'line'
  | 'highlighter'
  | 'rectangle'
  | 'circle'
  | 'marker'
  | 'arrow'
  | 'text'
  | 'number'
  | 'redact'
  | 'magnifier'
  | 'ruler'
  | 'laser'
  | 'eyedropper'
  | 'recording';

export type NumeralFormat = '123' | 'ABC' | 'ROMAN' | 'STEM';
export type FilterKind = 'pixelate' | 'blur' | 'spotlight' | 'invert';
export type ArrowHeadKind = 'concave' | 'solid' | 'open';
export type StrokeDashKind = 'solid' | 'dashed' | 'dotted';
export type AspectPreset = 'Free' | '16:9' | '16:10' | '4:3' | '1:1';

export interface SelectionBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export type CanvasAnnotation =
  | {
      id: string;
      kind: 'rect' | 'ellipse';
      x: number;
      y: number;
      w: number;
      h: number;
      color: string;
      strokeWidth: number;
      filled: boolean;
      radius: number;
    }
  | {
      id: string;
      kind: 'arrow' | 'line';
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      color: string;
      strokeWidth: number;
      head: ArrowHeadKind;
      dash: StrokeDashKind;
    }
  | {
      id: string;
      kind: 'pen' | 'highlighter';
      points: Array<{ x: number; y: number }>;
      color: string;
      strokeWidth: number;
    }
  | {
      id: string;
      kind: 'number';
      x: number;
      y: number;
      tailX?: number;
      tailY?: number;
      seq: number;
      format: NumeralFormat;
      color: string;
    }
  | {
      id: string;
      kind: 'magnifier';
      srcX: number;
      srcY: number;
      lensX: number;
      lensY: number;
      lensRadius: number;
      zoom: number;
      square: boolean;
      color: string;
      strokeWidth: number;
    }
  | {
      id: string;
      kind: 'ruler';
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      color: string;
    }
  | {
      id: string;
      kind: 'redact';
      x: number;
      y: number;
      w: number;
      h: number;
      filter: FilterKind;
      intensity: number;
      radius: number;
    }
  | {
      id: string;
      kind: 'text';
      x: number;
      y: number;
      text: string;
      color: string;
      fontSize: number;
      hasBg: boolean;
    };

export const PRESET_COLORS = [
  '#FF4D4D',
  '#F97316',
  '#EAB308',
  '#10B981',
  '#0D9488',
  '#3B82F6',
  '#8B5CF6',
  '#F8FAFC',
];

/**
 * 【序号格式】【标签转换】按七类计数风格中的代表格式转换序号文本
 * @param seq 从 1 开始的序号整数
 * @param format 当前选中的序号格式
 * @returns 显示在圆章内的短文本
 */
export function formatStepSeq(seq: number, format: NumeralFormat): string {
  // 1. 匹配大写英文字母序列
  if (format === 'ABC') {
    return String.fromCharCode(64 + (((seq - 1) % 26) + 1));
  }
  // 2. 匹配罗马数字序列
  if (format === 'ROMAN') {
    const romans = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
    return romans[(seq - 1) % romans.length] ?? String(seq);
  }
  // 3. 匹配天干序列
  if (format === 'STEM') {
    const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬'];
    return stems[(seq - 1) % stems.length] ?? String(seq);
  }
  return String(seq);
}

/**
 * 【初始场景】【默认图元】构建与 niri-use 实机画面一致的矩形、内凹箭头、带尾序号、双圆切线放大镜与像素标尺
 * @returns 初始标注图元列表
 */
export function createInitialAnnotations(): CanvasAnnotation[] {
  return [
    {
      id: 'init-rect',
      kind: 'rect',
      x: 102,
      y: 96,
      w: 392,
      h: 138,
      color: '#FF4D4D',
      strokeWidth: 3,
      filled: false,
      radius: 4,
    },
    {
      id: 'init-num-arrow',
      kind: 'number',
      x: 598,
      y: 238,
      tailX: 504,
      tailY: 184,
      seq: 1,
      format: 'ABC',
      color: '#FF4D4D',
    },
    {
      id: 'init-magnifier',
      kind: 'magnifier',
      srcX: 734,
      srcY: 194,
      lensX: 882,
      lensY: 268,
      lensRadius: 68,
      zoom: 3.25,
      square: false,
      color: '#FF4D4D',
      strokeWidth: 3,
    },
    {
      id: 'init-ruler',
      kind: 'ruler',
      x1: 118,
      y1: 358,
      x2: 418,
      y2: 358,
      color: '#FF4D4D',
    },
  ];
}
