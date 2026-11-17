import type { Locale } from '@/types/locale';

export interface WorkflowRoleItem {
  id: 'dev' | 'design' | 'docs' | 'ops';
  tabLabel: string;
  roleTitle: string;
  headline: string;
  summary: string;
  keySequence: string[];
  commandSnippet: string;
  docAnchor: string;
  docLinkText: string;
  screenshotPath: string;
  screenshotCaption: string;
}

/**
 * 【场景工作流】【角色数据】返回四类典型用户在日常工作流中组合调用 Mark Shot 的实操方案
 * @param locale 语言标识
 * @returns 四类角色工作流条目数组
 */
export function getWorkflowsData(locale: Locale): WorkflowRoleItem[] {
  // 1. 返回简体中文四类高频使用场景
  if (locale === 'zh-cn') {
    return [
      {
        id: 'dev',
        tabLabel: '系统与后端开发',
        roleTitle: '开发与调试 · Developer',
        headline: '零子进程冻结终端，贴在编辑器旁逐行对照日志与报错',
        summary:
          '在 niri、Sway 或 KDE 会话下按快捷键框选终端栈回溯，按 Ctrl+P 置顶到右侧屏幕；识别文字后可直接在贴图上拖选函数名复制，或用 --capture-to 输出 JSON 接入自动化回归。',
        keySequence: ['Print 框选终端', 'Ctrl+P 置顶贴图', '右键拖选复制文字'],
        commandSnippet: 'mark-shot --capture-to ~/shots/reg.png --region 80,60,1280,720',
        docAnchor: '#capture-workflow',
        docLinkText: '查阅脚本化与命令行细则',
        screenshotPath: '/images/real-dark-capture.png',
        screenshotCaption: '深色主题下框选终端输出并直接叠加内凹箭头与放大镜',
      },
      {
        id: 'design',
        tabLabel: '界面与设计走查',
        roleTitle: '视觉与前端评审 · UI Review',
        headline: '像素标尺量间距，双框切线放大镜核验圆角与取色色值',
        summary:
          '按 U 拉出像素与角度标尺读取宽高、对角线与面积，按 I 吸取界面真实 HEX 色值，再用 Z 双圆外公切线放大镜在 1.25x 至 6x 倍率下标注细微错位。',
        keySequence: ['U 像素与角度尺', 'Z 双框联动放大镜', 'Alt+方向键 1px 微调'],
        commandSnippet: 'mark-shot -m --default-tool ruler --default-color "#FF4D4D"',
        docAnchor: '#annotation',
        docLinkText: '查阅测量与标注工具细则',
        screenshotPath: '/images/real-light-capture.png',
        screenshotCaption: '浅色主题下同时开启像素标尺、序号圆章与局部放大镜',
      },
      {
        id: 'docs',
        tabLabel: '技术文档与教程',
        roleTitle: '写作与知识沉淀 · Technical Writing',
        headline: '七种递增序号标注步骤，表格一键转为 Markdown 粘贴入库',
        summary:
          '使用 N 序号或 Shift+N 编号箭头按 123、ABC、罗马数字或天干标记操作顺序；遇到网页与 PDF 表格时按 O 启动本地 PP-OCRv5，直接复制为标准 Markdown 表格。',
        keySequence: ['Shift+N 编号箭头', 'O 离线表格识别', '开启 18px 圆角阴影外框'],
        commandSnippet: '[export.image_frame]\nenabled = true\npadding = 112\ncorner_radius = 18.0',
        docAnchor: '#ocr-translate',
        docLinkText: '查阅表格识别与导出外框细则',
        screenshotPath: '/images/real-selected-annotation.png',
        screenshotCaption: '按 V 选中已有标注后通过外扩留白选框微调尺寸与旋转角度',
      },
      {
        id: 'ops',
        tabLabel: '运维脱敏与归档',
        roleTitle: '排障与安全工单 · SecOps & QA',
        headline: '离线滤镜遮盖密钥与内网地址，完成后直传私有图床复制链接',
        summary:
          '像素化与毛玻璃滤镜始终基于原始截图计算，不会被后续标注穿透；OCR 全程在本机 ONNX Runtime 离线执行，打码后点击上传即可通过自定义脚本返回内部工单链接。',
        keySequence: ['M 像素化脱敏', 'Ctrl+Shift+R 区域录屏', '点击上传返回工单 URL'],
        commandSnippet: '[upload]\ncommand = "curl -sF file=@{image} https://img.internal/api"',
        docAnchor: '#configuration',
        docLinkText: '查阅私有图床与环境变量细则',
        screenshotPath: '/images/settings-zh.png',
        screenshotCaption: '原生自绘设置窗口提供 11 个分类页与 Ctrl+F 全量配置检索',
      },
    ];
  }

  // 2. 返回英文四类高频使用场景
  return [
    {
      id: 'dev',
      tabLabel: 'Systems & Backend',
      roleTitle: 'Engineering · Developer',
      headline: 'Freeze terminal stack traces with zero helper processes and pin beside your IDE',
      summary:
        'Snap to a terminal window on niri, Sway, or KDE, press Ctrl+P to float it always-on-top, drag-select recognized text directly on the pin, or automate CI visual checks via --capture-to JSON output.',
      keySequence: ['Print to freeze', 'Ctrl+P to pin', 'Drag-select text on pin'],
      commandSnippet: 'mark-shot --capture-to ~/shots/reg.png --region 80,60,1280,720',
      docAnchor: '#capture-workflow',
      docLinkText: 'Read CLI & headless capture manual',
      screenshotPath: '/images/real-dark-capture.png',
      screenshotCaption: 'Dark UI theme capturing terminal output with concave arrow and linked magnifier',
    },
    {
      id: 'design',
      tabLabel: 'UI & Design QA',
      roleTitle: 'Frontend & Design · UI Review',
      headline: 'Measure pixel gaps with graduated rulers and inspect sub-pixel radii at 6x zoom',
      summary:
        'Press U to read width, height, diagonal, and area in image pixels, press I to sample exact HEX values, and drag Z to link source and zoomed lens frames with outer tangent lines.',
      keySequence: ['U pixel/angle ruler', 'Z linked magnifier', 'Alt+Arrows 1px nudge'],
      commandSnippet: 'mark-shot -m --default-tool ruler --default-color "#FF4D4D"',
      docAnchor: '#annotation',
      docLinkText: 'Read annotation & ruler manual',
      screenshotPath: '/images/real-light-capture.png',
      screenshotCaption: 'Light UI theme combining graduated pixel ruler, step badge, and circular lens',
    },
    {
      id: 'docs',
      tabLabel: 'Technical Docs',
      roleTitle: 'Documentation · Technical Writing',
      headline: 'Call out steps in seven numeral styles and copy recognized tables as Markdown',
      summary:
        'Place auto-incrementing badges (123, ABC, Roman, Stems) with N or Shift+N, extract multi-column tables offline via PP-OCRv5 into Markdown/CSV/TSV, and export with soft 18px rounded frames.',
      keySequence: ['Shift+N numbered arrow', 'O offline table OCR', '18px export shadow frame'],
      commandSnippet: '[export.image_frame]\nenabled = true\npadding = 112\ncorner_radius = 18.0',
      docAnchor: '#ocr-translate',
      docLinkText: 'Read local OCR & export frame manual',
      screenshotPath: '/images/real-selected-annotation.png',
      screenshotCaption: 'Selecting an existing mark with Pick (V) reveals padded orange handles and rotation stem',
    },
    {
      id: 'ops',
      tabLabel: 'SecOps & Triage',
      roleTitle: 'Incident Triage · SecOps & QA',
      headline: 'Redact tokens offline on raw pixels and push directly to internal image hosts',
      summary:
        'Pixelate and blur filters compute strictly from raw capture pixels, local ONNX OCR never sends frames over the network, and custom {image} upload commands copy ticket URLs in one step.',
      keySequence: ['M pixelate redact', 'Ctrl+Shift+R region MP4', 'Upload to internal host'],
      commandSnippet: '[upload]\ncommand = "curl -sF file=@{image} https://img.internal/api"',
      docAnchor: '#configuration',
      docLinkText: 'Read upload & config.toml manual',
      screenshotPath: '/images/settings-zh.png',
      screenshotCaption: 'Native custom-rendered settings window with 11 pages and Ctrl+F instant search',
    },
  ];
}
