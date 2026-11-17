import { useState } from 'react';
import {
  ArrowRight,
  Check,
  Copy,
  PencilLine,
  PushPin,
  Scroll,
  TextT,
  VideoCamera,
} from '@phosphor-icons/react';
import { copyTextWithToast } from '@/utils/clipboard';

interface InteractiveFeatureShowcaseProps {
  heading: string;
  subheading: string;
  isZh: boolean;
  docsBaseHref: string;
  selectedShotSrc: string;
  backdropSrc: string;
}

type StudioToolKey = 'rect' | 'arrow' | 'step' | 'magnifier' | 'ruler' | 'redact';
type PinTabKey = 'code' | 'color' | 'note';
type OcrTabKey = 'ocr' | 'translate';
type RecFormatKey = 'MP4' | 'MKV' | 'GIF';

/**
 * 【首页能力矩阵】【PixPin 融合交互卡组】提供可点选的标注工具预览、贴图多形态切换、离线识别译文对比及长截图与录屏展示，并直连细则文档锚点
 * @param props 区块标题、语言标识、文档基路径与实机截图地址
 * @returns 五宫格非对称可交互能力卡片组
 */
export function InteractiveFeatureShowcase({
  heading,
  subheading,
  isZh,
  docsBaseHref,
  selectedShotSrc,
  backdropSrc,
}: InteractiveFeatureShowcaseProps) {
  const [studioTool, setStudioTool] = useState<StudioToolKey>('magnifier');
  const [pinTab, setPinTab] = useState<PinTabKey>('code');
  const [ocrTab, setOcrTab] = useState<OcrTabKey>('ocr');
  const [copiedOcr, setCopiedOcr] = useState(false);
  const [recFmt, setRecFmt] = useState<RecFormatKey>('MP4');

  const studioTools: Array<{
    id: StudioToolKey;
    zh: string;
    en: string;
    key: string;
    propZh: string;
    propEn: string;
    noteZh: string;
    noteEn: string;
  }> = [
    {
      id: 'rect',
      zh: '圆角矩形',
      en: 'Rounded Rect',
      key: 'R',
      propZh: '4px · 填充可选 · 1:1 · R 4px',
      propEn: '4px · Fill · 1:1 · R 4px',
      noteZh: '按住 Shift 锁定正方形，选中后外扩留白虚线框不遮挡描边粗细',
      noteEn: 'Hold Shift for 1:1 square; padded selection box preserves stroke visibility',
    },
    {
      id: 'arrow',
      zh: '内凹箭头',
      en: 'Concave Arrow',
      key: 'A',
      propZh: '直箭头 / 实心 / 开口 · 实虚点三线型',
      propEn: 'Concave / Solid / Open · 3 dash styles',
      noteZh: '用选择工具双击箭身即可插入控制点弯曲路径，Delete 删除控制点',
      noteEn: 'Double-click shaft with Pick (V) to insert bend control points',
    },
    {
      id: 'step',
      zh: '七式序号',
      en: '7-Style Steps',
      key: 'N',
      propZh: '123 · ABC · 罗马数字 · 天干 · 中文数字',
      propEn: '123 · ABC · Roman · Stems · CJK',
      noteZh: '单击放置圆章，拖拽自动拉出指向箭尾；删除单枚不影响其余计数',
      noteEn: 'Click for badge or drag to pull a directional tail; independent counter reset',
    },
    {
      id: 'magnifier',
      zh: '双框放大镜',
      en: 'Linked Magnifier',
      key: 'Z',
      propZh: '1.25x - 6.00x · 圆形 / 矩形镜框',
      propEn: '1.25x - 6.00x · Circle / Square lens',
      noteZh: '源框与放大镜框由两条外公切线相连，可独立拖动且等比联动缩放',
      noteEn: 'Source ring and zoomed lens connect via outer tangents and scale in lockstep',
    },
    {
      id: 'ruler',
      zh: '像素角度尺',
      en: 'Pixel & Angle Ruler',
      key: 'U',
      propZh: '宽高 · 对角线 · 面积 · 再次按 U 测夹角',
      propEn: 'W x H · Diagonal · Area · Press U for angle',
      noteZh: '以原始图像像素为单位输出刻度尺读数，适合高分屏 UI 间距核验',
      noteEn: 'Measures exact image pixels with 50px major ticks and angle toggle',
    },
    {
      id: 'redact',
      zh: '离线滤镜',
      en: 'Raw-Pixel Redact',
      key: 'M',
      propZh: '像素化 · 毛玻璃 · 聚焦暗角 · 反色 (强度 4-48)',
      propEn: 'Pixelate · Blur · Spotlight · Invert (4-48)',
      noteZh: '滤镜始终基于原始截图计算，聚焦模式压暗外围而不加多余彩色描边',
      noteEn: 'Computed strictly on raw capture pixels; Spotlight dims surroundings cleanly',
    },
  ];

  const activeStudio =
    studioTools.find((item) => item.id === studioTool) ?? studioTools[0]!;

  const ocrSample =
    ocrTab === 'ocr'
      ? '| 阶段 | 中位耗时 | 常驻内存 |\n| --- | --- | --- |\n| 托盘热唤起 | 31.6 ms | 21.6 MiB |'
      : isZh
        ? '捕获活动显示器像素并直接移交共享内存画布，无需启动 grim 或 wl-copy 外部进程。'
        : 'Captures active output frames directly into shared-memory canvas without grim or wl-copy.';

  /**
   * 【识别卡片】【一键复制】复制演示识别出的 Markdown 表格或译文并弹出全局提示
   * @returns 异步完成状态
   */
  const handleCopyOcr = async () => {
    // 1. 写入系统剪贴板并切换短暂勾选反馈
    const ok = await copyTextWithToast(
      ocrSample,
      isZh ? '已复制演示识别内容到剪贴板' : 'Copied recognized text to clipboard'
    );
    if (!ok) {
      return;
    }
    setCopiedOcr(true);
    window.setTimeout(() => setCopiedOcr(false), 1600);
  };

  return (
    <section id="capabilities" className="relative" data-section data-hatch-band>
      <div className="wrap pt-16 pb-16 md:pt-22 md:pb-24">
        <div className="max-w-[42rem]">
          <h2 className="text-[clamp(1.65rem,2.6vw,2.3rem)] leading-[1.14] font-normal text-[var(--ink)]">
            {heading}
          </h2>
          <p className="mt-3 text-[1rem] leading-[1.65] text-[var(--soft)]">
            {subheading}
          </p>
        </div>

        <div className="mt-9 grid grid-cols-1 gap-5 md:grid-cols-12">
          {/* 第一行（12 列通栏）：PixPin 风格左控右景可交互标注工作台 */}
          <article className="grid grid-cols-1 gap-6 overflow-hidden rounded-2xl border border-[var(--rule)] bg-[var(--card)] p-5 sm:p-7 md:col-span-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:items-center">
            <div className="flex flex-col justify-between gap-5">
              <div>
                <div className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent-soft)] px-2.5 py-1 font-[family-name:var(--sans)] text-[0.8125rem] font-medium text-[var(--accent)]">
                  <PencilLine size={16} />
                  <span>{isZh ? '19 种原生标注与测量' : '19 Native Annotation Tools'}</span>
                </div>
                <h3 className="mt-3.5 text-[1.4rem] leading-[1.2] font-normal text-[var(--ink)]">
                  {isZh
                    ? '截完原地标注，点一下工具切换参数细则'
                    : 'Annotate directly on frozen pixels with per-tool memory'}
                </h3>
                <p className="mt-2.5 text-[0.9375rem] leading-[1.62] text-[var(--soft)]">
                  {isZh
                    ? '主工具栏与动作副栏均可自定义按钮显隐，每个工具独立记忆上次使用的颜色、笔宽与圆角样式。'
                    : 'Both toolbars are customizable, and each tool remembers its last stroke width, color, and corner style across sessions.'}
                </p>

                <a
                  href={`${docsBaseHref}#annotation`}
                  className="mt-3 inline-flex items-center gap-1.5 font-[family-name:var(--sans)] text-[0.875rem] font-medium text-[var(--accent)] transition-opacity hover:opacity-80"
                >
                  <span>{isZh ? '查阅标注工具细则' : 'Read annotation manual'}</span>
                  <ArrowRight size={14} weight="bold" />
                </a>
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap gap-1.5 font-[family-name:var(--sans)]">
                  {studioTools.map((tool) => {
                    const active = tool.id === studioTool;
                    return (
                      <button
                        key={tool.id}
                        type="button"
                        onClick={() => setStudioTool(tool.id)}
                        className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-[0.8125rem] transition-colors ${
                          active
                            ? 'border-[var(--accent)] bg-[var(--accent)] font-medium text-[var(--accent-ink)]'
                            : 'border-[var(--rule)] bg-[var(--paper)] text-[var(--soft)] hover:text-[var(--ink)]'
                        }`}
                      >
                        <span>{isZh ? tool.zh : tool.en}</span>
                        <kbd className="font-[family-name:var(--mono)] text-[0.6875rem] opacity-75">
                          {tool.key}
                        </kbd>
                      </button>
                    );
                  })}
                </div>

                <div className="rounded-xl border border-[var(--rule)] bg-[var(--paper)] px-3.5 py-2.5 font-[family-name:var(--sans)] text-[0.8125rem]">
                  <div className="font-[family-name:var(--mono)] text-[0.75rem] text-[var(--accent)]">
                    {isZh ? activeStudio.propZh : activeStudio.propEn}
                  </div>
                  <p className="mt-1 text-[var(--soft)]">
                    {isZh ? activeStudio.noteZh : activeStudio.noteEn}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-[var(--rule)] bg-[#11161a]">
              <img
                src={selectedShotSrc}
                alt={isZh ? 'Mark Shot 真实标注与外扩橙色选框实机图' : 'Mark Shot native annotation handles'}
                loading="lazy"
                className="h-[260px] w-full object-cover object-top sm:h-[300px]"
              />
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-[#0f1317]/95 px-3.5 py-2 font-[family-name:var(--mono)] text-[0.75rem] text-slate-300">
                <span>
                  {isZh
                    ? `当前检视：${activeStudio.zh} (${activeStudio.key})`
                    : `Inspecting: ${activeStudio.en} (${activeStudio.key})`}
                </span>
                <span className="text-[#5eead4]">[ / ] {isZh ? '滚轮调笔宽' : 'Wheel stroke size'}</span>
              </div>
            </div>
          </article>

          {/* 第二行左卡（6 列）：置顶贴图随手钉 */}
          <article className="flex flex-col justify-between gap-5 rounded-2xl border border-[var(--rule)] bg-[color-mix(in_srgb,var(--accent)_3.5%,var(--card))] p-5 sm:p-6 md:col-span-6">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent-soft)] px-2.5 py-1 font-[family-name:var(--sans)] text-[0.8125rem] font-medium text-[var(--accent)]">
                  <PushPin size={15} />
                  <span>{isZh ? '置顶贴图 · Ctrl+P' : 'Always-on-Top Pin · Ctrl+P'}</span>
                </span>
                <a
                  href={`${docsBaseHref}#pin-scroll`}
                  className="inline-flex items-center gap-1 font-[family-name:var(--sans)] text-[0.8125rem] font-medium text-[var(--accent)] hover:opacity-80"
                >
                  <span>{isZh ? '贴图细则' : 'Pin manual'}</span>
                  <ArrowRight size={13} weight="bold" />
                </a>
              </div>

              <h3 className="mt-3 text-[1.25rem] leading-[1.22] font-normal text-[var(--ink)]">
                {isZh ? '截图、图片与剪贴板文本随手钉在屏幕最上层' : 'Pin regions, image files, or clipboard text on top'}
              </h3>
              <p className="mt-2 text-[0.9rem] leading-[1.6] text-[var(--soft)]">
                {isZh
                  ? '滚轮以指针为中心无损缩放，双击即关；无论窗口缩得多小，复制与另存为始终输出原始像素。'
                  : 'Wheel-zoom around the cursor and double-click to close; copy and save always preserve raw unscaled pixels.'}
              </p>
            </div>

            <div className="space-y-3">
              <div className="inline-flex rounded-full border border-[var(--rule)] bg-[var(--card)] p-0.5 font-[family-name:var(--sans)] text-[0.78rem]">
                {(
                  [
                    ['code', isZh ? '代码贴图' : 'Code Pin'],
                    ['color', isZh ? '像素色卡' : 'Color Chip'],
                    ['note', isZh ? '纯文本贴图' : 'Clipboard Text'],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setPinTab(key)}
                    className={`cursor-pointer rounded-full px-3 py-1 transition-colors ${
                      pinTab === key
                        ? 'bg-[var(--ink)] font-medium text-[var(--paper)]'
                        : 'text-[var(--soft)] hover:text-[var(--ink)]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="rounded-xl border-2 border-[#5eead4] bg-[#14181d] p-3.5 font-[family-name:var(--mono)] text-[0.75rem] leading-[1.58] text-slate-200 shadow-lg">
                {pinTab === 'code' && (
                  <>
                    <div className="mb-1.5 flex items-center justify-between text-[0.6875rem] text-[#5eead4]">
                      <span>mark-shot --pin-clipboard</span>
                      <span>100% · Always on Top</span>
                    </div>
                    <p className="select-text text-teal-100">
                      conn.ext_image_copy_capture()? -&gt; ShmFrame (31.6 ms)
                    </p>
                  </>
                )}
                {pinTab === 'color' && (
                  <div className="flex items-center gap-3">
                    <span className="h-10 w-10 shrink-0 rounded-lg border border-white/20 bg-[#0d9488]" />
                    <div>
                      <div className="font-semibold text-white">HEX #0D9488 · RGB(13, 148, 136)</div>
                      <div className="text-slate-400">
                        {isZh ? '取色标注 (I) 采样 · 滚轮缩放逐像素对齐' : 'Sampled via Eyedropper (I) · Pixel-aligned'}
                      </div>
                    </div>
                  </div>
                )}
                {pinTab === 'note' && (
                  <div className="font-[family-name:var(--sans)] text-[0.8125rem] text-slate-200">
                    {isZh
                      ? '按 Ctrl+V 可将剪贴板纯文本或图片直接生成为独立置顶贴图窗口，对照文档无需来回切换工作区。'
                      : 'Press Ctrl+V on an active pin to spawn another pinned note from clipboard text or image.'}
                  </div>
                )}
              </div>
            </div>
          </article>

          {/* 第二行右卡（6 列）：本地 PP-OCRv5 与原位翻译 */}
          <article className="flex flex-col justify-between gap-5 rounded-2xl border border-[var(--rule)] bg-[var(--card)] p-5 sm:p-6 md:col-span-6">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent-soft)] px-2.5 py-1 font-[family-name:var(--sans)] text-[0.8125rem] font-medium text-[var(--accent)]">
                  <TextT size={15} />
                  <span>{isZh ? '离线 PP-OCRv5 与翻译' : 'Offline PP-OCRv5 & Translate'}</span>
                </span>
                <a
                  href={`${docsBaseHref}#ocr-translate`}
                  className="inline-flex items-center gap-1 font-[family-name:var(--sans)] text-[0.8125rem] font-medium text-[var(--accent)] hover:opacity-80"
                >
                  <span>{isZh ? '识别与翻译细则' : 'OCR & translate manual'}</span>
                  <ArrowRight size={13} weight="bold" />
                </a>
              </div>

              <h3 className="mt-3 text-[1.25rem] leading-[1.22] font-normal text-[var(--ink)]">
                {isZh ? '本机离线提取文字与表格，多引擎原位对照翻译' : 'Extract text and tables offline; translate in place'}
              </h3>
              <p className="mt-2 text-[0.9rem] leading-[1.6] text-[var(--soft)]">
                {isZh
                  ? '基于 ONNX Runtime 1.28.0 在本地推理七大语系，图片不离机；表格支持一键复制为 TSV、CSV、Markdown 或 HTML。'
                  : 'Runs PP-OCRv5 locally on ONNX Runtime 1.28.0; multi-column tables copy directly as TSV, CSV, Markdown, or HTML.'}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="inline-flex rounded-full border border-[var(--rule)] bg-[var(--paper)] p-0.5 font-[family-name:var(--sans)] text-[0.78rem]">
                  <button
                    type="button"
                    onClick={() => setOcrTab('ocr')}
                    className={`cursor-pointer rounded-full px-3 py-1 transition-colors ${
                      ocrTab === 'ocr'
                        ? 'bg-[var(--ink)] font-medium text-[var(--paper)]'
                        : 'text-[var(--soft)] hover:text-[var(--ink)]'
                    }`}
                  >
                    {isZh ? 'Markdown 表格识别' : 'Table OCR'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setOcrTab('translate')}
                    className={`cursor-pointer rounded-full px-3 py-1 transition-colors ${
                      ocrTab === 'translate'
                        ? 'bg-[var(--ink)] font-medium text-[var(--paper)]'
                        : 'text-[var(--soft)] hover:text-[var(--ink)]'
                    }`}
                  >
                    {isZh ? '多引擎译文' : 'Translation'}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleCopyOcr}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-[var(--rule)] bg-[var(--paper)] px-2.5 py-1 font-[family-name:var(--sans)] text-[0.75rem] text-[var(--soft)] hover:text-[var(--ink)]"
                >
                  {copiedOcr ? (
                    <>
                      <Check size={13} weight="bold" className="text-[var(--accent)]" />
                      <span>{isZh ? '已复制' : 'Copied'}</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>{isZh ? '复制结果' : 'Copy output'}</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="overflow-x-auto rounded-xl border border-[var(--rule)] bg-[var(--paper)] p-3 font-[family-name:var(--mono)] text-[0.75rem] leading-[1.55] text-[var(--ink)]">
                {ocrSample}
              </pre>
            </div>
          </article>

          {/* 第三行左卡（6 列）：滚动长截图去重拼接 */}
          <article className="flex flex-col justify-between gap-4 rounded-2xl border border-[var(--rule)] bg-[var(--card)] p-5 sm:p-6 md:col-span-6">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent-soft)] px-2.5 py-1 font-[family-name:var(--sans)] text-[0.8125rem] font-medium text-[var(--accent)]">
                  <Scroll size={15} />
                  <span>{isZh ? '滚动长截图 · Ctrl+Shift+S' : 'Scroll Capture · Ctrl+Shift+S'}</span>
                </span>
                <a
                  href={`${docsBaseHref}#pin-scroll`}
                  className="inline-flex items-center gap-1 font-[family-name:var(--sans)] text-[0.8125rem] font-medium text-[var(--accent)] hover:opacity-80"
                >
                  <span>{isZh ? '长截图细则' : 'Scroll manual'}</span>
                  <ArrowRight size={13} weight="bold" />
                </a>
              </div>

              <h3 className="mt-3 text-[1.25rem] leading-[1.22] font-normal text-[var(--ink)]">
                {isZh ? '自动剥离固定页头页尾，平稳滚动即刻拼成长图' : 'Automatic header/footer stripping & live stitch'}
              </h3>
              <p className="mt-2 text-[0.9rem] leading-[1.6] text-[var(--soft)]">
                {isZh
                  ? '运行 mark-shot --scroll 或框选后按 Ctrl+Shift+S，重叠不足时实时提示轻微回退补帧。'
                  : 'Run mark-shot --scroll or press Ctrl+Shift+S; prompts gentle rollback whenever fast scroll skips overlap.'}
              </p>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-xl border border-[var(--rule)] bg-[var(--frame)] p-3.5 font-[family-name:var(--mono)] text-[0.75rem]">
              <div className="space-y-1">
                <div className="font-medium text-[var(--ink)]">shot-stitch · 2,840 px +123</div>
                <div className="text-[var(--soft)]">
                  {isZh ? '无边框双预览 · 固定顶底栏仅保留一次' : 'Dual preview · Sticky bars kept once'}
                </div>
              </div>
              <span className="rounded-md bg-[var(--accent-soft)] px-2.5 py-1 font-medium text-[var(--accent)]">
                --scroll
              </span>
            </div>
          </article>

          {/* 第三行右卡（6 列）：进程内硬件编码区域录屏 */}
          <article className="flex flex-col justify-between gap-4 rounded-2xl border border-[var(--rule)] bg-[color-mix(in_srgb,var(--accent)_3.5%,var(--card))] p-5 sm:p-6 md:col-span-6">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent-soft)] px-2.5 py-1 font-[family-name:var(--sans)] text-[0.8125rem] font-medium text-[var(--accent)]">
                  <VideoCamera size={15} />
                  <span>{isZh ? '区域录屏 · MP4 / MKV / GIF' : 'Region Recording · MP4 / MKV / GIF'}</span>
                </span>
                <a
                  href={`${docsBaseHref}#recording`}
                  className="inline-flex items-center gap-1 font-[family-name:var(--sans)] text-[0.8125rem] font-medium text-[var(--accent)] hover:opacity-80"
                >
                  <span>{isZh ? '录屏编码细则' : 'Recording manual'}</span>
                  <ArrowRight size={13} weight="bold" />
                </a>
              </div>

              <h3 className="mt-3 text-[1.25rem] leading-[1.22] font-normal text-[var(--ink)]">
                {isZh ? '进程内采集与硬件编码，不启动外部 ffmpeg 进程' : 'In-process capture & GPU encoding without external CLI'}
              </h3>
              <p className="mt-2 text-[0.9rem] leading-[1.6] text-[var(--soft)]">
                {isZh
                  ? '优先走 DMA-BUF / Windows Graphics Capture 与 VAAPI、NVENC、Media Foundation，支持暂停续录与异常恢复目录。'
                  : 'Uses DMA-BUF / WGC with VAAPI, NVENC, or Media Foundation; supports pause/resume without re-encoding MKV.'}
              </p>
            </div>

            <div
              style={{ backgroundImage: `linear-gradient(to right, rgba(15,19,23,0.9), rgba(15,19,23,0.82)), url(${backdropSrc})` }}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--rule)] bg-cover bg-center p-3.5 font-[family-name:var(--mono)] text-[0.75rem] text-slate-200"
            >
              <div className="flex items-center gap-1.5">
                {(['MP4', 'MKV', 'GIF'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setRecFmt(fmt)}
                    className={`cursor-pointer rounded-md px-2.5 py-0.5 transition-colors ${
                      recFmt === fmt
                        ? 'bg-[#2dd4bf] font-semibold text-[#062825]'
                        : 'bg-white/10 text-slate-300 hover:bg-white/18'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
              <span className="text-[#5eead4]">
                {recFmt === 'MP4'
                  ? 'H.264 + AAC · Direct write'
                  : recFmt === 'MKV'
                    ? 'Remux without re-encode'
                    : '12 fps adaptive palette'}
              </span>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
