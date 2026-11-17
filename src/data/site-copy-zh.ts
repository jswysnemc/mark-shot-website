import type { SiteCopy } from '@/types/locale';

export const siteCopyZh: SiteCopy = {
  locale: 'zh-cn',
  htmlLang: 'zh-CN',
  switchLabel: 'English',
  switchHref: '/',
  meta: {
    homeTitle: 'Mark Shot：Rust 原生截图、标注与录屏工具',
    homeDescription:
      'Mark Shot 以 Rust 与自研软件渲染器构建，不依赖 Qt、GTK 或 WebView。常驻唤起 31.6 ms，后台内存 21.6 MiB，内置 19 种标注、置顶贴图、本地 PP-OCRv5、原位翻译与硬件编码录屏。',
    downloadsTitle: '下载 Mark Shot 0.2.1 与版本记录',
    downloadsDescription:
      '下载面向 Debian、Ubuntu、Fedora、Arch Linux、NixOS、AppImage、Flatpak 与 Windows 的 Mark Shot 0.2.1 原生安装包，核对 SHA-256 摘要并查阅更新记录。',
  },
  header: {
    navFeatures: '能力',
    navBenchmarks: '实测',
    navThemes: '平台',
    navDownloads: '下载',
    dayLabel: '切换到日间界面',
    nightLabel: '切换到夜间界面',
  },
  hero: {
    versionBadge: 'Mark Shot 0.2.1',
    headline: '截得稳，标得准，轻若无物',
    lede: '以 Rust 与自研软件渲染器编写，不依赖 Qt、GTK 或 WebView。冻结桌面后即刻框选、标注、贴图、识别文字或录制视频。',
    primaryCta: '下载 Mark Shot',
    secondaryCta: '全部平台',
  },
  stage: {
    windowTitle: 'Mark Shot 0.2.1 · Wayland 原生覆盖层',
    selectionHint: '点击工具栏切换能力，或在画布上移动指针查看像素标尺',
    ocrPanelTitle: 'PP-OCRv5 本地识别结果',
    ocrCopyTsv: '复制 Markdown 表格',
    ocrCopiedMsg: '已复制识别表格到剪贴板',
    pinTranslatedBadge: '贴图原位译文 · 已置顶',
    exportFrameLabel: '导出外框',
    resetCanvasLabel: '重置标注',
    copiedImageMsg: '已将渲染选区写入 Wayland 剪贴板（流式零残留）',
    savedImageMsg: '已保存 PNG（含 18px 圆角外框与柔和阴影）',
    tools: {
      select: '选择 (V)',
      rectangle: '矩形 (R)',
      arrow: '箭头 (A)',
      number: '序号 (N)',
      highlighter: '荧光笔 (H)',
      mosaic: '滤镜 (M)',
      magnifier: '放大镜 (Z)',
      ruler: '尺子 (U)',
      ocr: '文字识别 (O)',
      translate: '译文贴图',
      pin: '置顶贴图 (Ctrl+P)',
      frame: '外框预览',
    },
  },
  benchmarks: {
    heading: '实测，而非宣称',
    subheading:
      '测量环境为 Ryzen 7 8845H、CachyOS、Niri/Wayland 2560x1600 日常会话，连续帧率来自隔离 3840x2160 Sway 合成器。',
    environmentNote: '全部样本保留原始 JSON 记录，不以空载桌面替代日常使用场景。',
  },
  capabilities: {
    heading: '好用，藏在细节里',
    subheading:
      '从内凹直箭头到双框联动放大镜，从贴图划词复制到逐行流式剪贴板，高频动作均按同一标准打磨：按下即出，用完即走。',
  },
  themesProtocols: {
    heading: '两套界面主题，五大显示后端',
    subheading:
      '切换界面明暗不会改变原图像素或导出色值；程序按当前会话提供的真实协议自动选择截图、覆盖层与剪贴板后端。',
    tabGroupThemes: '界面主题',
    tabGroupProtocols: '协议集成',
  },
  downloadCallout: {
    heading: '开始使用 Mark Shot',
    body: '单可执行文件即可完成截图、标注、贴图、历史与扫码；预编译安装包已内置录屏媒体库。',
    primaryCta: '下载 Mark Shot',
    secondaryCta: '全部平台',
    slots: [
      {
        platform: 'Linux (Wayland / X11)',
        requirement: 'x86_64 与 ARM64，原生支持 niri、Sway、KDE、GNOME 与 Xorg',
      },
      {
        platform: 'NixOS / Arch AUR',
        requirement: '提供固定工具链 Flake 输出与预编译 mark-shot-bin 软件包',
      },
      {
        platform: 'Windows (实验性)',
        requirement: 'Windows 10/11 x86_64，提供 Setup 用户安装器与 ZIP 便携归档',
      },
    ],
  },
  downloadsPage: {
    heading: '下载 Mark Shot',
    subheading: '当前正式版为 0.2.1（原生 Rust 实现）。按发行版与架构选择对应安装包。',
    recommendedPrefix: '已为当前环境高亮推荐分组：',
    autoStartedHint: '已为您开始下载推荐安装包 · 若未弹出下载，请点击',
    retryLinkText: '直接获取文件',
    sha256Label: 'SHA-256',
    copySha256Label: '复制摘要',
    copiedSha256Msg: '已复制 SHA-256 校验摘要',
    allReleasesLabel: '前往 GitHub Releases 查看全部历史资产',
    quickInstallHeading: '包管理器与源码安装',
    quickInstallSubheading: 'Arch Linux、NixOS、Debian/Ubuntu 及源码编译命令，点击右侧按钮即可复制。',
    verifyHeading: '校验下载文件',
    verifyBody:
      '所有发布资产的完整 SHA-256 均列于上方表格与 GitHub 发布页。下载完成后可在终端执行以下命令核对一致性：',
    changelogHeading: '版本记录',
    changelogSubheading: '正式版本的新增特性、性能优化与兼容性修复记录；0.1.x Qt 实现源码保留于 qt-old 分支。',
    categoryAdded: '新增功能',
    categoryImproved: '体验与打包优化',
    categoryFixed: '兼容性与编辑修复',
    helpHeading: '安装说明与反馈',
    helpItems: [
      {
        title: '零外部命令依赖',
        body: '原生版本不再调用 grim、wl-copy、xclip 或外部 ffmpeg，仅通过 fc-match 匹配系统文字标注字体。',
      },
      {
        title: '按需加载本地 OCR',
        body: '默认主程序不包含静态 ONNX Runtime；首次在文字识别面板点击下载后才安装推理库与 PP-OCRv5 语言模型。',
      },
      {
        title: '问题排查与报告',
        body: '提交 Issue 时请附上桌面环境、$XDG_SESSION_TYPE 以及 mark-shot --debug-log 生成的诊断日志。',
        linkLabel: '提交 GitHub Issue',
        linkHref: 'https://github.com/jswysnemc/mark-shot/issues',
      },
      {
        title: '社区讨论',
        body: '可在 Gitter 频道交流合成器快捷键绑定、图床脚本与多显示器配置经验。',
        linkLabel: '加入 Gitter 社区',
        linkHref: 'https://gitter.im/mark-shot/community',
      },
    ],
  },
  footer: {
    tagline: '面向 Linux 与 Windows 的原生截图、标注与屏幕录制工具。',
    downloads: '下载',
    issues: '问题反馈',
    licenseNote: 'MIT 或 Apache-2.0 双许可',
    versionText: 'Mark Shot 0.2.1',
  },
  common: {
    copyLabel: '复制',
    copiedLabel: '已复制',
    copiedToast: '已复制到剪贴板',
  },
};
