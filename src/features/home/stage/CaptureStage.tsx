import { useRef, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react';
import { emitToast } from '@/hooks/use-toast';
import type { SiteCopy } from '@/types/locale';
import {
  StageToolbar,
  type StageToolId,
} from '@/features/home/stage/StageToolbar';
import {
  StageAnnotations,
  type StepMarkerPoint,
} from '@/features/home/stage/StageAnnotations';

interface CaptureStageProps {
  labels: SiteCopy['stage'];
  backdropSrc: string;
  isZh: boolean;
}

const INITIAL_MARKERS: StepMarkerPoint[] = [
  { id: 1, xPercent: 51, yPercent: 22 },
  { id: 2, xPercent: 64, yPercent: 48 },
];

/**
 * 【首屏舞台】【原生微缩预览】提供可真实交互的 Mark Shot 截图、标注、像素标尺与导出外框舞台
 * @param props 舞台文案、实景底图路径与语言标识
 * @returns 交互式客户端岛屿组件
 */
export function CaptureStage({ labels, backdropSrc, isZh }: CaptureStageProps) {
  const [activeTool, setActiveTool] = useState<StageToolId>('arrow');
  const [showOcr, setShowOcr] = useState(true);
  const [showTranslationPin, setShowTranslationPin] = useState(false);
  const [showExportFrame, setShowExportFrame] = useState(false);
  const [stepMarkers, setStepMarkers] = useState<StepMarkerPoint[]>(INITIAL_MARKERS);

  const canvasRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // 使用 MotionValue 追踪连续指针像素坐标，避免触发 React 组件树重渲染
  const pointerX = useMotionValue(640);
  const pointerY = useMotionValue(260);
  const rulerReadout = useTransform([pointerX, pointerY], ([x, y]) => {
    const rx = Math.round(Number(x));
    const ry = Math.round(Number(y));
    const diag = Math.round(Math.hypot(rx, ry));
    return `${rx} x ${ry} px · d=${diag}`;
  });

  /**
   * 【标尺测量】【指针同步】更新画布内的逻辑像素坐标读数
   * @param event React 指针移动事件
   * @returns 无返回值
   */
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!canvasRef.current) {
      return;
    }
    // 1. 计算相对画布左上角的归一化比例并映射为 1280x720 逻辑像素
    const rect = canvasRef.current.getBoundingClientRect();
    const relX = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    const relY = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
    pointerX.set(relX * 1280);
    pointerY.set(relY * 720);
  };

  /**
   * 【画布交互】【点击放置】在序号工具或选择模式下响应画布点击动作
   * @param event React 鼠标点击事件
   * @returns 无返回值
   */
  const handleCanvasClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) {
      return;
    }
    // 1. 若当前并非序号工具，点击画布时自动切换至序号工具并放置新步骤点
    const rect = canvasRef.current.getBoundingClientRect();
    const xPercent = Math.round(((event.clientX - rect.left) / rect.width) * 100);
    const yPercent = Math.round(((event.clientY - rect.top) / rect.height) * 100);

    if (activeTool === 'number' && stepMarkers.length < 9) {
      setStepMarkers((prev) => [
        ...prev,
        { id: prev.length + 1, xPercent, yPercent },
      ]);
    }
  };

  /**
   * 【画布交互】【复位状态】恢复初始标注序号与默认预览层
   * @returns 无返回值
   */
  const handleReset = () => {
    setStepMarkers(INITIAL_MARKERS);
    setShowOcr(true);
    setShowTranslationPin(false);
    setShowExportFrame(false);
    setActiveTool('arrow');
  };

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto w-full max-w-[1120px]"
    >
      <div className="overflow-hidden rounded-2xl border border-[var(--rule)] bg-[var(--card)] shadow-[0_28px_70px_-32px_rgba(15,23,42,0.32)]">
        <StageToolbar
          activeTool={activeTool}
          showOcr={showOcr}
          showTranslationPin={showTranslationPin}
          showExportFrame={showExportFrame}
          labels={labels}
          onSelectTool={setActiveTool}
          onToggleOcr={() => setShowOcr((v) => !v)}
          onToggleTranslationPin={() => setShowTranslationPin((v) => !v)}
          onToggleExportFrame={() => setShowExportFrame((v) => !v)}
          onResetMarks={handleReset}
          onCopyCapture={() => emitToast(labels.copiedImageMsg)}
          onSaveCapture={() => emitToast(labels.savedImageMsg)}
        />

        {/* 外框透明棋盘格留白区：开启导出外框时平滑显现 */}
        <div
          className={`transition-all duration-300 ${
            showExportFrame
              ? 'bg-[radial-gradient(color-mix(in_srgb,var(--ink)_12%,transparent)_1px,transparent_1px)] [background-size:14px_14px] p-5 sm:p-8'
              : 'p-0'
          }`}
        >
          <div
            ref={canvasRef}
            onPointerMove={handlePointerMove}
            onClick={handleCanvasClick}
            className={`relative aspect-[16/9] min-h-[17.5rem] w-full overflow-hidden select-none ${
              activeTool === 'number' || activeTool === 'ruler'
                ? 'cursor-crosshair'
                : 'cursor-default'
            } ${
              showExportFrame
                ? 'rounded-[18px] shadow-[0_24px_56px_-18px_rgba(15,23,42,0.55)] ring-1 ring-white/20'
                : ''
            } transition-all duration-300`}
          >
            <img
              src={backdropSrc}
              alt="Mark Shot frozen Wayland desktop canvas"
              width={1536}
              height={1024}
              fetchPriority="high"
              className="h-full w-full object-cover"
            />

            <StageAnnotations
              activeTool={activeTool}
              stepMarkers={stepMarkers}
              showOcr={showOcr}
              showTranslationPin={showTranslationPin}
              backdropSrc={backdropSrc}
              labels={labels}
              isZh={isZh}
              onCopyOcrTable={() => emitToast(labels.ocrCopiedMsg)}
            />

            {/* 标尺模式实时坐标胶囊 */}
            {activeTool === 'ruler' ? (
              <motion.div className="pointer-events-none absolute top-3 right-3 rounded-md bg-slate-950/82 px-2.5 py-1 font-[family-name:var(--mono)] text-[0.6875rem] text-teal-300 ring-1 ring-teal-400/35">
                {rulerReadout}
              </motion.div>
            ) : null}
          </div>
        </div>

        {/* 底部状态条：展示当前激活工具与快捷操作提示 */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--rule)] bg-[var(--paper)] px-3.5 py-2 font-[family-name:var(--mono)] text-[0.72rem] text-[var(--quiet)]">
          <span>{labels.windowTitle}</span>
          <span className="font-[family-name:var(--sans)]">{labels.selectionHint}</span>
        </div>
      </div>
    </motion.div>
  );
}
