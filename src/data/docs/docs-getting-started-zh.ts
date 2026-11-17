import type { DocChapter } from '@/types/docs';

export const docsGettingStartedZh: DocChapter[] = [
  {
    id: 'overview',
    categoryId: 'getting-started',
    title: '架构概览与零依赖原则',
    summary:
      '理解 Mark Shot 如何基于纯 Rust 与自研软件渲染器取代传统 GUI 工具包，在不调用外部截图命令的前提下完成跨平台屏幕捕获、标注与录制。',
    sections: [
      {
        id: 'overview-core',
        heading: '纯原生架构与进程边界',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Mark Shot 0.2.x 采用纯 Rust 与自研软件渲染器编写，完全不链接 Qt、GTK 或 WebView。原有的 0.1.x Qt 实现源码保留于仓库 qt-old 分支。',
              '程序不会在后台调用 grim、wl-copy、xclip 或外部 ffmpeg 等命令行程序。唯一按需调用的系统工具是 fontconfig 提供的 fc-match，用于为文字标注解析本地中日韩与西文字体路径。',
            ],
          },
          {
            kind: 'screenshot',
            src: '/images/real-light-capture.png',
            alt: 'Mark Shot 浅色原生界面实机截图',
            caption: '实机运行画面：左上尺寸比例条、底部 20 键主栏与二级属性栏、右侧 13 键纵向动作栏。',
          },
          {
            kind: 'kvGrid',
            columns: 2,
            items: [
              {
                term: '托盘热唤起 31.6 ms',
                badge: '实测中位数',
                detail: '常驻后台提前准备进程上下文，按下快捷键后立即冻结当前显示器或全部屏幕。',
              },
              {
                term: '空闲常驻 21.6 MiB',
                badge: 'RSS 内存',
                detail: '不驻留浏览器内核或重型图形框架，截图结束并写入剪贴板后释放帧缓冲。',
              },
              {
                term: '单可执行文件核心',
                badge: '27.7 MB ELF',
                detail: '截图、19 种标注、置顶贴图、截图历史与本地二维码识别仅需单个 mark-shot 二进制文件。',
              },
              {
                term: '按需加载本地推理',
                badge: 'ONNX 1.28.0',
                detail: '常规截图绝不初始化 OCR 模型；仅在点击文字识别后按需加载推理库，识别窗口就绪后截图进程即刻退出。',
              },
            ],
          },
        ],
      },
      {
        id: 'overview-single-instance',
        heading: '单实例移交与原图像素保护',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              '在 Linux 会话中，当屏幕已处于选区或标注覆盖层时再次触发 mark-shot，新请求会自动转交给正在运行的实例，不会叠加第二个覆盖层。',
              '切换浅色与深色工具栏主题（Ctrl+Shift+L）仅改变浮动面板与控件配色，绝不改变被截取画面的像素或导出 PNG 色值。',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'installation',
    categoryId: 'getting-started',
    title: '安装、校验与源码构建',
    summary:
      '涵盖 Linux 各发行版与 Windows 预编译安装包、SHA-256 完整性校验、Nix Flake 构建以及 OCR 与录制媒体库的编译选项。',
    sections: [
      {
        id: 'install-packages',
        heading: '预编译安装包与目录结构',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              '官方发布流程为每次版本标签生成 DEB（Debian 12/13、Ubuntu 24.04/26.04，amd64 与 arm64）、Fedora RPM、Arch 预编译包、AppImage、Flatpak、Linux 便携 tar.gz 以及 Windows x86_64 Setup 安装器与便携 ZIP。',
              '所有预编译包均已内置进程内屏幕录制所需的媒体动态库与开源许可声明，无需安装 Rust 工具链即可直接运行。便携归档解压后请保留完整目录，切勿将可执行文件与同级 media 目录分离。',
            ],
          },
          {
            kind: 'code',
            label: '便携包解压与 SHA-256 校验（Linux / PowerShell）',
            code: `# Linux x86_64 解压与摘要核对
sha256sum mark-shot-native-0.2.1-linux-x86_64.tar.gz
tar -xzf mark-shot-native-0.2.1-linux-x86_64.tar.gz
./mark-shot-native-0.2.1-linux-x86_64/mark-shot --version

# Windows PowerShell 校验摘要
Get-FileHash .\\mark-shot-native-0.2.1-windows-x86_64-msvc.zip -Algorithm SHA256`,
          },
        ],
      },
      {
        id: 'install-source-nix',
        heading: '源码编译、特性开关与 NixOS 配置',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              '从源码构建需要 Rust 1.95 或更新版本（仓库内的 rust-toolchain.toml 会由 rustup 自动接管）。Linux 构建依赖可通过仓库自带脚本一键安装，涵盖 libwayland、libxkbcommon、libxcb、pipewire、fontconfig、libva 与 libgbm。',
            ],
          },
          {
            kind: 'code',
            label: '源码构建与录制媒体库准备',
            code: `git clone https://github.com/jswysnemc/mark-shot.git
cd mark-shot
bash scripts/packaging/install_dependencies.sh
cargo build --release --locked

# 可选：构建进程内录制所需的精简 FFmpeg / OpenH264 私有媒体库
bash scripts/media/build-libraries.sh linux
mkdir -p target/release/media
cp -r target/media-linux/. target/release/media/`,
          },
          {
            kind: 'kvGrid',
            columns: 2,
            items: [
              {
                term: '默认动态 OCR（ocr-dynamic）',
                badge: '默认特性',
                detail: 'cargo build --release --locked：主程序体积最小，首次在识别面板点击下载时获取 ONNX Runtime 与模型。',
              },
              {
                term: '内嵌推理库（bundled-ocr / ocr-gpu）',
                badge: '互斥特性',
                detail: '使用 --no-default-features --features bundled-ocr（或 ocr-gpu 开启 WebGPU），不可与 --all-features 混用。',
              },
            ],
          },
          {
            kind: 'code',
            label: 'NixOS Flake 系统包声明',
            code: `inputs.mark-shot.url = "github:jswysnemc/mark-shot";

environment.systemPackages = [
  inputs.mark-shot.packages.\${pkgs.stdenv.hostPlatform.system}.default
];`,
          },
        ],
      },
    ],
  },
  {
    id: 'capture-workflow',
    categoryId: 'getting-started',
    title: '截图流程与命令行全集',
    summary:
      '详解框选阶段窗口与控件吸附、默认完成动作组合码（c/s/p/o）、无界面脚本化 JSON 输出以及全部命令行标志。',
    sections: [
      {
        id: 'workflow-selection',
        heading: '四步框选流程与智能组件识别',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              '启动 mark-shot 后桌面画面立即冻结。指针移动时自动高亮下方窗口或界面候选矩形：左键单击直接采用当前高亮区域，滚动鼠标滚轮可在外层容器与内部子区域之间逐层切换；指针旁放大镜实时显示像素坐标与颜色。',
              '在 Windows 平台同时启用 [region_detection] 与 [window_detection] 时，UI Automation 控件树边界优先于图像边缘识别，框选阶段按 Tab 可在整窗与深层子控件之间快速切换。框选阶段按 Esc 或单击右键立即取消截图。',
            ],
          },
          {
            kind: 'kvGrid',
            columns: 2,
            items: [
              {
                term: 'c：复制到系统剪贴板',
                badge: 'to 组合码',
                detail: '将合成后的 PNG 写入 Wayland 数据控制协议、X11 CLIPBOARD 或 Windows 剪贴板。',
              },
              {
                term: 's：保存到截图目录',
                badge: 'to 组合码',
                detail: '默认按月份归档至 ~/Pictures/screenshots/<年-月>/<日期_时间>.png。',
              },
              {
                term: 'p：置顶贴到屏幕',
                badge: 'to 组合码',
                detail: '完成后立即生成保持在顶层的无边框贴图窗口。',
              },
              {
                term: 'o：输出至标准输出',
                badge: 'to 组合码',
                detail: '把最终 PNG 字节流写入 stdout，便于通过管道衔接后续脚本。默认组合为 cs（复制并保存）。',
              },
            ],
          },
        ],
      },
      {
        id: 'workflow-cli',
        heading: '常用命令行选项与脚本化模式',
        blocks: [
          {
            kind: 'code',
            label: '交互截图与无界面脚本化截图示例',
            code: `mark-shot                         # 冻结屏幕，框选后进入标注编辑
mark-shot -m                      # 仅冻结鼠标指针所在的显示器
mark-shot -f -t cs                # 不打开编辑器，立即截取全屏并复制+保存
mark-shot -r -t c                 # 拖动框选松手即复制到剪贴板
mark-shot -w -t c                 # 截取当前活动窗口（niri 需包含 c）
mark-shot -d 2.5                  # 延时 2.5 秒后执行截图（支持 0 到 60 小数）
mark-shot --scroll                # 框选后进入滚动长截图拼接模式
mark-shot --capture-to ~/shot.png --region 100,100,800,600 --include-cursor`,
          },
          {
            kind: 'kvGrid',
            columns: 2,
            items: [
              {
                term: '--all-outputs / --display <名称>',
                detail: '显式冻结整个多屏桌面，或重复传入 --display 仅捕获指定输出（可用 --list-displays 输出 JSON 查询名称）。',
              },
              {
                term: '--default-tool / --default-color',
                detail: '指定框选完成后的初始激活工具（如 arrow、rectangle、ruler、magnifier）及初始颜色（#RRGGBB 或 #RRGGBBAA）。',
              },
              {
                term: '--pin-image / --pin-clipboard',
                detail: '不经过框选，直接将本地图片文件或剪贴板中的图片与纯文本贴到屏幕顶层。',
              },
              {
                term: '--scan / --scan-json <图片>',
                detail: '在本地识别屏幕选区或图片文件中的二维码与条形码；--scan-json 直接输出包含 format 与 text 的 JSON 数组。',
              },
              {
                term: '--history / --settings',
                detail: '独立打开最近截图历史管理窗口或 11 页可视化设置面板。',
              },
              {
                term: '--debug / --speed / --debug-log <文件>',
                detail: '--debug 启动时向标准错误打印日志路径并传递给辅助进程；--speed 输出各启动阶段微秒耗时，--debug-log 写入指定诊断文件。',
              },
            ],
          },
        ],
      },
    ],
  },
];
