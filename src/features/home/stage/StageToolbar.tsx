import {
  ArrowUpRight,
  ArrowsOutSimple,
  Copy,
  Cursor,
  DownloadSimple,
  FrameCorners,
  HighlighterCircle,
  MagnifyingGlassPlus,
  NumberCircleOne,
  PushPin,
  Ruler,
  Selection,
  SquaresFour,
  TextT,
  Translate,
  ArrowCounterClockwise,
} from '@phosphor-icons/react';
import type { SiteCopy } from '@/types/locale';

export type StageToolId =
  | 'select'
  | 'rectangle'
  | 'arrow'
  | 'number'
  | 'highlighter'
  | 'mosaic'
  | 'magnifier'
  | 'ruler';

interface StageToolbarProps {
  activeTool: StageToolId;
  showOcr: boolean;
  showTranslationPin: boolean;
  showExportFrame: boolean;
  labels: SiteCopy['stage'];
  onSelectTool: (tool: StageToolId) => void;
  onToggleOcr: () => void;
  onToggleTranslationPin: () => void;
  onToggleExportFrame: () => void;
  onResetMarks: () => void;
  onCopyCapture: () => void;
  onSaveCapture: () => void;
}

/**
 * 【画布演示】【原生工具栏】还原 Mark Shot 0.2.1 紧凑单行绘图与动作工具栏
 * @param props 当前激活工具、浮层开关状态及事件回调
 * @returns 工具栏组件节点
 */
export function StageToolbar({
  activeTool,
  showOcr,
  showTranslationPin,
  showExportFrame,
  labels,
  onSelectTool,
  onToggleOcr,
  onToggleTranslationPin,
  onToggleExportFrame,
  onResetMarks,
  onCopyCapture,
  onSaveCapture,
}: StageToolbarProps) {
  const drawTools: Array<{
    id: StageToolId;
    title: string;
    icon: typeof Cursor;
  }> = [
    { id: 'select', title: labels.tools.select, icon: Cursor },
    { id: 'rectangle', title: labels.tools.rectangle, icon: Selection },
    { id: 'arrow', title: labels.tools.arrow, icon: ArrowUpRight },
    { id: 'number', title: labels.tools.number, icon: NumberCircleOne },
    { id: 'highlighter', title: labels.tools.highlighter, icon: HighlighterCircle },
    { id: 'mosaic', title: labels.tools.mosaic, icon: SquaresFour },
    { id: 'magnifier', title: labels.tools.magnifier, icon: MagnifyingGlassPlus },
    { id: 'ruler', title: labels.tools.ruler, icon: Ruler },
  ];

  return (
    <div className="no-scrollbar flex items-center justify-between gap-2 overflow-x-auto border-b border-[var(--rule)] bg-[var(--card)] px-3 py-2 font-[family-name:var(--sans)]">
      <div className="flex shrink-0 items-center gap-1">
        <span
          aria-hidden="true"
          className="mr-1 hidden shrink-0 items-center gap-1 whitespace-nowrap font-[family-name:var(--mono)] text-[0.6875rem] text-[var(--quiet)] 2xl:inline-flex"
        >
          <ArrowsOutSimple size={13} />
          <span>1280x720</span>
        </span>

        {drawTools.map((tool) => {
          const IconComp = tool.icon;
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => onSelectTool(tool.id)}
              title={tool.title}
              aria-label={tool.title}
              aria-pressed={isActive}
              className={`inline-flex h-8 shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg px-2 text-[0.75rem] transition-colors active:scale-[0.98] ${
                isActive
                  ? 'bg-[var(--accent-soft)] font-medium text-[var(--accent)] ring-1 ring-[color-mix(in_srgb,var(--accent)_40%,transparent)]'
                  : 'text-[var(--soft)] hover:bg-[var(--frame)] hover:text-[var(--ink)]'
              }`}
            >
              <IconComp size={16} weight={isActive ? 'bold' : 'regular'} />
              <span className="hidden xl:inline">
                {tool.title.replace(/\s*\([^)]*\)/, '')}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <span className="mx-1 h-4 w-px bg-[var(--rule)]" aria-hidden="true" />

        <button
          type="button"
          onClick={onToggleOcr}
          title={labels.tools.ocr}
          aria-pressed={showOcr}
          className={`inline-flex h-8 cursor-pointer items-center gap-1 rounded-lg px-2 text-[0.75rem] transition-colors active:scale-[0.98] ${
            showOcr
              ? 'bg-[var(--accent-soft)] font-medium text-[var(--accent)]'
              : 'text-[var(--soft)] hover:bg-[var(--frame)] hover:text-[var(--ink)]'
          }`}
        >
          <TextT size={15} weight="bold" />
          <span className="hidden sm:inline">OCR</span>
        </button>

        <button
          type="button"
          onClick={onToggleTranslationPin}
          title={labels.tools.translate}
          aria-pressed={showTranslationPin}
          className={`inline-flex h-8 cursor-pointer items-center gap-1 rounded-lg px-2 text-[0.75rem] transition-colors active:scale-[0.98] ${
            showTranslationPin
              ? 'bg-[var(--accent-soft)] font-medium text-[var(--accent)]'
              : 'text-[var(--soft)] hover:bg-[var(--frame)] hover:text-[var(--ink)]'
          }`}
        >
          <Translate size={15} />
          <PushPin size={13} className="hidden md:inline" />
        </button>

        <button
          type="button"
          onClick={onToggleExportFrame}
          title={labels.tools.frame}
          aria-pressed={showExportFrame}
          className={`inline-flex h-8 cursor-pointer items-center gap-1 rounded-lg px-2 text-[0.75rem] transition-colors active:scale-[0.98] ${
            showExportFrame
              ? 'bg-[var(--accent-soft)] font-medium text-[var(--accent)]'
              : 'text-[var(--soft)] hover:bg-[var(--frame)] hover:text-[var(--ink)]'
          }`}
        >
          <FrameCorners size={15} />
          <span className="hidden md:inline">{labels.exportFrameLabel}</span>
        </button>

        <button
          type="button"
          onClick={onResetMarks}
          title={labels.resetCanvasLabel}
          aria-label={labels.resetCanvasLabel}
          className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg text-[var(--soft)] transition-colors hover:bg-[var(--frame)] hover:text-[var(--ink)] active:scale-[0.98]"
        >
          <ArrowCounterClockwise size={15} />
        </button>

        <span className="mx-1 h-4 w-px bg-[var(--rule)]" aria-hidden="true" />

        <button
          type="button"
          onClick={onCopyCapture}
          title="Ctrl+C"
          aria-label="Copy PNG"
          className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg border border-[var(--rule)] bg-[var(--paper)] text-[var(--ink)] transition-colors hover:bg-[var(--frame)] active:scale-[0.98]"
        >
          <Copy size={15} />
        </button>

        <button
          type="button"
          onClick={onSaveCapture}
          title="Ctrl+S"
          aria-label="Save PNG"
          className="inline-flex h-8 cursor-pointer items-center gap-1 rounded-lg bg-[var(--accent)] px-2.5 text-[0.75rem] font-medium text-[var(--accent-ink)] transition-opacity hover:opacity-90 active:scale-[0.98]"
        >
          <DownloadSimple size={15} weight="bold" />
          <span className="hidden sm:inline">PNG</span>
        </button>
      </div>
    </div>
  );
}
