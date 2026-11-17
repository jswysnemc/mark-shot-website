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
  // 1. 矢量标注与双框放大镜：复刻外扩橙色选中框、带尾圆章序号与双圆外切线放大镜
  if (kind === 'tools') {
    return (
      <div className="relative h-48 overflow-hidden border-b border-[var(--rule)] bg-[var(--frame)] p-3.5">
        <div className="relative h-full w-full overflow-hidden rounded-xl border border-[var(--rule)] bg-[var(--card)] px-4 py-3">
          <svg
            viewBox="0 0 460 132"
            className="h-full w-full overflow-visible"
            aria-hidden="true"
          >
            {/* 红色描边矩形 + 外扩橙色虚线控制框 + 顶部旋转杆 + 右上红叉 */}
            <rect
              x="22"
              y="32"
              width="136"
              height="68"
              rx="3"
              fill="none"
              stroke="#FF4D4D"
              strokeWidth="2.5"
            />
            <rect
              x="15"
              y="25"
              width="150"
              height="82"
              fill="none"
              stroke="#F97316"
              strokeWidth="1.4"
              strokeDasharray="5 3"
            />
            <line x1="90" y1="25" x2="90" y2="11" stroke="#F97316" strokeWidth="1.4" />
            <circle cx="90" cy="9" r="3" fill="#F97316" />
            <circle cx="174" cy="18" r="7" fill="#EF4444" />
            <path d="M171.5 15.5l5 5M176.5 15.5l-5 5" stroke="#fff" strokeWidth="1.5" />

            {/* 红底白边带尾圆章序号 A */}
            <line x1="238" y1="84" x2="188" y2="62" stroke="#FF4D4D" strokeWidth="3.5" strokeLinecap="round" />
            <polygon points="180,58 195,58 190,63 192,70" fill="#FF4D4D" />
            <circle cx="248" cy="88" r="12" fill="#FF4D4D" stroke="#ffffff" strokeWidth="2" />
            <text x="248" y="92" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="700" fontFamily="var(--sans)">
              A
            </text>

            {/* 双圆外公切线放大镜（复刻 08-magnifier.png） */}
            <circle cx="312" cy="40" r="14" fill="none" stroke="#FF4D4D" strokeWidth="2.2" />
            <line x1="321" y1="29" x2="394" y2="30" stroke="#FF4D4D" strokeWidth="1.8" />
            <line x1="302" y1="50" x2="362" y2="105" stroke="#FF4D4D" strokeWidth="1.8" />
            <circle
              cx="396"
              cy="68"
              r="38"
              fill="color-mix(in srgb, var(--accent) 14%, var(--paper))"
              stroke="#FF4D4D"
              strokeWidth="2.4"
            />
            <text
              x="396"
              y="72"
              textAnchor="middle"
              fontSize="11"
              fontFamily="var(--mono)"
              fill="var(--ink)"
            >
              4.25x
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
