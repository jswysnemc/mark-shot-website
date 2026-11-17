import type { BenchmarkItem } from '@/types/benchmark';
import type { Locale } from '@/types/locale';

/**
 * 【实测数据】【按需读取】返回基于仓库真实基准测试报告的四项核心性能指标
 * @param locale 当前语言代码
 * @returns 实测指标数组
 */
export function getBenchmarksData(locale: Locale): BenchmarkItem[] {
  // 1. 返回简体中文实测指标与对比标尺
  if (locale === 'zh-cn') {
    return [
      {
        id: 'timeline',
        tag: '常驻唤起',
        value: '31.6',
        unit: 'ms',
        label: '托盘常驻下唤起截图表面的中位数耗时（P95 为 34.0 ms）',
        highlightAccent: true,
        captionLeft: '0 ms',
        captionRight: '1400 ms',
        badgeText: '冷启动首帧 102.8 ms',
        comparisons: [
          { name: 'Mark Shot 0.2', ms: 31.6, isSelf: true },
          { name: 'Qt 0.1.62', ms: 158.2 },
          { name: 'Shotori GPUI', ms: 297.3 },
          { name: 'Flameshot', ms: 1351.4 },
        ],
      },
      {
        id: 'memory',
        tag: '后台内存',
        value: '21.6',
        unit: 'MiB',
        label: '托盘常驻稳态 RSS（PSS 16.9 MiB），连续取消截图后零泄漏回落',
        captionLeft: '启动稳态',
        captionRight: '连续 8 次取消后 21.6 MiB',
        badgeText: 'PSS 16.9 MiB',
      },
      {
        id: 'fps',
        tag: '画布交互',
        value: '62.3',
        unit: 'fps',
        label: '3840x2160 选区拖动、矩形与画笔完整缓冲提交帧率（P95 间隔 17.2 ms）',
        captionLeft: '128px 边缘损坏分块',
        captionRight: '双缓冲零拷贝复用',
        badgeText: 'P95 17.2 ms',
      },
      {
        id: 'binary',
        tag: '单文件主程序',
        value: '27.7',
        unit: 'MB',
        label: '剥离符号后的原生 ELF 可执行文件，内置 Inter 与序号字体，OCR 按需下载',
        captionLeft: '0 MB',
        captionRight: '较静态基线缩减 44.5%',
        badgeText: '26.42 MiB ELF',
      },
    ];
  }

  // 2. 返回英文实测指标与对比标尺
  return [
    {
      id: 'timeline',
      tag: 'Tray Wake',
      value: '31.6',
      unit: 'ms',
      label: 'Median compositor surface wake from resident tray (34.0 ms P95)',
      highlightAccent: true,
      captionLeft: '0 ms',
      captionRight: '1400 ms',
      badgeText: '102.8 ms cold frame',
      comparisons: [
        { name: 'Mark Shot 0.2', ms: 31.6, isSelf: true },
        { name: 'Qt 0.1.62', ms: 158.2 },
        { name: 'Shotori GPUI', ms: 297.3 },
        { name: 'Flameshot', ms: 1351.4 },
      ],
    },
    {
      id: 'memory',
      tag: 'Idle Memory',
      value: '21.6',
      unit: 'MiB',
      label: 'Steady-state background RSS (16.9 MiB PSS), returning cleanly after repeated cancels',
      captionLeft: 'Boot steady',
      captionRight: '21.6 MiB after 8 cancels',
      badgeText: '16.9 MiB PSS',
    },
    {
      id: 'fps',
      tag: 'Canvas Rate',
      value: '62.3',
      unit: 'fps',
      label: 'Full-frame Wayland buffer commits during 3840x2160 drag, rect, and pen input',
      captionLeft: '128px border damage tiles',
      captionRight: 'Dual-buffer reuse',
      badgeText: '17.2 ms P95',
    },
    {
      id: 'binary',
      tag: 'Single Binary',
      value: '27.7',
      unit: 'MB',
      label: 'Stripped native ELF bundling Inter and numeral fonts; OCR runtime downloads on demand',
      captionLeft: '0 MB',
      captionRight: '44.5% smaller vs static',
      badgeText: '26.42 MiB ELF',
    },
  ];
}
