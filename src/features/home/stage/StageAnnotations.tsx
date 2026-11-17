import { Copy, PushPin } from '@phosphor-icons/react';
import type { StageToolId } from '@/features/home/stage/StageToolbar';
import type { SiteCopy } from '@/types/locale';

export interface StepMarkerPoint {
  id: number;
  xPercent: number;
  yPercent: number;
}

interface StageAnnotationsProps {
  activeTool: StageToolId;
  stepMarkers: StepMarkerPoint[];
  showOcr: boolean;
  showTranslationPin: boolean;
  backdropSrc: string;
  labels: SiteCopy['stage'];
  isZh: boolean;
  onCopyOcrTable: () => void;
}

/**
 * 【画布演示】【标注合成层】渲染矢量箭头、矩形选框、步进序号、双框放大镜与 OCR/贴图浮窗
 * @param props 当前工具状态、用户新增序号坐标及多语言文案
 * @returns 叠加在捕获底图上的矢量与浮层节点
 */
export function StageAnnotations({
  activeTool,
  stepMarkers,
  showOcr,
  showTranslationPin,
  backdropSrc,
  labels,
  isZh,
  onCopyOcrTable,
}: StageAnnotationsProps) {
  const isMagnifierFocus = activeTool === 'magnifier';
  const isMosaicFocus = activeTool === 'mosaic';

  return (
    <>
      {/* 模拟冻结桌面中的原生终端与指标卡片（作为被截图与识别的真实目标内容） */}
      <div className="pointer-events-none absolute top-3 left-3 sm:top-5 sm:left-5 w-[min(21rem,68%)] rounded-xl border border-white/15 bg-[#0f1418]/88 p-2.5 sm:p-3.5 font-[family-name:var(--mono)] text-[0.65rem] sm:text-[0.72rem] leading-[1.5] text-slate-200 shadow-xl backdrop-blur-md">
        <div className="mb-1.5 flex items-center justify-between gap-2 border-b border-white/10 pb-1 text-[0.62rem] sm:text-[0.68rem] text-slate-400">
          <span className="truncate">niri · wayland-1</span>
          <span className="hidden sm:inline">ext-image-copy-capture</span>
        </div>
        <p className="truncate text-teal-300">$ mark-shot --capture-to /tmp/shot.png</p>
        <p className="mt-1 hidden truncate text-slate-300 sm:block">
          {`{"width":2560,"height":1600,"output":"DP-1"}`}
        </p>
        <div className="mt-2 grid grid-cols-2 gap-2 border-t border-white/10 pt-1.5 text-[0.64rem] sm:text-[0.68rem]">
          <div>
            <span className="text-slate-400">Wake: </span>
            <span className="text-emerald-300">31.6 ms</span>
          </div>
          <div>
            <span className="text-slate-400">Idle RSS: </span>
            <span className="text-emerald-300">21.6 MiB</span>
          </div>
        </div>

        {/* 荧光笔半透明高亮层 */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute bottom-2.5 left-3 h-4 w-32 rounded-xs bg-amber-300/35 mix-blend-screen transition-transform duration-200 ${
            activeTool === 'highlighter' ? 'scale-105 ring-1 ring-amber-300/80' : ''
          }`}
        />

        {/* 局部像素化/模糊滤镜预览区 */}
        {isMosaicFocus ? (
          <div className="absolute inset-x-3 top-9 h-7 rounded-md border border-teal-300/70 bg-slate-900/55 backdrop-blur-md">
            <span className="px-2 text-[0.65rem] text-teal-200">
              {isZh ? '像素化滤镜 · 半径 16px' : 'Pixelate Filter · 16px'}
            </span>
          </div>
        ) : null}
      </div>

      {/* 矢量标注 SVG 覆盖层：外扩控制框矩形 + 内凹实心直箭头 */}
      <svg
        viewBox="0 0 800 450"
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <filter id="markShadow" x="-10%" y="-10%" width="125%" height="125%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.28" />
          </filter>
        </defs>

        {/* 圆角矩形标注与外扩虚线选中控制框 */}
        <g filter="url(#markShadow)">
          <rect
            x="34"
            y="22"
            width="368"
            height="156"
            rx="10"
            fill="none"
            stroke="#2dd4bf"
            strokeWidth={activeTool === 'rectangle' ? '3' : '2.2'}
          />
          {activeTool === 'select' || activeTool === 'rectangle' ? (
            <rect
              x="28"
              y="16"
              width="380"
              height="168"
              rx="12"
              fill="none"
              stroke="#ffffff"
              strokeOpacity="0.75"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          ) : null}
        </g>

        {/* Mark Shot 0.2.1 标志性内凹实心直箭头 */}
        <g
          filter="url(#markShadow)"
          opacity={activeTool === 'arrow' ? 1 : 0.92}
        >
          <path
            d="M 468 128 Q 436 106 410 98"
            fill="none"
            stroke="#f97316"
            strokeWidth={activeTool === 'arrow' ? '4' : '3.2'}
            strokeLinecap="round"
          />
          <polygon
            points="402,95 421,93 415,100 418,109"
            fill="#f97316"
          />
        </g>

        {/* 双框联动放大镜连接虚线 */}
        <line
          x1="548"
          y1="232"
          x2="626"
          y2="196"
          stroke="#ffffff"
          strokeOpacity={isMagnifierFocus ? '0.9' : '0.55'}
          strokeWidth="1.4"
          strokeDasharray="3 3"
        />
      </svg>

      {/* 双框独立调节放大镜：源取景框 + 2.5x 局部放大镜框 */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute top-[48%] left-[64%] h-11 w-14 -translate-x-1/2 -translate-y-1/2 rounded-md border transition-transform ${
          isMagnifierFocus
            ? 'scale-105 border-teal-300 shadow-[0_0_0_2px_rgba(45,212,191,0.35)]'
            : 'border-white/80'
        }`}
      />
      <div
        aria-hidden="true"
        style={{
          backgroundImage: `url(${backdropSrc})`,
          backgroundSize: '360%',
          backgroundPosition: '66% 47%',
        }}
        className={`pointer-events-none absolute top-[36%] right-[8%] hidden h-28 w-28 overflow-hidden rounded-full border-2 shadow-2xl sm:block ${
          isMagnifierFocus
            ? 'scale-105 border-teal-300 ring-4 ring-teal-400/25'
            : 'border-white/90'
        } transition-transform duration-200`}
      >
        <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 rounded-full bg-slate-950/75 px-2 py-0.5 font-[family-name:var(--mono)] text-[0.625rem] text-teal-200">
          2.5x
        </span>
      </div>

      {/* 自增步进序号标记（包含初始标记与用户点击画布新增的标记） */}
      {stepMarkers.map((marker) => (
        <span
          key={marker.id}
          style={{ left: `${marker.xPercent}%`, top: `${marker.yPercent}%` }}
          className="pointer-events-none absolute grid h-6 w-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#f97316] font-[family-name:var(--sans)] text-[0.75rem] font-semibold text-white shadow-md ring-2 ring-white/90"
        >
          {marker.id}
        </span>
      ))}

      {/* PP-OCRv5 本地识别与表格导出预览面板 */}
      {showOcr ? (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-3 bottom-3 sm:right-4 sm:bottom-4 z-20 w-[min(19.5rem,90%)] rounded-xl border border-[var(--rule)] bg-[var(--card)]/96 p-2.5 sm:p-3 font-[family-name:var(--sans)] text-[0.75rem] text-[var(--ink)] shadow-2xl backdrop-blur-md"
        >
          <div className="flex items-center justify-between gap-2 border-b border-[var(--rule)] pb-2">
            <span className="truncate font-medium">{labels.ocrPanelTitle}</span>
            <button
              type="button"
              onClick={onCopyOcrTable}
              className="inline-flex shrink-0 cursor-pointer items-center gap-1 whitespace-nowrap rounded-md bg-[var(--accent-soft)] px-2 py-1 text-[0.6875rem] font-medium text-[var(--accent)] transition-opacity hover:opacity-85 active:scale-[0.98]"
            >
              <Copy size={12} />
              <span>{labels.ocrCopyTsv}</span>
            </button>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-y-1 font-[family-name:var(--mono)] text-[0.6875rem] text-[var(--soft)]">
            <span>Wake Median</span>
            <span className="text-right text-[var(--ink)]">31.6 ms</span>
            <span>Idle Memory</span>
            <span className="text-right text-[var(--ink)]">21.6 MiB</span>
            <span>Output</span>
            <span className="text-right text-[var(--ink)]">2560 x 1600</span>
          </div>
        </div>
      ) : null}

      {/* 置顶贴图与原位译文覆盖浮窗 */}
      {showTranslationPin ? (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-4 left-5 z-20 max-w-[17.5rem] rounded-xl border border-teal-400/45 bg-[#101619]/92 px-3.5 py-2.5 font-[family-name:var(--sans)] text-[0.75rem] text-slate-100 shadow-2xl backdrop-blur-md"
        >
          <div className="mb-1 flex items-center gap-1.5 text-[0.6875rem] text-teal-300">
            <PushPin size={12} weight="fill" />
            <span>{labels.pinTranslatedBadge}</span>
          </div>
          <p className="leading-[1.5] text-slate-200">
            {isZh
              ? '已捕获主显示器 DP-1（2560x1600），可在文字区域直接划词复制。'
              : 'Captured primary output DP-1 (2560x1600); drag across text to copy.'}
          </p>
        </div>
      ) : null}
    </>
  );
}
