import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react';
import { emitToast } from '@/hooks/use-toast';
import type { SiteCopy } from '@/types/locale';
import { STAGE_H, STAGE_W } from '@/features/home/stage/stage-types';
import { StartupOverlay } from '@/features/home/stage/StartupOverlay';
import { SelectionChrome } from '@/features/home/stage/SelectionChrome';
import { MainFloatingToolbar } from '@/features/home/stage/MainFloatingToolbar';
import { ActionFloatingToolbar } from '@/features/home/stage/ActionFloatingToolbar';
import { PropertySubBar } from '@/features/home/stage/PropertySubBar';
import { StageFloatingWindows } from '@/features/home/stage/StageFloatingWindows';
import { CanvasAnnotationsLayer } from '@/features/home/stage/CanvasAnnotationsLayer';
import { useStageDrawing } from '@/features/home/stage/use-stage-drawing';

interface CaptureStageProps {
  labels: SiteCopy['stage'];
  backdropSrc: string;
  isZh: boolean;
}

/**
 * 【首屏舞台】【真实原生模拟器】按 niri-use 实测软件布局 1:1 构建可交互的 Mark Shot 截图、标注、双栏与属性弹层舞台
 * @param props 舞台提示文案、冻结桌面壁纸及语言标识
 * @returns 等比自适应缩放的原生交互舞台组件
 */
export function CaptureStage({ labels, backdropSrc, isZh }: CaptureStageProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [scale, setScale] = useState(1);

  const cursorX = useMotionValue(640);
  const cursorY = useMotionValue(280);
  const coordPillText = useTransform([cursorX, cursorY], ([cx, cy]) => {
    const rx = Math.round(Number(cx));
    const ry = Math.round(Number(cy));
    const inCode = rx >= 86 && rx <= 634 && ry >= 78 && ry <= 330;
    const hex = inCode ? '#14181D' : ry < 320 ? '#CBD5E1' : '#1E3A3A';
    return `x ${rx}  y ${ry}  ${hex}`;
  });

  /**
   * 【坐标换算】【逻辑空间】将浏览器指针事件转换为 1160x660 舞台内部逻辑像素
   * @param clientX 视口 X
   * @param clientY 视口 Y
   * @returns 舞台逻辑像素坐标
   */
  const toStagePoint = (clientX: number, clientY: number) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) {
      return { x: 0, y: 0 };
    }
    return {
      x: Math.max(0, Math.min(STAGE_W, ((clientX - rect.left) / rect.width) * STAGE_W)),
      y: Math.max(0, Math.min(STAGE_H, ((clientY - rect.top) / rect.height) * STAGE_H)),
    };
  };

  const state = useStageDrawing({
    isZh,
    labels,
    toStagePoint,
    onCursorMove: (x, y) => {
      cursorX.set(x);
      cursorY.set(y);
    },
  });

  useEffect(() => {
    const host = outerRef.current;
    if (!host) {
      return;
    }
    // 1. 监听外层宽度并更新 1160px 逻辑舞台的等比缩放比例
    const syncScale = () => {
      setScale(Math.min(1, Math.max(0.3, host.clientWidth / STAGE_W)));
    };
    syncScale();
    const ro = new ResizeObserver(syncScale);
    ro.observe(host);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    // 1. 初始化并监听页面 data-theme 变更，联动同步原生浮动工具栏明暗色板
    const syncTheme = () => {
      state.setUiDark(document.documentElement.dataset.theme === 'night');
    };
    syncTheme();
    const mo = new MutationObserver(syncTheme);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => mo.disconnect();
  }, []);

  const mainToolbarLeft = Math.max(
    24,
    Math.min(
      STAGE_W - 690,
      state.selectionBox.x + state.selectionBox.w / 2 - 330
    )
  );
  const mainToolbarTop = state.selectionBox.y + state.selectionBox.h + 10;
  const subBarTop = mainToolbarTop + 44;
  const actionToolbarLeft = Math.min(
    STAGE_W - 44,
    state.selectionBox.x + state.selectionBox.w + 8
  );

  return (
    <motion.div
      ref={outerRef}
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto w-full max-w-[1160px]"
    >
      {/* 顶部微状态快捷切换条 */}
      <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2 px-1 font-[family-name:var(--sans)] text-[0.75rem] text-[var(--quiet)]">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => state.setStartupMode(false)}
            className={`cursor-pointer rounded-full px-2.5 py-0.5 transition-colors ${
              !state.startupMode
                ? 'bg-[var(--ink)] text-[var(--paper)]'
                : 'border border-[var(--rule)] bg-[var(--card)] text-[var(--soft)]'
            }`}
          >
            {isZh ? '标注编辑态' : 'Annotate Mode'}
          </button>
          <button
            type="button"
            onClick={() => state.setStartupMode(true)}
            className={`cursor-pointer rounded-full px-2.5 py-0.5 transition-colors ${
              state.startupMode
                ? 'bg-[var(--ink)] text-[var(--paper)]'
                : 'border border-[var(--rule)] bg-[var(--card)] text-[var(--soft)]'
            }`}
          >
            {isZh ? '框选启动态' : 'Startup Bar'}
          </button>
          <button
            type="button"
            onClick={() => state.setUiDark((v) => !v)}
            className="cursor-pointer rounded-full border border-[var(--rule)] bg-[var(--card)] px-2.5 py-0.5 text-[var(--soft)] transition-colors hover:text-[var(--ink)]"
          >
            {state.uiDark
              ? isZh
                ? '工具栏：深色'
                : 'Toolbar: Dark'
              : isZh
                ? '工具栏：浅色'
                : 'Toolbar: Light'}
          </button>
          <button
            type="button"
            onClick={state.resetAll}
            className="cursor-pointer rounded-full border border-[var(--rule)] bg-[var(--card)] px-2.5 py-0.5 text-[var(--soft)] transition-colors hover:text-[var(--ink)]"
          >
            {labels.resetCanvasLabel}
          </button>
        </div>

        <span>
          {isZh
            ? '可直接在画布拖拽绘制标注，或点选“选择标注 (V)”查看外扩橙色控制框'
            : 'Drag on canvas to draw live marks, or select Pick (V) to inspect handles'}
        </span>
      </div>

      {/* 按 scale 等比缩放的 1160x660 原生逻辑舞台容器 */}
      <div
        style={{ height: Math.round(STAGE_H * scale) }}
        className={`relative w-full overflow-hidden rounded-[14px] border border-[var(--rule)] shadow-[0_32px_72px_-32px_rgba(15,23,42,0.42)] ${
          state.showExportFrame ? 'ring-4 ring-[#0d9488]/35' : ''
        }`}
      >
        <div
          ref={stageRef}
          onPointerDown={state.handlePointerDown}
          onPointerMove={state.handlePointerMove}
          onPointerUp={state.handlePointerUp}
          style={{
            width: STAGE_W,
            height: STAGE_H,
            transform: `scale(${scale})`,
            transformOrigin: '0 0',
          }}
          className={`relative overflow-hidden select-none ${
            state.activeTool === 'pick' ? 'cursor-default' : 'cursor-crosshair'
          }`}
        >
          <img
            src={backdropSrc}
            alt="Mark Shot native Wayland frozen desktop"
            width={STAGE_W}
            height={STAGE_H}
            fetchPriority="high"
            draggable={false}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          />

          <StageFloatingWindows
            showOcr={state.showOcr}
            showTranslate={state.showTranslate}
            showPin={state.showPin}
            uiDark={state.uiDark}
            isZh={isZh}
            onCopyOcr={() => emitToast(labels.ocrCopiedMsg)}
            onCloseOverlay={(which) => {
              if (which === 'ocr') state.setShowOcr(false);
              if (which === 'translate') state.setShowTranslate(false);
              if (which === 'pin') state.setShowPin(false);
            }}
          />

          {state.startupMode ? (
            <StartupOverlay
              uiDark={state.uiDark}
              isZh={isZh}
              onStartMode={(mode) => {
                state.setStartupMode(false);
                if (mode === 'screen') {
                  state.setSelectionBox({ x: 24, y: 42, w: 1076, h: 408 });
                } else if (mode === 'video' || mode === 'gif') {
                  state.setActiveTool('recording');
                  state.setToolStyle((prev) => ({
                    ...prev,
                    recordFormat: mode === 'gif' ? 'GIF' : 'MP4',
                  }));
                }
              }}
            />
          ) : (
            <>
              <CanvasAnnotationsLayer
                annotations={state.currentAnnotations}
                draftAnnotation={state.draft}
                selectedId={state.selectedId}
                activePickMode={state.activeTool === 'pick'}
                backdropSrc={backdropSrc}
                isZh={isZh}
                onSelectAnnotation={(id) => state.setSelectedId(id)}
                onDeleteAnnotation={(id) => {
                  state.commitAnnotations(
                    state.currentAnnotations.filter((item) => item.id !== id)
                  );
                  state.setSelectedId(null);
                }}
              />

              <SelectionChrome
                box={state.selectionBox}
                uiDark={state.uiDark}
                isZh={isZh}
                aspectPreset={state.aspectPreset}
                aspectLocked={state.aspectLocked}
                onToggleLock={() => state.setAspectLocked((v) => !v)}
                onSelectPreset={state.handleSelectAspect}
              />

              <MainFloatingToolbar
                left={mainToolbarLeft}
                top={mainToolbarTop}
                uiDark={state.uiDark}
                isZh={isZh}
                activeTool={state.activeTool}
                canClear={state.currentAnnotations.length > 0}
                canUndo={state.historyIdx > 0}
                canRedo={state.historyIdx < state.history.length - 1}
                onSelectTool={(tool) => {
                  state.setActiveTool(tool);
                  if (
                    tool === 'pick' &&
                    state.currentAnnotations.length > 0 &&
                    !state.selectedId
                  ) {
                    state.setSelectedId(state.currentAnnotations[0]?.id ?? null);
                  }
                }}
                onClear={() => {
                  state.commitAnnotations([]);
                  state.setSelectedId(null);
                }}
                onUndo={() => {
                  if (state.historyIdx > 0) state.setHistoryIdx((i) => i - 1);
                }}
                onRedo={() => {
                  if (state.historyIdx < state.history.length - 1) {
                    state.setHistoryIdx((i) => i + 1);
                  }
                }}
              />

              <PropertySubBar
                left={mainToolbarLeft}
                top={subBarTop}
                uiDark={state.uiDark}
                isZh={isZh}
                activeTool={state.activeTool}
                style={state.toolStyle}
                onChange={(patch) => {
                  state.setToolStyle((prev) => ({ ...prev, ...patch }));
                  if (state.selectedId && patch.color) {
                    state.commitAnnotations(
                      state.currentAnnotations.map((item) =>
                        item.id === state.selectedId && 'color' in item
                          ? { ...item, color: patch.color! }
                          : item
                      )
                    );
                  }
                }}
                onResetNumberSeq={() => {
                  state.setNextSeq(1);
                  emitToast(
                    isZh ? '已重置序号计数为 1' : 'Reset step counter to 1'
                  );
                }}
                onTriggerRecordDemo={() =>
                  emitToast(
                    isZh
                      ? `已启动 ${state.toolStyle.recordFormat} 硬件编码区域录制`
                      : `Started ${state.toolStyle.recordFormat} hardware-encoded recording`
                  )
                }
              />

              <ActionFloatingToolbar
                left={actionToolbarLeft}
                top={state.selectionBox.y}
                uiDark={state.uiDark}
                isZh={isZh}
                activeOverlays={{
                  pin: state.showPin,
                  ocr: state.showOcr,
                  translate: state.showTranslate,
                }}
                onAction={state.handleRightAction}
              />

              {(state.activeTool === 'ruler' ||
                state.activeTool === 'eyedropper' ||
                state.activeTool === 'selection') && (
                <motion.div
                  className={`pointer-events-none absolute right-4 bottom-3.5 z-30 rounded-[7px] border px-2.5 py-1 font-[family-name:var(--mono)] text-[11px] shadow-md ${
                    state.uiDark
                      ? 'border-white/14 bg-[#0f1117]/92 text-slate-100'
                      : 'border-slate-900/12 bg-white/95 text-slate-800'
                  }`}
                >
                  {coordPillText}
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
