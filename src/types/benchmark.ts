/**
 * 单项性能实测指标的可视化种类
 */
export type BenchmarkVizKind = 'timeline' | 'memory' | 'fps' | 'binary';

/**
 * 实测对比卡片数据结构
 */
export interface BenchmarkItem {
  id: BenchmarkVizKind;
  tag: string;
  value: string;
  unit: string;
  label: string;
  highlightAccent?: boolean;
  captionLeft: string;
  captionRight: string;
  badgeText?: string;
  comparisons?: Array<{
    name: string;
    ms: number;
    isSelf?: boolean;
  }>;
}
