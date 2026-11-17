import { PushPin, Record, Translate } from '@phosphor-icons/react/ssr';
import type { CapabilityVisualKind } from '@/data/capabilities-data';

interface BentoVisualProps {
  kind: CapabilityVisualKind;
  isZh: boolean;
  frameImgSrc: string;
  backdropSrc: string;
}

/**
 * 【能力矩阵】【微缩插画】为 6 个 Bento 单元格渲染差异化视觉材质（真实截图、实景贴图、终端与双栏识别预览）
 * @param props 单元格视觉类别与静态资源路径
 * @returns 单元格顶部视觉预览节点
 */
export function BentoVisual({
  kind,
  isZh,
  frameImgSrc,
  backdropSrc,
}: BentoVisualProps) {
  // 1. 矢量标注与双框放大镜：制图浅网格底色配多种序号与内凹箭头
  if (kind === 'tools') {
    return (
      <div className="relative h-48 overflow-hidden border-b border-[var(--rule)] bg-[var(--frame)] p-4">
        <div className="relative h-full w-full overflow-hidden rounded-xl border border-[var(--rule)] bg-[var(--card)] p-4">
          <div className="flex flex-wrap items-center gap-2 font-[family-name:var(--sans)] text-[0.75rem]">
            {['1', '2', 'II', '甲'].map((num, idx) => (
              <span
                key={num}
                className={`grid h-6 w-6 place-items-center rounded-full font-semibold text-white shadow-xs ${
                  idx === 0 ? 'bg-[#0d9488]' : 'bg-[#f97316]'
                }`}
              >
                {num}
              </span>
            ))}
            <span className="ml-auto rounded-md bg-[var(--frame)] px-2 py-0.5 font-[family-name:var(--mono)] text-[0.6875rem] text-[var(--soft)]">
              R=12px · 1.25x-6.0x
            </span>
          </div>

          <svg
            viewBox="0 0 420 110"
            className="mt-2 h-24 w-full overflow-visible"
            aria-hidden="true"
          >
            <rect
              x="12"
              y="18"
              width="156"
              height="68"
              rx="10"
              fill="color-mix(in srgb, var(--accent) 10%, transparent)"
              stroke="var(--accent)"
              strokeWidth="2"
            />
            <rect
              x="6"
              y="12"
              width="168"
              height="80"
              rx="12"
              fill="none"
              stroke="var(--quiet)"
              strokeDasharray="4 4"
              strokeWidth="1"
            />
            <path
              d="M 272 76 Q 228 32 180 48"
              fill="none"
              stroke="#f97316"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="228" cy="46" r="4" fill="var(--card)" stroke="#f97316" strokeWidth="2" />
            <polygon points="173,50 190,42 185,50 190,57" fill="#f97316" />
            <rect
              x="294"
              y="32"
              width="38"
              height="30"
              rx="5"
              fill="none"
              stroke="var(--ink)"
              strokeWidth="1.5"
            />
            <line
              x1="332"
              y1="47"
              x2="354"
              y2="40"
              stroke="var(--quiet)"
              strokeDasharray="3 3"
            />
            <circle
              cx="380"
              cy="44"
              r="28"
              fill="color-mix(in srgb, var(--accent) 16%, var(--card))"
              stroke="var(--accent)"
              strokeWidth="2"
            />
            <text
              x="380"
              y="48"
              textAnchor="middle"
              fontSize="11"
              fontFamily="var(--mono)"
              fill="var(--ink)"
            >
              3.0x
            </text>
          </svg>
        </div>
      </div>
    );
  }

  // 2. 导出外框：直接嵌入 Mark Shot 0.2.1 真实外框预览截图
  if (kind === 'frame') {
    return (
      <div className="relative flex h-48 items-center justify-center overflow-hidden border-b border-[var(--rule)] bg-[var(--frame)] p-3">
        <img
          src={frameImgSrc}
          alt={isZh ? 'Mark Shot 导出外框实时预览界面' : 'Mark Shot export frame preview'}
          loading="lazy"
          className="h-full w-full rounded-lg bg-white object-contain shadow-xs"
        />
      </div>
    );
  }

  // 3. 置顶贴图与划词复制：使用实景摄影图展示置顶无边框窗口与文字选区
  if (kind === 'pin') {
    return (
      <div className="relative flex h-48 items-center justify-center overflow-hidden border-b border-[var(--rule)] bg-[var(--frame)] p-4">
        <div className="relative h-36 w-full overflow-hidden rounded-xl shadow-[0_18px_38px_-16px_rgba(15,23,42,0.48)] ring-2 ring-[#5eead4]">
          <img
            src={backdropSrc}
            alt={isZh ? '置顶贴图窗口预览' : 'Pinned capture window'}
            loading="lazy"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-x-3 bottom-2.5 rounded-lg bg-slate-950/82 px-2.5 py-1.5 font-[family-name:var(--mono)] text-[0.6875rem] text-slate-100 backdrop-blur-xs">
            <div className="flex items-center justify-between text-[0.625rem] text-teal-300">
              <span className="inline-flex items-center gap-1">
                <PushPin size={11} weight="fill" />
                <span>Pin · Topmost</span>
              </span>
              <span>Ctrl+C</span>
            </div>
            <p className="mt-0.5">
              <span className="rounded-xs bg-teal-400/35 px-1 text-white">
                ext-image-copy-capture
              </span>{' '}
              240Hz
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 4. 本地 PP-OCRv5 与原位翻译：左侧识别表格导出，右侧多引擎译文贴回
  if (kind === 'ocr') {
    return (
      <div className="relative h-48 overflow-hidden border-b border-[var(--rule)] bg-[var(--frame)] p-4">
        <div className="grid h-full grid-cols-1 gap-2.5 sm:grid-cols-2">
          <div className="flex flex-col justify-between rounded-xl border border-[var(--rule)] bg-[var(--card)] p-3 font-[family-name:var(--mono)] text-[0.6875rem]">
            <div className="flex items-center justify-between text-[var(--quiet)]">
              <span>PP-OCRv5 · ONNX</span>
              <span className="text-[var(--accent)]">TSV / MD</span>
            </div>
            <div className="space-y-1 text-[var(--ink)]">
              <div className="flex justify-between border-b border-[var(--rule)] pb-1">
                <span>Backend</span>
                <span>RSS</span>
              </div>
              <div className="flex justify-between text-[var(--soft)]">
                <span>Rust SHM</span>
                <span>21.6 MiB</span>
              </div>
              <div className="flex justify-between text-[var(--soft)]">
                <span>Qt 6 Old</span>
                <span>58.0 MiB</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-xl border border-[var(--rule)] bg-[var(--card)] p-3 font-[family-name:var(--sans)] text-[0.75rem]">
            <div className="flex items-center justify-between text-[0.6875rem] text-[var(--quiet)]">
              <span className="inline-flex items-center gap-1 text-[var(--accent)]">
                <Translate size={13} />
                <span>Index / OpenAI / Claude</span>
              </span>
              <span> Overlay</span>
            </div>
            <div className="space-y-1.5">
              <p className="font-[family-name:var(--mono)] text-[0.6875rem] text-[var(--quiet)] line-through">
                Zero external screenshot helpers
              </p>
              <p className="rounded-md bg-[var(--accent-soft)] px-2 py-1 text-[0.75rem] text-[var(--ink)]">
                {isZh
                  ? '零外部截图辅助命令，原位覆盖渲染译文'
                  : 'In-place translated text rendered over source region'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 5. 滚动长截图拼接：展示连续帧 18x24 亮度签名去重与分块拼接
  if (kind === 'scroll') {
    return (
      <div className="relative h-48 overflow-hidden border-b border-[var(--rule)] bg-[var(--frame)] p-4">
        <div className="flex h-full items-center justify-between gap-3 rounded-xl border border-[var(--rule)] bg-[var(--card)] px-4 py-3 font-[family-name:var(--mono)] text-[0.6875rem]">
          <div className="flex flex-col gap-1.5">
            <span className="rounded-md bg-[var(--frame)] px-2 py-1 text-[var(--soft)]">
              Frame #01 · 3200x1800
            </span>
            <span className="rounded-md border border-dashed border-[var(--rule)] px-2 py-1 text-[var(--quiet)]">
              Frame #02 · dup skipped
            </span>
            <span className="rounded-md bg-[var(--accent-soft)] px-2 py-1 text-[var(--accent)]">
              Stitched · 3200x14088
            </span>
          </div>
          <div className="flex h-full w-24 flex-col justify-between rounded-lg border border-[var(--accent)] bg-[var(--paper)] p-2 text-[0.625rem] text-[var(--soft)]">
            <span>18x24 luma</span>
            <span className="h-px w-full bg-[var(--accent)]" />
            <span>64 KiB stream</span>
          </div>
        </div>
      </div>
    );
  }

  // 6. 硬件编码录屏与无界面 CLI：深色原生终端输出与浮动录屏计时器
  return (
    <div className="relative h-48 overflow-hidden border-b border-[var(--rule)] bg-[#101518] p-4 font-[family-name:var(--mono)] text-[0.6875rem] text-slate-200">
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/6 px-3 py-1 text-[0.6875rem]">
        <Record size={13} weight="fill" className="text-rose-400" />
        <span className="tabular-nums">00:18.4</span>
        <span className="text-slate-400">MP4 · VAAPI / NVENC</span>
      </div>
      <div className="space-y-1 leading-[1.6] text-slate-300">
        <p className="text-teal-300">
          $ mark-shot --capture-to /tmp/ci.png --region 0,0,1280,720
        </p>
        <p className="truncate text-slate-400">
          {`{"path":"/tmp/ci.png","width":1280,"height":720,"error":null}`}
        </p>
      </div>
    </div>
  );
}
