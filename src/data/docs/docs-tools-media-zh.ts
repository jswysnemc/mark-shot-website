import type { DocChapter } from '@/types/docs';

export const docsToolsMediaZh: DocChapter[] = [
  {
    id: 'pin-scroll',
    categoryId: 'pin-scroll',
    title: '置顶贴图、滚动长截图与历史回溯',
    summary:
      '掌握无损像素置顶贴图手势、贴图内直接划词复制、固定页头页尾剥离的滚动长截图以及受容量上限保护的截图历史库。',
    sections: [
      {
        id: 'pin-interactions',
        heading: '置顶贴图操作细则',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              '在编辑器中按 Ctrl+P（或点击右侧图钉图标）、执行 mark-shot --pin-image <文件> 或 mark-shot --pin-clipboard，均可创建置顶贴图窗口。从已有贴图再次进入标注编辑时，原贴图会暂时隐藏，编辑完成或取消后自动恢复。',
              '无论贴图窗口被缩放至何种显示尺寸，执行复制或另存为时始终导出未经降采样的原始像素。触发贴图文字识别后，可直接在贴图画面上拖动鼠标选中文字并按 Ctrl+C 复制。',
            ],
          },
          {
            kind: 'keyGrid',
            items: [
              { keys: '左键拖动', action: '在屏幕任意位置移动贴图窗口' },
              { keys: '滚轮 / 拖边角', action: '以指针位置为中心无级等比缩放' },
              { keys: '左键双击', action: '立即关闭当前贴图窗口' },
              { keys: 'Ctrl + V', action: '将当前剪贴板内容生成为另一枚独立贴图窗口' },
              { keys: '右键菜单', action: '旋转、重置尺寸、置顶开关、重新标注、识别文字、原位翻译、扫码、另存为' },
            ],
          },
        ],
      },
      {
        id: 'scroll-and-history',
        heading: '滚动长截图与截图历史管理',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              '运行 mark-shot --scroll 或框选区域后按 Ctrl+Shift+S 进入滚动长截图。以平稳速度向下滚动高亮选区内的页面，无边框控制面板实时并排展示主细节预览、副全景概览与 +px 拼接增量，网页或应用顶部与底部的固定栏仅保留一次。当滚动过快导致相邻帧重叠不足时，界面会即时提示缓慢回退以补齐画面。',
              '已完成的截图默认自动记入历史库（已取消的截图不落盘）。按 Ctrl+H 或运行 mark-shot --history 可浏览缩略图并执行复制、贴图、另存为、重新编辑或删除；另存为调用系统原生文件保存门户（Linux XDG FileChooser / Windows IFileSaveDialog）。默认保留最近 50 张且总上限 256 MiB，超出后自动淘汰最早记录。',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'annotation',
    categoryId: 'annotation',
    title: '19 种标注工具、修饰键与导出外框',
    summary:
      '逐项说明直线曲线控制点、内凹箭头、七式递增序号、原始像素滤镜、双框切线放大镜、长度角度标尺及圆角阴影外框。',
    sections: [
      {
        id: 'annotation-details',
        heading: '核心绘图与测量工具机制',
        blocks: [
          {
            kind: 'screenshot',
            src: '/images/real-selected-annotation.png',
            alt: '选中标注时的外扩橙色虚线框与旋转删除控点',
            caption: '按 V 选中标注后显示外扩留白虚线框、顶部旋转柄与右上角红色删除钮，留白不计入最终保存几何。',
          },
          {
            kind: 'kvGrid',
            columns: 2,
            items: [
              {
                term: '直线 (D) 与箭头 (A)',
                badge: '可插点弯曲',
                detail: '提供内凹直箭头、实心三角与开口线条三种头部及实线、虚线、点线；用选择工具 (V) 双击路径可插入控制点将其弯曲为平滑曲线。',
              },
              {
                term: '矩形 (R)、椭圆 (C) 与形状 (K)',
                badge: '24 种预设形状',
                detail: '支持描边或半透明填充，矩形可在二级属性栏调节像素圆角 R，按住 Shift 或开启 1:1 锁定正方形与正圆。',
              },
              {
                term: '序号 (N) 与编号箭头 (Shift+N)',
                badge: '7 种计数制',
                detail: '支持阿拉伯数字、大小写字母、大小写罗马数字、天干与中文数字；单击生成圆章，拖拽自动拉出指向尾部，两套工具独立计数。',
              },
              {
                term: '滤镜与打码 (M / X)',
                badge: '强度 4-48',
                detail: '含像素化、毛玻璃模糊、灰度、反色、提亮及矩形/椭圆聚焦暗角。多个聚焦区域自动合并为统一遮罩而不重复叠加外围暗度；滤镜始终基于原始底图计算。',
              },
              {
                term: '双框联动放大镜 (Z)',
                badge: '1.25x - 6.00x',
                detail: '拖拽创建采样源框与放大镜框，支持圆形或矩形镜面；缩放任一框时另一框自动等比联动，保持设定倍率恒定。',
              },
              {
                term: '像素尺子 (U) 与激光笔 (G)',
                badge: '长度 / 角度双模',
                detail: '尺子实时显示宽高、对角线像素与面积，再次按 U 切换角度测量；激光笔松开约两秒后自动消散，不写入成片也不入撤销栈。',
              },
            ],
          },
        ],
      },
      {
        id: 'annotation-modifiers-frame',
        heading: '绘制修饰键、画布缩放与导出圆角阴影外框',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              '绘制或旋转时按住 Shift 可将角度吸附至 45 度整数倍；按 [ 与 ]（或在绘图工具下滚动滚轮）可直接增减笔宽与字号。在选择工具下滚动滚轮可以指针为中心缩放画布，按住鼠标中键平移，连按两次 Ctrl 复位视图，按 Space 临时隐藏或恢复工具栏。',
              '启用导出外框后，保存或复制图片时会自动附加透明留白、18px 圆角与柔和投影（屏幕贴图预览仍保持紧凑原图）：',
            ],
          },
          {
            kind: 'code',
            label: 'config.toml 导出圆角与柔和阴影外框配置',
            code: `[export.image_frame]
enabled = true
padding = 112
corner_radius = 18.0
shadow_radius = 72
shadow_offset_y = 28
shadow_opacity = 0.32`,
          },
        ],
      },
    ],
  },
  {
    id: 'ocr-translate',
    categoryId: 'ocr-record',
    title: '本地 PP-OCRv5 文字识别与多引擎翻译',
    summary:
      '离线运行七大语系文字与表格提取，按需切换 on-demand / daemon 引擎生命周期，并对接大模型或机器翻译接口。',
    sections: [
      {
        id: 'ocr-engine',
        heading: '离线识别引擎、表格还原与内存回收',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Mark Shot 通过 ONNX Runtime 1.28.0 在本机运行 PP-OCRv5 模型，支持中文、日文、韩文、拉丁文、西里尔文、阿拉伯文、希腊文与泰文，下载资源时强制核验 SHA-256 且支持断点续传。',
              '独立识别结果窗口包含四项视图：文字页（可编辑撤销、Ctrl+Shift+C 复制全文）、原图对照页、多列自动识别的表格页（单元格可改，支持复制为 TSV、CSV、Markdown 或 HTML）以及双语对照翻译页。若希望直接在原图上划选文字而不弹出独立窗口，可设置 result_panel = false。',
            ],
          },
          {
            kind: 'code',
            label: '文字识别运行模式配置（on-demand / at-launch / daemon）',
            code: `[ocr]
engine = "paddle"         # Linux/Windows 推荐本地 paddle；Windows 可选 "system"
download_mirror = ""      # 可选 HTTP/HTTPS GitHub 镜像前缀（异常自动回退直连并校验 SHA-256）
result_panel = true       # 设为 false 时直接在截图画布上拖选文字
threads = 4
mode = "on-demand"        # on-demand 按需创建 | at-launch 启动创建 | daemon 后台热驻留
device = "auto"           # auto | cpu | gpu（供常驻进程使用）
daemon_idle_secs = 900    # 空闲 15 分钟后自动释放常驻模型`,
          },
        ],
      },
      {
        id: 'translation-providers',
        heading: '九类翻译服务与环境变量凭据隔离',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              '仅当主动点击翻译按钮时，待译文本才会发送至所选服务。未配置密钥时默认可用哔哩哔哩 Index-Translate；同时支持 OpenAI Chat Completions、OpenAI Responses、Anthropic Messages、Gemini、腾讯机器翻译、百度翻译、有道翻译及自定义本地命令。大模型接口默认过滤 <think> 思考块。',
              '为避免在 config.toml 中明文落盘 API 密钥，可直接通过进程环境变量注入凭据：',
            ],
          },
          {
            kind: 'code',
            label: '通过环境变量注入大模型与翻译服务凭据',
            code: `export MARK_SHOT_LLM_API_BASE="https://api.openai.com/v1"
export MARK_SHOT_LLM_API_KEY="sk-..."
export MARK_SHOT_LLM_MODEL="gpt-4.1-mini"

# 其他内置通道环境变量前缀：
# MARK_SHOT_GEMINI_API_KEY / MARK_SHOT_ANTHROPIC_API_KEY
# MARK_SHOT_TENCENT_SECRET_ID / MARK_SHOT_BAIDU_APP_ID / MARK_SHOT_YOUDAO_APP_KEY`,
          },
        ],
      },
    ],
  },
  {
    id: 'recording',
    categoryId: 'ocr-record',
    title: '屏幕录制与硬件编码',
    summary:
      '详解 MP4、MKV 与 GIF 进程内采集与硬件编码管线、命令行启停控制以及多显示器与门户授权边界。',
    sections: [
      {
        id: 'recording-pipeline',
        heading: '录制格式、编码器与控制命令',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              '屏幕录制可将单个显示器或其内部矩形区域编码为 MP4（H.264 + AAC 实时直写）、MKV（停止后直接重封装，不二次重编码）或自适应调色板 GIF。异常中断时工作流文件保留在输出目录隐藏的 .Recording_*.recording 文件夹内以供恢复。',
            ],
          },
          {
            kind: 'code',
            label: '录制参数配置与外部命令控制',
            code: `[recording]
format = "mp4"            # mp4 | mkv | gif
quality = "balanced"      # balanced | high | efficient
encoder = "auto"          # auto | hardware | software
fps = 30
gif_fps = 12
countdown = 3
audio = "off"             # off | system | microphone（系统音与麦克风二选一）
keep_controls_visible = false`,
          },
          {
            kind: 'kvGrid',
            columns: 2,
            items: [
              {
                term: 'Wayland 协议直采',
                badge: 'DMA-BUF / SHM',
                detail: '在支持 ext-image-copy-capture 或 wlr-screencopy 的合成器上使用进程内会话，其余桌面走 Portal + PipeWire，硬件编码支持 VAAPI 与 NVENC。',
              },
              {
                term: 'X11 与 Windows 管线',
                badge: 'MIT-SHM / WGC',
                detail: 'X11 采用 MIT-SHM 加 VAAPI/NVENC/OpenH264；Windows 采用 Windows Graphics Capture (D3D11) 与 Media Foundation 硬件编码。',
              },
            ],
          },
          {
            kind: 'callout',
            title: '录制边界说明',
            body: '单次录制范围须位于同一台显示器内，输出为 SDR 8-bit 4:2:0（暂不支持 HDR）。若显式指定 encoder = "hardware"，硬件初始化失败时会直接报错而不会静默回退至软件编码。',
          },
        ],
      },
    ],
  },
];
