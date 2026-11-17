import type { DocChapter } from '@/types/docs';

export const docsConfigPlatformZh: DocChapter[] = [
  {
    id: 'shortcuts',
    categoryId: 'config-platform',
    title: '编辑器默认快捷键与自定义绑定',
    summary:
      '完整列出编辑器内完成动作、18 项工具单键、1px/10px 选区微调、录制控制键以及 [keys] 多键位绑定语法。',
    sections: [
      {
        id: 'shortcuts-general',
        heading: '通用完成动作与视图控制',
        blocks: [
          {
            kind: 'keyGrid',
            items: [
              { keys: 'Enter', action: '确认并执行 [general].to 默认完成动作', configKey: 'accept' },
              { keys: 'Ctrl + C / 双击选区', action: '复制图像到系统剪贴板', configKey: 'copy' },
              { keys: 'Ctrl + S / Ctrl + Alt + S', action: '保存到默认截图目录 / 打开另存为对话框', configKey: 'save / save_as' },
              { keys: 'Ctrl + P', action: '把当前选区置顶贴在屏幕上方', configKey: 'pin' },
              { keys: 'Ctrl + Shift + S', action: '启动滚动长截图自动拼接', configKey: 'scroll_capture' },
              { keys: 'Ctrl + Z / Ctrl + Y', action: '撤销上一步标注 / 重做标注', configKey: 'undo / redo' },
              { keys: 'Delete / Backspace', action: '删除当前选中的标注或曲线控制点', configKey: 'delete' },
              { keys: 'Ctrl + H / Ctrl + ,', action: '打开最近截图历史 / 打开设置面板', configKey: 'history / settings' },
              { keys: 'Ctrl + Shift + L', action: '切换浅色与深色工具栏主题并保存', configKey: 'toggle_theme' },
              { keys: 'Space / Shift + M', action: '隐藏或显示浮动工具栏 / 开关指针取色放大镜', configKey: 'toggle_ui / toggle_magnifier' },
              { keys: '[ / ]', action: '减小或增大当前工具笔宽与字号', configKey: 'size_down / size_up' },
              { keys: 'Ctrl+Shift+R / G / P / E', action: '录制视频 / 录制 GIF / 暂停继续 / 停止保存', configKey: 'record_*' },
            ],
          },
        ],
      },
      {
        id: 'shortcuts-tools-nudge',
        heading: '绘图工具单键、像素微调与 [keys] 配置',
        blocks: [
          {
            kind: 'keyGrid',
            items: [
              { keys: 'S / V', action: '调整选区工具 / 选择与变换标注工具', configKey: 'tool_selection / tool_pick' },
              { keys: 'P / H / D / A', action: '画笔 / 荧光笔 / 直线 / 箭头', configKey: 'tool_pen ... tool_arrow' },
              { keys: 'R / C / K', action: '矩形 / 椭圆 / 24 种预设形状标记', configKey: 'tool_rectangle ... tool_marker' },
              { keys: 'T / N / Shift + N', action: '文字 / 递增序号圆章 / 编号箭头', configKey: 'tool_text / tool_number' },
              { keys: 'M (或 X) / Z / U', action: '马赛克滤镜 / 双框放大镜 / 像素角度标尺', configKey: 'tool_redact / magnifier / ruler' },
              { keys: 'G / I / O', action: '演示激光笔 / 取色标注 / 本地文字识别', configKey: 'tool_laser / eyedropper / ocr' },
              { keys: '方向键 / Shift + 方向键', action: '按 1px / 10px 步长精确平移截图选区', configKey: 'move_* / move_*_fast' },
              { keys: 'Alt + 方向键 (+ Shift)', action: '按 1px / 10px 步长精确伸缩选区宽高', configKey: 'resize_* / resize_*_fast' },
            ],
          },
          {
            kind: 'code',
            label: '在 config.toml 中自定义快捷键或为空列表解绑',
            code: `[keys]
copy = "Ctrl+C"
redo = ["Ctrl+Shift+Z", "Ctrl+Y"]
upload = "F8"
translate = "F9"
toggle_ui = []            # 空数组表示取消该动作的按键绑定`,
          },
        ],
      },
    ],
  },
  {
    id: 'configuration',
    categoryId: 'config-platform',
    title: 'config.toml 全字段、图床上传与目录规范',
    summary:
      '查阅配置文件路径、核心分组示例、自定义图床上传协议、环境变量优先级以及遵循 XDG 规范的数据存储位置。',
    sections: [
      {
        id: 'config-core-toml',
        heading: '配置文件路径与常用分组示例',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Linux 默认读取 ~/.config/mark-shot/config.toml（遵循 XDG_CONFIG_HOME），Windows 读取 %APPDATA%\\mark-shot\\config.toml。首次运行仅写入最小差异项，删除任意字段即恢复内置默认值；运行 mark-shot --print-default-config 可打印带完整注释的默认模板。',
            ],
          },
          {
            kind: 'code',
            label: '核心行为、保存命名与自定义图床上传配置示例',
            code: `[ui]
theme = "system"                  # light | dark | system
language = "chinese"              # system | english | chinese

[general]
to = "cs"                         # 默认复制并保存
overlay = "auto"                  # auto（niri/COSMIC 用 layer）| window | layer

[capture]
freeze_scope = "cursor-screen"    # all-screens | cursor-screen
show_start_bar = true
show_hints = true
double_click_action = "copy"      # none | copy | save | save-as | pin | cancel
toolbar_position = "selection"    # selection | top | bottom | left | right

[save]
directory = "screenshots"
month_format = "%Y-%m"
filename_format = "%Y-%m-%d_%H-%M"

[upload]
command = ""                      # 留空走内置 multipart POST；或填含 {image} 占位符的外部命令
timeout_ms = 60000

[upload.env]
MARK_SHOT_UPLOAD_URL = "https://img.example.com/api/upload"
MARK_SHOT_UPLOAD_FIELD = "image"
MARK_SHOT_UPLOAD_API_KEY = "your-token"
MARK_SHOT_UPLOAD_URL_PATH = "data.url"`,
          },
        ],
      },
      {
        id: 'config-env-dirs',
        heading: '环境变量覆盖与本地存储目录',
        blocks: [
          {
            kind: 'kvGrid',
            columns: 2,
            items: [
              {
                term: 'MARK_SHOT_BACKEND',
                badge: '协议覆盖',
                detail: '取值 auto、wayland 或 x11；强制指定的显示服务不可达时直接报错，不会静默回退。',
              },
              {
                term: 'MARK_SHOT_CAPTURE',
                badge: '截图通道',
                detail: '取值 kde、image-copy、screencopy 或 portal，用于在 Wayland 会话中锁定特定帧获取协议。',
              },
              {
                term: 'MARK_SHOT_OCR_MIRROR',
                badge: '下载镜像',
                detail: '为 ONNX Runtime 与 PP-OCRv5 语言包指定 HTTP/HTTPS GitHub 镜像前缀，优先于配置文件。',
              },
              {
                term: 'XDG 数据与状态隔离',
                badge: '目录规范',
                detail: '状态与日志位于 ~/.local/state/mark-shot/；OCR 模型、运行库与历史位于 ~/.local/share/mark-shot/。',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'desktop-integration',
    categoryId: 'config-platform',
    title: '桌面合成器绑定与五大平台支持矩阵',
    summary:
      '提供 niri、Sway、Hyprland 配置片段、后台托盘与全局快捷键门户机制，以及各桌面环境的真实协议支持对照。',
    sections: [
      {
        id: 'desktop-compositor-binds',
        heading: '平铺合成器按键绑定与常驻后台服务',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              '在平铺式 Wayland 合成器上，推荐直接在合成器配置中绑定 mark-shot 命令；在 KDE、GNOME、X11 或 Windows 上，也可启用内置后台服务（mark-shot --background 或开启开机启动）持有系统托盘与全局快捷键。',
            ],
          },
          {
            kind: 'code',
            label: 'niri / Sway / Hyprland 快捷键与自启动片段',
            code: `// 1. niri (~/.config/niri/config.kdl)
spawn-at-startup "mark-shot" "--background"
binds {
    Print { spawn "mark-shot"; }
    Shift+Print { spawn "mark-shot" "--scroll"; }
}

# 2. Sway (~/.config/sway/config)
bindsym Print exec mark-shot
bindsym Shift+Print exec mark-shot --scroll

# 3. Hyprland (~/.config/hypr/hyprland.conf)
bind = , Print, exec, mark-shot
bind = SHIFT, Print, exec, mark-shot --scroll`,
          },
        ],
      },
      {
        id: 'desktop-platform-matrix',
        heading: '五大显示环境协议与能力细则对照',
        blocks: [
          {
            kind: 'screenshot',
            src: '/images/real-dark-capture.png',
            alt: 'Mark Shot 在 Wayland 下的深色覆盖层实机画面',
            caption: 'Wayland 会话即使存在 DISPLAY 变量也坚持走原生 Wayland 协议，避免 Xwayland 黑屏。',
          },
          {
            kind: 'kvGrid',
            columns: 2,
            items: [
              {
                term: 'niri / Sway / wlroots',
                badge: '原生全功能',
                detail: '通过 ext-image-copy-capture 或 wlr-screencopy 捕获，layer-shell 置顶覆盖与贴图，ext/wlr-data-control 剪贴板，niri/Sway IPC 提供真实窗口吸附。',
              },
              {
                term: 'KDE Plasma (Wayland)',
                badge: 'KWin 直连',
                detail: '默认采用 KWin ScreenShot2 接口与一次性窗口快照脚本（完整支持窗口吸附、遮挡过滤、layer-shell 贴图与长截图）。',
              },
              {
                term: 'GNOME (Wayland)',
                badge: 'Portal + PipeWire',
                detail: '通过 ScreenCast 门户授权截图与录制，xdg-shell 全屏窗口编辑，剪贴板经 Xwayland 桥接；受限于 GNOME 未公开接口，暂不支持窗口吸附与贴图置顶。',
              },
              {
                term: 'X11 与 Windows (实验性)',
                badge: '原生图形接口',
                detail: 'X11 使用 XGetImage / RandR / _NET_WM_STATE_ABOVE；Windows 使用 GDI / WGC / DWM 边框与 UI Automation 组件识别。',
              },
            ],
          },
        ],
      },
    ],
  },
];
