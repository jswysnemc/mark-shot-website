import type { Locale } from '@/types/locale';
import type {
  PlatformDownloadGroup,
  QuickInstallMethod,
  ReleaseLogEntry,
} from '@/types/release';

const DL_BASE = 'https://github.com/jswysnemc/mark-shot/releases/download/v0.2.1';

/**
 * 【版本资产】【平台矩阵】返回 Mark Shot 0.2.1 全平台预编译安装包及真实 SHA-256 摘要
 * @param locale 当前语言代码
 * @returns 四大发行分组列表
 */
export function getDownloadGroups(locale: Locale): PlatformDownloadGroup[] {
  const isZh = locale === 'zh-cn';

  // 1. 组装 Debian 与 Ubuntu 发行版软件包组
  const debGroup: PlatformDownloadGroup = {
    id: 'deb',
    title: 'Debian / Ubuntu (.deb)',
    subtitle: isZh
      ? '按发行版基线分别链接对应系统库，支持 x86_64 与 ARM64'
      : 'Built per release baseline for x86_64 and ARM64',
    installHint: 'sudo apt install ./mark-shot_0.2.1-1_<variant>.deb',
    assets: [
      {
        fileName: 'mark-shot_0.2.1-1_amd64.ubuntu24.04.deb',
        arch: 'amd64',
        distroNote: 'Ubuntu 24.04 LTS',
        sizeLabel: '24.72 MiB',
        sha256: 'bd01b9b862af4dec6682ac63187d490ce239f513f1e77a8284f8beaa542f36db',
        downloadUrl: `${DL_BASE}/mark-shot_0.2.1-1_amd64.ubuntu24.04.deb`,
      },
      {
        fileName: 'mark-shot_0.2.1-1_amd64.ubuntu26.04.deb',
        arch: 'amd64',
        distroNote: 'Ubuntu 26.04 LTS',
        sizeLabel: '24.88 MiB',
        sha256: 'ecaa833ca369e3bc594af7012ea56dbe03976082fbcef09c6a85bc9449c9ed54',
        downloadUrl: `${DL_BASE}/mark-shot_0.2.1-1_amd64.ubuntu26.04.deb`,
      },
      {
        fileName: 'mark-shot_0.2.1-1_amd64.debian13.deb',
        arch: 'amd64',
        distroNote: 'Debian 13 / LMDE 7',
        sizeLabel: '24.82 MiB',
        sha256: 'ae1766c0602577d251ec2c9a78d9fd76156f00fac5a3868071c96e5dc5191530',
        downloadUrl: `${DL_BASE}/mark-shot_0.2.1-1_amd64.debian13.deb`,
      },
      {
        fileName: 'mark-shot_0.2.1-1_amd64.deb',
        arch: 'amd64',
        distroNote: 'Debian 12 / Deepin',
        sizeLabel: '24.35 MiB',
        sha256: '74265d4298e4c291c10aa2d9415a4f9bd3c9015ef911dabae4518ad90d2e5159',
        downloadUrl: `${DL_BASE}/mark-shot_0.2.1-1_amd64.deb`,
      },
      {
        fileName: 'mark-shot_0.2.1-1_arm64.ubuntu24.04.deb',
        arch: 'arm64',
        distroNote: 'Ubuntu 24.04 ARM64',
        sizeLabel: '23.16 MiB',
        sha256: '4fb36a107f2253ee36433933de97a3a5b868d08acc5da9efb441378b9b0ab099',
        downloadUrl: `${DL_BASE}/mark-shot_0.2.1-1_arm64.ubuntu24.04.deb`,
      },
      {
        fileName: 'mark-shot_0.2.1-1_arm64.debian13.deb',
        arch: 'arm64',
        distroNote: 'Debian 13 ARM64',
        sizeLabel: '23.33 MiB',
        sha256: '481b4688bf8b285684d5b218be9f636fdd25791cc94b0d78577323ef5de0f068',
        downloadUrl: `${DL_BASE}/mark-shot_0.2.1-1_arm64.debian13.deb`,
      },
    ],
  };

  // 2. 组装 Fedora RPM 与 Arch Linux 软件包组
  const rpmArchGroup: PlatformDownloadGroup = {
    id: 'rpm-arch',
    title: 'Fedora & Arch Linux',
    subtitle: isZh
      ? 'Fedora 43 构建基线 RPM 包与 Arch Linux 预编译 pacman 包'
      : 'Fedora 43 RPM packages and Arch Linux prebuilt pacman archives',
    installHint: 'sudo dnf install ./mark-shot-0.2.1-1.fc43.x86_64.rpm',
    assets: [
      {
        fileName: 'mark-shot-0.2.1-1.fc43.x86_64.rpm',
        arch: 'x86_64',
        distroNote: 'Fedora 43+',
        sizeLabel: '26.29 MiB',
        sha256: '8572940d044383393d3902861efc78d925aa8248c1901a0ec099313f3eb04071',
        downloadUrl: `${DL_BASE}/mark-shot-0.2.1-1.fc43.x86_64.rpm`,
      },
      {
        fileName: 'mark-shot-0.2.1-1.fc43.aarch64.rpm',
        arch: 'aarch64',
        distroNote: 'Fedora 43+ ARM64',
        sizeLabel: '25.90 MiB',
        sha256: '66b75cd7a8a81e6f10513a99a462eb204cd13ad9bdbce09c74c45a4f66f35d4b',
        downloadUrl: `${DL_BASE}/mark-shot-0.2.1-1.fc43.aarch64.rpm`,
      },
      {
        fileName: 'mark-shot-bin-0.2.1-1-x86_64.pkg.tar.zst',
        arch: 'x86_64',
        distroNote: 'Arch Linux / CachyOS',
        sizeLabel: '25.78 MiB',
        sha256: '811ed9f7161fb62bae0d4d44126cb37b3294a0d65ae8180a266d66e8f8bb78bf',
        downloadUrl: `${DL_BASE}/mark-shot-bin-0.2.1-1-x86_64.pkg.tar.zst`,
      },
      {
        fileName: 'mark-shot-bin-0.2.1-1-aarch64.pkg.tar.zst',
        arch: 'aarch64',
        distroNote: 'Arch Linux ARM64',
        sizeLabel: '24.87 MiB',
        sha256: 'f093ae71a4e85e6e3c15e30162b29f41dc5b8b7a59ad1e58fec1cc693e1a02c0',
        downloadUrl: `${DL_BASE}/mark-shot-bin-0.2.1-1-aarch64.pkg.tar.zst`,
      },
    ],
  };

  // 3. 组装通用 Linux 单文件与便携归档组
  const portableLinuxGroup: PlatformDownloadGroup = {
    id: 'portable-linux',
    title: isZh ? '通用 Linux 归档与容器包' : 'Universal Linux & Portable',
    subtitle: isZh
      ? 'GLIBC 2.36 基线 AppImage、Flatpak 单文件包与便携 tar.gz 目录'
      : 'GLIBC 2.36 AppImage, single-file Flatpak, and portable tarballs',
    installHint: 'chmod +x mark-shot-native-0.2.1-linux-x86_64.AppImage',
    assets: [
      {
        fileName: 'mark-shot-native-0.2.1-linux-x86_64.AppImage',
        arch: 'x86_64',
        distroNote: 'AppImage (GLIBC <= 2.36)',
        sizeLabel: '30.72 MiB',
        sha256: '7bec936c568109a94f6f2de774e8d13d2df713433b45804afb86abc18a2af7a0',
        downloadUrl: `${DL_BASE}/mark-shot-native-0.2.1-linux-x86_64.AppImage`,
      },
      {
        fileName: 'mark-shot-native-0.2.1-linux-x86_64.flatpak',
        arch: 'x86_64',
        distroNote: 'Flatpak Bundle',
        sizeLabel: '24.51 MiB',
        sha256: '70819af51c0ab52eecdce4d023490f5460922f122b6ba0043b3a0c69c54a8ffb',
        downloadUrl: `${DL_BASE}/mark-shot-native-0.2.1-linux-x86_64.flatpak`,
      },
      {
        fileName: 'mark-shot-native-0.2.1-linux-x86_64.tar.gz',
        arch: 'x86_64',
        distroNote: isZh ? '便携目录归档' : 'Portable Tarball',
        sizeLabel: '28.68 MiB',
        sha256: '64603ba738078d265c596ab563b4646c8bf5270f6c1f298cf6b9383474dbd644',
        downloadUrl: `${DL_BASE}/mark-shot-native-0.2.1-linux-x86_64.tar.gz`,
      },
      {
        fileName: 'mark-shot-native-0.2.1-linux-aarch64.tar.gz',
        arch: 'aarch64',
        distroNote: isZh ? 'ARM64 便携归档' : 'ARM64 Tarball',
        sizeLabel: '27.83 MiB',
        sha256: 'cda5236e8e199f820e7e7cbd76258182f2902a029a98b05ed12fd2acd0cc6ae1',
        downloadUrl: `${DL_BASE}/mark-shot-native-0.2.1-linux-aarch64.tar.gz`,
      },
    ],
  };

  // 4. 组装 Windows 实验性原生构建组
  const windowsGroup: PlatformDownloadGroup = {
    id: 'windows',
    title: isZh ? 'Windows (实验性支持)' : 'Windows (Experimental)',
    subtitle: isZh
      ? '安装至当前用户目录并创建开始菜单入口，卸载时保留用户配置'
      : 'Installs under current user profile with Start Menu entries',
    assets: [
      {
        fileName: 'mark-shot-native-0.2.1-windows-x86_64-msvc-setup.exe',
        arch: 'x86_64',
        distroNote: isZh ? '用户级安装程序' : 'Per-user Setup Installer',
        sizeLabel: '23.28 MiB',
        sha256: 'ef2e7b7deb7a95951f08a1a72dae3ef8a2fbe4e12b0617b128b62daa2811a80f',
        downloadUrl: `${DL_BASE}/mark-shot-native-0.2.1-windows-x86_64-msvc-setup.exe`,
      },
      {
        fileName: 'mark-shot-native-0.2.1-windows-x86_64-msvc.zip',
        arch: 'x86_64',
        distroNote: isZh ? '免安装便携归档' : 'Portable ZIP Archive',
        sizeLabel: '25.84 MiB',
        sha256: '4c6d5a69e6ffb61078d3427038f64bc6287c8795e7c5a93236e325943e2f2c2a',
        downloadUrl: `${DL_BASE}/mark-shot-native-0.2.1-windows-x86_64-msvc.zip`,
      },
    ],
  };

  return [debGroup, rpmArchGroup, portableLinuxGroup, windowsGroup];
}

/**
 * 【快捷安装】【命令列表】返回包管理器与源码编译命令配置
 * @param locale 当前语言代码
 * @returns 快捷安装选项卡数组
 */
export function getQuickInstallMethods(locale: Locale): QuickInstallMethod[] {
  const isZh = locale === 'zh-cn';
  return [
    {
      id: 'arch',
      label: 'Arch Linux (AUR)',
      description: isZh
        ? '安装预编译二进制包 mark-shot-bin，或通过 mark-shot 从源码构建。'
        : 'Install prebuilt mark-shot-bin from AUR, or build from source via mark-shot.',
      lang: 'sh',
      code: 'paru -S mark-shot-bin\n# 或使用 yay\nyay -S mark-shot-bin',
    },
    {
      id: 'nixos',
      label: 'NixOS Flake',
      description: isZh
        ? '固定 Rust 工具链与媒体库源码，支持 x86_64-linux 与 aarch64-linux。'
        : 'Pinned Rust toolchain and media libraries for x86_64-linux and aarch64-linux.',
      lang: 'nix',
      code: `mark-shot = {\n  url = "github:jswysnemc/mark-shot";\n  inputs.nixpkgs.follows = "nixpkgs";\n};\n\n# home-manager\nhome.packages = [ inputs.mark-shot.packages.\${pkgs.stdenv.hostPlatform.system}.default ];`,
    },
    {
      id: 'source',
      label: isZh ? 'Cargo 源码构建' : 'Build from Source',
      description: isZh
        ? '自动安装系统依赖并编译发布版单可执行文件（Rust 1.95+）。'
        : 'Install system libraries and compile the release binary (Rust 1.95+).',
      lang: 'sh',
      code: 'git clone https://github.com/jswysnemc/mark-shot.git\ncd mark-shot\nbash scripts/packaging/install_dependencies.sh\ncargo build --release --locked',
    },
  ];
}

/**
 * 【更新日志】【版本时间线】返回正式版本更新摘要
 * @param locale 当前语言代码
 * @returns 版本记录数组
 */
export function getReleaseLogs(locale: Locale): ReleaseLogEntry[] {
  if (locale === 'zh-cn') {
    return [
      {
        version: '0.2.1',
        date: '2026-11-17',
        tagUrl: 'https://github.com/jswysnemc/mark-shot/releases/tag/v0.2.1',
        summary: '新增开机启动设置、Windows 用户安装器与原生 Rust 版本的 Nix Flake 支持，并合并多项桌面兼容性修复。',
        added: [
          '在“设置 -> 外观”中新增开机启动开关，Linux 写入用户级 XDG 自动启动项，Windows 写入当前用户 Run 注册表',
          '新增 Windows Setup 安装程序，安装至 %LOCALAPPDATA%\\Programs\\Mark Shot 并创建开始菜单入口',
          '迁移 Nix Flake 构建至纯 Rust 版本，支持 Linux x86_64 与 ARM64 软件包及 nix develop 开发环境',
          '新增内凹直箭头样式，托盘菜单补充延时截图预设与可选常驻录屏控制栏',
        ],
        improved: [
          '优化设置按钮与属性栏排布，完善截图历史重新框选、剪贴板贴图和工具栏悬停提示',
          'Fedora RPM 升级至 Fedora 43 构建基线与 OpenSSL 3，发布前自动校验共享库依赖',
          '改进滤镜聚焦过渡、形状边缘扩散阴影与 Windows 字体元数据缓存复用',
        ],
        fixed: [
          '修复 Linux Mint / Cinnamon X11 会话下截图选区跟随指针迟缓的问题（#164），合并重复指针事件',
          '修复 X11 / Xwayland 剪贴板图像传输中的非阻塞文件描述符异常',
          '修复阴影瓦片一致性与清空标注后的画布局部重绘问题',
        ],
      },
      {
        version: '0.2.0',
        date: '2026-11-15',
        tagUrl: 'https://github.com/jswysnemc/mark-shot/releases/tag/v0.2.0',
        summary: '完成从 C++/Qt 6 到 100% 纯原生 Rust 与自研软件渲染器的整体重写，移除全部外部 GUI 库依赖。',
        added: [
          '内置基于 tiny-skia 与 cosmic-text 的共享内存软件渲染器，采用脏矩形局部刷新，空闲时零后台轮询',
          '单可执行文件按需派生贴图、流式剪贴板、PP-OCRv5 识别、历史记录与录屏子进程，关闭窗口即释放内存',
          '原生接入 Wayland（ext-image-copy-capture、wlr-screencopy、layer-shell、KWin ScreenShot2、Portal）、X11 与 Win32 GDI',
          '内置 crates/shot-media 原生录屏模块，支持 MP4、MKV、GIF、中途暂停与软硬件编码切换',
        ],
        improved: [
          '将 ONNX Runtime 拆分为按需下载组件，默认主程序体积缩减 44.5% 至 27.7 MB',
          '长截图采用 18x24 亮度签名去重与 64 KiB 匿名文件流式剪贴板传输，消除大图复制常驻峰值',
        ],
        fixed: [
          '修正明暗主题切换在缩放视图、导航遮罩与翻译预览下的底色一致性，保持导出 PNG 逐字节无损',
        ],
      },
    ];
  }

  return [
    {
      version: '0.2.1',
      date: '2026-11-17',
      tagUrl: 'https://github.com/jswysnemc/mark-shot/releases/tag/v0.2.1',
      summary: 'Adds launch-at-login preferences, a per-user Windows Setup installer, native Nix Flake builds, and compositor fixes.',
      added: [
        'Opt-in launch-at-login control under Settings -> Appearance (XDG autostart on Linux, HKCU Run key on Windows)',
        'Per-user Windows Setup installer bundling media libraries and Start Menu shortcuts while preserving config on uninstall',
        'Native Rust Nix Flake packages and devShells for x86_64-linux and aarch64-linux',
        'Concave straight arrow style, extra tray delay presets, and optional persistent recording control bar',
      ],
      improved: [
        'Refined settings layout, history re-selection workflow, clipboard pinning, and edge-aware toolbar tooltips',
        'Updated Fedora RPM baseline to Fedora 43 with OpenSSL 3 and automated shared-library verification',
        'Improved spotlight filter transitions, shadow tile consistency, and Windows font metadata reuse',
      ],
      fixed: [
        'Fixed sluggish selection tracking under Linux Mint / Cinnamon X11 (#164) by coalescing pointer motion events',
        'Fixed non-blocking file descriptor handling during X11 / Xwayland clipboard image transfers',
        'Fixed partial canvas redraw after clearing all annotations',
      ],
    },
    {
      version: '0.2.0',
      date: '2026-11-15',
      tagUrl: 'https://github.com/jswysnemc/mark-shot/releases/tag/v0.2.0',
      summary: 'Complete ground-up rewrite in pure Rust with a custom software renderer, eliminating Qt 6, GTK, and CMake dependencies.',
      added: [
        'Custom SHM software renderer powered by tiny-skia and cosmic-text with damage-tile partial redraws',
        'Single-binary multi-process architecture spawning isolated worker processes for pins, OCR, history, and recording',
        'Direct protocol backends for Wayland (ext-image-copy-capture, wlr-screencopy, layer-shell, KWin ScreenShot2, Portal), X11, and Win32 GDI',
        'Built-in crates/shot-media screen recorder supporting MP4, MKV, GIF, audio capture, and pause/resume',
      ],
      improved: [
        'Decoupled ONNX Runtime into an on-demand download, cutting the default binary by 44.5% to 27.7 MB',
        '18x24 luminance-signature frame deduplication and 64 KiB streaming clipboards for multi-screen scroll captures',
      ],
      fixed: [
        'Unified light and dark canvas backgrounds across zoom navigation and translation overlays while preserving raw PNG pixels',
      ],
    },
  ];
}
