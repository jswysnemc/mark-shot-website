import type { Locale } from '@/types/locale';

/**
 * 主题与桌面协议切换项数据结构
 */
export interface ThemeProtocolItem {
  id: 'light-ui' | 'dark-ui' | 'wayland-native' | 'x11-windows';
  group: 'theme' | 'protocol';
  title: string;
  subtitle: string;
  swatches: string[];
  fileName: string;
  codeLines: Array<{
    lineNo: number;
    content: string;
    tone?: 'comment' | 'section' | 'key' | 'plain';
  }>;
  previewScreenshot: string;
  previewCaption: string;
}

/**
 * 【主题与协议】【配置读取】返回明暗画布主题与跨平台合成器配置展示数据
 * @param locale 当前语言代码
 * @returns 四组可切换的主题与协议详情
 */
export function getThemesProtocolsData(locale: Locale): ThemeProtocolItem[] {
  // 1. 简体中文配置项
  if (locale === 'zh-cn') {
    return [
      {
        id: 'light-ui',
        group: 'theme',
        title: '浅色画布 (238, 240, 242)',
        subtitle: '默认日间配色，工具栏 RGB (236, 238, 240)，透明原图导出逐字节无损',
        swatches: ['#eef0f2', '#ffffff', '#0d9488', '#161a19', '#f97316'],
        fileName: '~/.config/mark-shot/config.toml',
        previewScreenshot: '/images/settings-zh.png',
        previewCaption: '实机截图：浅色主题下的贴图边框与导出外框实时预览面板',
        codeLines: [
          { lineNo: 1, content: '# Ctrl+Shift+L 即时切换明暗界面，不修改原图像素', tone: 'comment' },
          { lineNo: 2, content: '[ui]', tone: 'section' },
          { lineNo: 3, content: 'theme = "light"', tone: 'key' },
          { lineNo: 4, content: 'launch_at_login = false', tone: 'key' },
          { lineNo: 5, content: '', tone: 'plain' },
          { lineNo: 6, content: '[export.image_frame]', tone: 'section' },
          { lineNo: 7, content: 'enabled = true', tone: 'key' },
          { lineNo: 8, content: 'padding = 112', tone: 'key' },
          { lineNo: 9, content: 'corner_radius = 18.0', tone: 'key' },
          { lineNo: 10, content: 'shadow_radius = 72', tone: 'key' },
        ],
      },
      {
        id: 'dark-ui',
        group: 'theme',
        title: '深色画布 (28, 31, 34)',
        subtitle: '低眩光夜间配色，工具栏 RGB (15, 16, 22)，跨进程同步贴图与 OCR 窗口',
        swatches: ['#1c1f22', '#0f1016', '#2dd4bf', '#e5e7eb', '#fb923c'],
        fileName: '~/.config/mark-shot/config.toml',
        previewScreenshot: '/images/settings-en.png',
        previewCaption: '实机截图：外观与主题立即生效控制页（支持 light / dark / system）',
        codeLines: [
          { lineNo: 1, content: '# 跨进程通知活动贴图、历史与文字识别窗口同步刷新', tone: 'comment' },
          { lineNo: 2, content: '[ui]', tone: 'section' },
          { lineNo: 3, content: 'theme = "dark"', tone: 'key' },
          { lineNo: 4, content: '', tone: 'plain' },
          { lineNo: 5, content: '[keys]', tone: 'section' },
          { lineNo: 6, content: 'toggle_theme = "Ctrl+Shift+L"', tone: 'key' },
          { lineNo: 7, content: 'finish_copy = "Ctrl+C"', tone: 'key' },
          { lineNo: 8, content: 'pin_selection = "Ctrl+P"', tone: 'key' },
          { lineNo: 9, content: 'start_ocr = "O"', tone: 'key' },
          { lineNo: 10, content: 'toggle_ruler = "U"', tone: 'key' },
        ],
      },
      {
        id: 'wayland-native',
        group: 'protocol',
        title: 'Wayland 原生协议栈',
        subtitle: '覆盖 niri、Sway、Hyprland、KDE ScreenShot2 与 GNOME PipeWire 门户',
        swatches: ['#0d9488', '#2563eb', '#10b981', '#64748b', '#0f172a'],
        fileName: '~/.config/niri/config.kdl · hyprland.conf',
        previewScreenshot: '/images/settings-zh.png',
        previewCaption: '原生协议直连：ext-image-copy-capture、wlr-screencopy、layer-shell 与 ext-data-control',
        codeLines: [
          { lineNo: 1, content: '// niri (~/.config/niri/config.kdl) 绑定快捷键', tone: 'comment' },
          { lineNo: 2, content: 'binds {', tone: 'section' },
          { lineNo: 3, content: '    Mod+Shift+S { spawn "mark-shot"; }', tone: 'key' },
          { lineNo: 4, content: '    Mod+Shift+O { spawn "mark-shot" "--ocr"; }', tone: 'key' },
          { lineNo: 5, content: '    Mod+Shift+L { spawn "mark-shot" "--scroll"; }', tone: 'key' },
          { lineNo: 6, content: '}', tone: 'section' },
          { lineNo: 7, content: '', tone: 'plain' },
          { lineNo: 8, content: '# Hyprland (~/.config/hypr/hyprland.conf)', tone: 'comment' },
          { lineNo: 9, content: 'bind = SUPER SHIFT, S, exec, mark-shot', tone: 'key' },
          { lineNo: 10, content: 'bind = , Print, exec, mark-shot -r -t c', tone: 'key' },
        ],
      },
      {
        id: 'x11-windows',
        group: 'protocol',
        title: 'X11 与 Windows 原生后端',
        subtitle: 'XGetImage / RandR / EWMH 窗口吸附，以及 Windows GDI 与 UI Automation 控件层级',
        swatches: ['#0284c7', '#0d9488', '#475569', '#94a3b8', '#e2e8f0'],
        fileName: 'CLI 快速工作流',
        previewScreenshot: '/images/settings-en.png',
        previewCaption: '统一命令行体验：在 X11 与 Windows 上保持相同的标注、贴图与无头输出契约',
        codeLines: [
          { lineNo: 1, content: '# 拖动框选并立即写入系统剪贴板', tone: 'comment' },
          { lineNo: 2, content: 'mark-shot -r -t c', tone: 'key' },
          { lineNo: 3, content: '# 将剪贴板图片或文字直接置顶贴在桌面上', tone: 'comment' },
          { lineNo: 4, content: 'mark-shot --pin-clipboard', tone: 'key' },
          { lineNo: 5, content: '# 无界面捕获指定显示器并打印单行 JSON 报告', tone: 'comment' },
          { lineNo: 6, content: 'mark-shot --capture-to ./shot.png --display DP-1', tone: 'key' },
          { lineNo: 7, content: '# 打开录制控制面板（支持硬件编码与音频源选择）', tone: 'comment' },
          { lineNo: 8, content: 'mark-shot --record', tone: 'key' },
        ],
      },
    ];
  }

  // 2. 英文配置项
  return [
    {
      id: 'light-ui',
      group: 'theme',
      title: 'Light Canvas (238, 240, 242)',
      subtitle: 'Default daytime UI, RGB (236, 238, 240) toolbar, bit-exact transparent PNG exports',
      swatches: ['#eef0f2', '#ffffff', '#0d9488', '#161a19', '#f97316'],
      fileName: '~/.config/mark-shot/config.toml',
      previewScreenshot: '/images/settings-en.png',
      previewCaption: 'Native settings window: instant light, dark, and system theme switching',
      codeLines: [
        { lineNo: 1, content: '# Ctrl+Shift+L toggles UI theme without altering image pixels', tone: 'comment' },
        { lineNo: 2, content: '[ui]', tone: 'section' },
        { lineNo: 3, content: 'theme = "light"', tone: 'key' },
        { lineNo: 4, content: 'launch_at_login = false', tone: 'key' },
        { lineNo: 5, content: '', tone: 'plain' },
        { lineNo: 6, content: '[export.image_frame]', tone: 'section' },
        { lineNo: 7, content: 'enabled = true', tone: 'key' },
        { lineNo: 8, content: 'padding = 112', tone: 'key' },
        { lineNo: 9, content: 'corner_radius = 18.0', tone: 'key' },
        { lineNo: 10, content: 'shadow_radius = 72', tone: 'key' },
      ],
    },
    {
      id: 'dark-ui',
      group: 'theme',
      title: 'Dark Canvas (28, 31, 34)',
      subtitle: 'Low-glare night palette, RGB (15, 16, 22) toolbar, cross-process window sync',
      swatches: ['#1c1f22', '#0f1016', '#2dd4bf', '#e5e7eb', '#fb923c'],
      fileName: '~/.config/mark-shot/config.toml',
      previewScreenshot: '/images/settings-zh.png',
      previewCaption: 'Live export frame & border preview rendered by the built-in software engine',
      codeLines: [
        { lineNo: 1, content: '# Broadcasts theme updates across active pins, history, and OCR windows', tone: 'comment' },
        { lineNo: 2, content: '[ui]', tone: 'section' },
        { lineNo: 3, content: 'theme = "dark"', tone: 'key' },
        { lineNo: 4, content: '', tone: 'plain' },
        { lineNo: 5, content: '[keys]', tone: 'section' },
        { lineNo: 6, content: 'toggle_theme = "Ctrl+Shift+L"', tone: 'key' },
        { lineNo: 7, content: 'finish_copy = "Ctrl+C"', tone: 'key' },
        { lineNo: 8, content: 'pin_selection = "Ctrl+P"', tone: 'key' },
        { lineNo: 9, content: 'start_ocr = "O"', tone: 'key' },
        { lineNo: 10, content: 'toggle_ruler = "U"', tone: 'key' },
      ],
    },
    {
      id: 'wayland-native',
      group: 'protocol',
      title: 'Native Wayland Stack',
      subtitle: 'Direct ext-image-copy-capture, wlr-screencopy, KWin ScreenShot2, and PipeWire portal',
      swatches: ['#0d9488', '#2563eb', '#10b981', '#64748b', '#0f172a'],
      fileName: '~/.config/niri/config.kdl · hyprland.conf',
      previewScreenshot: '/images/settings-en.png',
      previewCaption: 'Native layer-shell overlays on niri, Sway, Hyprland, and KDE without tiling reflow',
      codeLines: [
        { lineNo: 1, content: '// niri (~/.config/niri/config.kdl) keybindings', tone: 'comment' },
        { lineNo: 2, content: 'binds {', tone: 'section' },
        { lineNo: 3, content: '    Mod+Shift+S { spawn "mark-shot"; }', tone: 'key' },
        { lineNo: 4, content: '    Mod+Shift+O { spawn "mark-shot" "--ocr"; }', tone: 'key' },
        { lineNo: 5, content: '    Mod+Shift+L { spawn "mark-shot" "--scroll"; }', tone: 'key' },
        { lineNo: 6, content: '}', tone: 'section' },
        { lineNo: 7, content: '', tone: 'plain' },
        { lineNo: 8, content: '# Hyprland (~/.config/hypr/hyprland.conf)', tone: 'comment' },
        { lineNo: 9, content: 'bind = SUPER SHIFT, S, exec, mark-shot', tone: 'key' },
        { lineNo: 10, content: 'bind = , Print, exec, mark-shot -r -t c', tone: 'key' },
      ],
    },
    {
      id: 'x11-windows',
      group: 'protocol',
      title: 'X11 & Windows Backends',
      subtitle: 'XGetImage / RandR / EWMH snapping on Xorg, plus GDI & UI Automation on Windows',
      swatches: ['#0284c7', '#0d9488', '#475569', '#94a3b8', '#e2e8f0'],
      fileName: 'CLI Workflows',
      previewScreenshot: '/images/settings-zh.png',
      previewCaption: 'Consistent CLI flags across Linux sessions and Windows builds',
      codeLines: [
        { lineNo: 1, content: '# Select a region and immediately copy to clipboard', tone: 'comment' },
        { lineNo: 2, content: 'mark-shot -r -t c', tone: 'key' },
        { lineNo: 3, content: '# Pin clipboard image or plain text directly onto screen', tone: 'comment' },
        { lineNo: 4, content: 'mark-shot --pin-clipboard', tone: 'key' },
        { lineNo: 5, content: '# Headless capture emitting a single-line JSON report', tone: 'comment' },
        { lineNo: 6, content: 'mark-shot --capture-to ./shot.png --display DP-1', tone: 'key' },
        { lineNo: 7, content: '# Launch recording bar with hardware encoding support', tone: 'comment' },
        { lineNo: 8, content: 'mark-shot --record', tone: 'key' },
      ],
    },
  ];
}
