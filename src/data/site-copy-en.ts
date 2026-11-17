import type { SiteCopy } from '@/types/locale';

export const siteCopyEn: SiteCopy = {
  locale: 'en',
  htmlLang: 'en',
  switchLabel: '简体中文',
  switchHref: '/zh-cn/',
  meta: {
    homeTitle: 'Mark Shot: Native Screenshot, Pin, OCR & Recording in Rust',
    homeDescription:
      'Built in Rust with a custom software renderer and zero Qt, GTK, or WebView runtime. 31.6 ms wake, 21.6 MiB idle RAM, 19 annotation tools, pinned overlays, local PP-OCRv5, translation, and hardware recording.',
    docsTitle: 'Documentation & Reference Manual - Mark Shot',
    docsDescription:
      'Complete technical manual for Mark Shot: CLI flags, pinned windows, 19 annotation tools, offline PP-OCRv5, translation providers, hardware recording, shortcuts, config.toml schema, and Wayland/X11/Windows backends.',
    downloadsTitle: 'Download Mark Shot 0.2.1 & Release Notes',
    downloadsDescription:
      'Download native Mark Shot 0.2.1 packages for Debian, Ubuntu, Fedora, Arch Linux, NixOS, AppImage, Flatpak, and Windows with verified SHA-256 digests.',
  },
  header: {
    navFeatures: 'Features',
    navBenchmarks: 'Benchmarks',
    navDocs: 'Docs',
    navThemes: 'Platforms',
    navDownloads: 'Downloads',
    headerDownloadCta: 'Download Mark Shot',
    dayLabel: 'Switch to day theme',
    nightLabel: 'Switch to night theme',
  },
  hero: {
    headlinePrefix: 'Capture fast, mark crisp, ',
    headlineHighlight: 'pin to screen',
    lede: 'Native Rust screenshot, pin, offline OCR, and screen recorder with zero Qt, GTK, or WebView bloat.',
    primaryCta: 'Download Mark Shot',
    secondaryCta: 'Read Documentation',
  },
  stage: {
    windowTitle: 'Mark Shot 0.2.1 · Native Wayland Layer-Shell',
    selectionHint: 'Select a tool above or move the pointer across the canvas to inspect pixel measurements',
    ocrPanelTitle: 'PP-OCRv5 Local Recognition',
    ocrCopyTsv: 'Copy Markdown Table',
    ocrCopiedMsg: 'Copied recognized Markdown table to clipboard',
    pinTranslatedBadge: 'In-Place Translated Pin · Always on Top',
    exportFrameLabel: 'Export Frame',
    resetCanvasLabel: 'Reset Marks',
    copiedImageMsg: 'Streamed rendered selection to Wayland clipboard (zero resident leak)',
    savedImageMsg: 'Saved PNG with 18px rounded export frame and soft shadow',
    tools: {
      select: 'Select (V)',
      rectangle: 'Rectangle (R)',
      arrow: 'Arrow (A)',
      number: 'Step (N)',
      highlighter: 'Highlighter (H)',
      mosaic: 'Filter (M)',
      magnifier: 'Magnifier (Z)',
      ruler: 'Ruler (U)',
      ocr: 'OCR (O)',
      translate: 'Translate Pin',
      pin: 'Pin Overlay (Ctrl+P)',
      frame: 'Export Frame',
    },
  },
  benchmarks: {
    heading: 'Measured, Not Claimed',
    subheading:
      'Measured on Ryzen 7 8845H, CachyOS, live Niri/Wayland 2560x1600 daily session; continuous pointer frame commits measured on isolated 3840x2160 Sway.',
    environmentNote: 'All samples preserve raw JSON traces under realistic daily desktop workloads.',
  },
  capabilities: {
    heading: 'Crafted Down to Every Pixel',
    subheading:
      'From concave straight arrows to dual-frame linked magnifiers, text-selectable pins, and streaming data-control clipboards, every daily action responds immediately.',
  },
  themesProtocols: {
    heading: 'Two Canvas Themes, Five Display Backends',
    subheading:
      'Switching light and dark UI never alters source pixels or exported colors. Backends are selected dynamically by probing runtime compositor protocols.',
    tabGroupThemes: 'UI Themes',
    tabGroupProtocols: 'Protocol Backends',
  },
  downloadCallout: {
    heading: 'Start Using Mark Shot',
    body: 'A single executable covers capture, annotation, pinning, history, and barcode scanning. Prebuilt packages bundle recording media libraries.',
    primaryCta: 'Download Mark Shot',
    secondaryCta: 'Read Documentation',
    slots: [
      {
        platform: 'Linux (Wayland / X11)',
        requirement: 'x86_64 and ARM64; native support for niri, Sway, KDE, GNOME, and Xorg',
      },
      {
        platform: 'NixOS / Arch AUR',
        requirement: 'Pinned-toolchain Flake output and prebuilt mark-shot-bin packages',
      },
      {
        platform: 'Windows (Experimental)',
        requirement: 'Windows 10/11 x86_64; per-user Setup installer and portable ZIP archive',
      },
    ],
  },
  downloadsPage: {
    heading: 'Download Mark Shot',
    subheading: 'Latest stable release: 0.2.1 (native Rust rewrite). Pick the package matching your distro and CPU architecture.',
    recommendedPrefix: 'Highlighted package group for your platform:',
    autoStartedHint: 'Started downloading recommended package · Not starting?',
    retryLinkText: 'Direct file link',
    sha256Label: 'SHA-256',
    copySha256Label: 'Copy digest',
    copiedSha256Msg: 'Copied SHA-256 checksum to clipboard',
    allReleasesLabel: 'Browse all historical assets on GitHub Releases',
    quickInstallHeading: 'Package Managers & Source Build',
    quickInstallSubheading: 'Commands for Arch Linux, NixOS, Debian/Ubuntu, and Cargo release builds.',
    verifyHeading: 'Verify Downloaded Archives',
    verifyBody:
      'Full SHA-256 digests are listed in each package row above and on the GitHub release page. Verify integrity in your terminal:',
    changelogHeading: 'Release Notes',
    changelogSubheading: 'New features, packaging refinements, and desktop fixes across official releases. Legacy 0.1.x Qt source remains on the qt-old branch.',
    categoryAdded: 'New Features',
    categoryImproved: 'Improvements',
    categoryFixed: 'Fixes',
    helpHeading: 'Notes & Support',
    helpItems: [
      {
        title: 'Zero External Capture Helpers',
        body: 'Mark Shot does not shell out to grim, wl-copy, xclip, or external ffmpeg. Only fc-match is invoked to resolve system CJK and sans fonts.',
      },
      {
        title: 'On-Demand Local OCR Runtime',
        body: 'The default binary omits static ONNX Runtime bloat; inference libraries and PP-OCRv5 models download only when requested in the OCR panel.',
      },
      {
        title: 'Bug Reports & Diagnostics',
        body: 'Include your desktop environment, $XDG_SESSION_TYPE, mark-shot --version, and a trace from mark-shot --debug-log when filing issues.',
        linkLabel: 'Open GitHub Issue',
        linkHref: 'https://github.com/jswysnemc/mark-shot/issues',
      },
      {
        title: 'Community Chat',
        body: 'Discuss compositor keybindings, custom image upload scripts, and multi-monitor workflows on Gitter.',
        linkLabel: 'Join Gitter Room',
        linkHref: 'https://gitter.im/mark-shot/community',
      },
    ],
  },
  footer: {
    tagline: 'Native screenshot, pin, offline OCR, and screen recording utility for Linux and Windows.',
    docs: 'Documentation',
    downloads: 'Downloads',
    issues: 'Issues',
    licenseNote: 'Dual-licensed under MIT or Apache-2.0',
  },
  common: {
    copyLabel: 'Copy',
    copiedLabel: 'Copied',
    copiedToast: 'Copied to clipboard',
  },
};
