import { useRef, useState } from 'react';
import { emitToast } from '@/hooks/use-toast';
import type { SiteCopy } from '@/types/locale';
import type { ActionButtonId } from '@/features/home/stage/ActionFloatingToolbar';
import type { ToolStyleState } from '@/features/home/stage/PropertySubBar';
import {
  createInitialAnnotations,
  STAGE_H,
  STAGE_W,
  type AspectPreset,
  type CanvasAnnotation,
  type DrawToolId,
  type SelectionBox,
} from '@/features/home/stage/stage-types';

export const DEFAULT_BOX: SelectionBox = { x: 56, y: 44, w: 996, h: 400 };

/**
 * 【舞台状态机】【绘图与历史】管理标注撤销重做栈、指针拖拽实时草稿与右侧动作栏事件分发
 * @param params 语言标识、舞台多语言文案与坐标转换器
 * @returns 舞台所需的完整交互状态与处理器
 */
export function useStageDrawing({
  isZh,
  labels,
  toStagePoint,
  onCursorMove,
}: {
  isZh: boolean;
  labels: SiteCopy['stage'];
  toStagePoint: (clientX: number, clientY: number) => { x: number; y: number };
  onCursorMove: (x: number, y: number) => void;
}) {
  const [startupMode, setStartupMode] = useState(false);
  const [uiDark, setUiDark] = useState(false);
  const [selectionBox, setSelectionBox] = useState<SelectionBox>(DEFAULT_BOX);
  const [aspectPreset, setAspectPreset] = useState<AspectPreset>('Free');
  const [aspectLocked, setAspectLocked] = useState(false);

  const [activeTool, setActiveTool] = useState<DrawToolId>('rectangle');
  const [selectedId, setSelectedId] = useState<string | null>('init-rect');
  const [history, setHistory] = useState<CanvasAnnotation[][]>(() => [
    createInitialAnnotations(),
  ]);
  const [historyIdx, setHistoryIdx] = useState(0);
  const [nextSeq, setNextSeq] = useState(2);

  const [draft, setDraft] = useState<CanvasAnnotation | null>(null);
  const dragOriginRef = useRef<{ x: number; y: number } | null>(null);

  const [showOcr, setShowOcr] = useState(false);
  const [showTranslate, setShowTranslate] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [showExportFrame, setShowExportFrame] = useState(false);

  const [toolStyle, setToolStyle] = useState<ToolStyleState>({
    color: '#FF4D4D',
    strokeWidth: 4,
    filled: false,
    lockSquare: false,
    cornerRadius: 4,
    arrowHead: 'concave',
    dash: 'solid',
    numeralFormat: 'ABC',
    filterKind: 'pixelate',
    filterIntensity: 18,
    magnifierZoom: 3.25,
    magnifierSquare: false,
    fontSize: 24,
    textBg: true,
    recordFormat: 'MP4',
  });

  const currentAnnotations = history[historyIdx] ?? [];

  /**
   * 【历史记录】【压入新帧】提交更新后的标注列表并截断后续重做分支
   * @param nextList 新图元列表
   * @returns 无返回值
   */
  const commitAnnotations = (nextList: CanvasAnnotation[]) => {
    const sliced = history.slice(0, historyIdx + 1);
    sliced.push(nextList);
    setHistory(sliced);
    setHistoryIdx(sliced.length - 1);
  };

  /**
   * 【画布绘制】【按下起点】响应左键拖拽绘图、取色或文字放置
   * @param event React 指针按下事件
   * @returns 无返回值
   */
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    // 1. 过滤工具栏、属性弹层、删除按钮与已命中标注图元的事件，避免 setPointerCapture 劫持子控件 click
    const hitTarget = event.target as Element | null;
    if (
      startupMode ||
      event.button !== 0 ||
      hitTarget?.closest?.('button, a, input, [data-ui-chrome], [data-annotation-item]')
    ) {
      return;
    }
    const pt = toStagePoint(event.clientX, event.clientY);

    if (activeTool === 'pick') {
      setSelectedId(null);
      return;
    }

    if (activeTool === 'eyedropper') {
      const sampled =
        pt.x >= 86 && pt.x <= 634 && pt.y >= 78 && pt.y <= 330
          ? '#2DD4BF'
          : '#F97316';
      setToolStyle((prev) => ({ ...prev, color: sampled }));
      emitToast(isZh ? `已吸取颜色 ${sampled}` : `Sampled ${sampled}`);
      return;
    }

    if (activeTool === 'text') {
      commitAnnotations([
        ...currentAnnotations,
        {
          id: `txt-${Date.now()}`,
          kind: 'text',
          x: pt.x,
          y: pt.y,
          text: isZh ? '零 Qt / GTK 依赖' : 'Zero Qt / GTK runtime',
          color: toolStyle.color,
          fontSize: toolStyle.fontSize,
          hasBg: toolStyle.textBg,
        },
      ]);
      return;
    }

    if (activeTool === 'recording') {
      return;
    }

    dragOriginRef.current = pt;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);

    const id = `draw-${Date.now()}`;
    if (
      activeTool === 'pen' ||
      activeTool === 'highlighter' ||
      activeTool === 'laser'
    ) {
      setDraft({
        id,
        kind: activeTool === 'highlighter' ? 'highlighter' : 'pen',
        points: [pt],
        color: toolStyle.color,
        strokeWidth: toolStyle.strokeWidth,
      });
    } else if (activeTool === 'number') {
      setDraft({
        id,
        kind: 'number',
        x: pt.x,
        y: pt.y,
        seq: nextSeq,
        format: toolStyle.numeralFormat,
        color: toolStyle.color,
      });
    }
  };

  /**
   * 【画布绘制】【移动预览】刷新指针坐标读数与拖拽中的几何草稿
   * @param event React 指针移动事件
   * @returns 无返回值
   */
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const pt = toStagePoint(event.clientX, event.clientY);
    onCursorMove(pt.x, pt.y);

    const start = dragOriginRef.current;
    if (!start) {
      return;
    }

    if (activeTool === 'selection') {
      const x = Math.max(24, Math.min(start.x, pt.x));
      const y = Math.max(38, Math.min(start.y, pt.y));
      const w = Math.max(
        240,
        Math.min(STAGE_W - x - 56, Math.abs(pt.x - start.x))
      );
      const h = Math.max(
        160,
        Math.min(STAGE_H - y - 140, Math.abs(pt.y - start.y))
      );
      setSelectionBox({ x, y, w, h });
      return;
    }

    if (draft && (draft.kind === 'pen' || draft.kind === 'highlighter')) {
      setDraft({ ...draft, points: [...draft.points, pt] });
      return;
    }

    if (activeTool === 'number' && draft && draft.kind === 'number') {
      setDraft({ ...draft, tailX: pt.x, tailY: pt.y });
      return;
    }

    const x = Math.min(start.x, pt.x);
    const y = Math.min(start.y, pt.y);
    let w = Math.abs(pt.x - start.x);
    let h = Math.abs(pt.y - start.y);
    if (toolStyle.lockSquare) {
      const side = Math.max(w, h);
      w = side;
      h = side;
    }

    const id = draft?.id ?? `draw-${Date.now()}`;
    if (
      activeTool === 'rectangle' ||
      activeTool === 'circle' ||
      activeTool === 'marker'
    ) {
      setDraft({
        id,
        kind: activeTool === 'circle' ? 'ellipse' : 'rect',
        x,
        y,
        w,
        h,
        color: toolStyle.color,
        strokeWidth: toolStyle.strokeWidth,
        filled: toolStyle.filled,
        radius: activeTool === 'marker' ? 14 : toolStyle.cornerRadius,
      });
    } else if (activeTool === 'arrow' || activeTool === 'line') {
      setDraft({
        id,
        kind: activeTool,
        x1: start.x,
        y1: start.y,
        x2: pt.x,
        y2: pt.y,
        color: toolStyle.color,
        strokeWidth: toolStyle.strokeWidth,
        head: toolStyle.arrowHead,
        dash: toolStyle.dash,
      });
    } else if (activeTool === 'redact') {
      setDraft({
        id,
        kind: 'redact',
        x,
        y,
        w,
        h,
        filter: toolStyle.filterKind,
        intensity: toolStyle.filterIntensity,
        radius: toolStyle.cornerRadius,
      });
    } else if (activeTool === 'magnifier') {
      setDraft({
        id,
        kind: 'magnifier',
        srcX: start.x,
        srcY: start.y,
        lensX: pt.x,
        lensY: pt.y,
        lensRadius: 62,
        zoom: toolStyle.magnifierZoom,
        square: toolStyle.magnifierSquare,
        color: toolStyle.color,
        strokeWidth: toolStyle.strokeWidth,
      });
    } else if (activeTool === 'ruler') {
      setDraft({
        id,
        kind: 'ruler',
        x1: start.x,
        y1: start.y,
        x2: pt.x,
        y2: pt.y,
        color: toolStyle.color,
      });
    }
  };

  /**
   * 【画布绘制】【松开落笔】固化草稿图元（激光笔短暂显示后自动消散）
   * @returns 无返回值
   */
  const handlePointerUp = () => {
    dragOriginRef.current = null;
    if (!draft) {
      return;
    }
    const finished = draft;
    setDraft(null);

    if (
      (finished.kind === 'rect' ||
        finished.kind === 'ellipse' ||
        finished.kind === 'redact') &&
      finished.w < 8 &&
      finished.h < 8
    ) {
      return;
    }

    if (activeTool === 'laser') {
      const tempList = [...currentAnnotations, finished];
      setHistory((prev) => {
        const copy = [...prev];
        copy[historyIdx] = tempList;
        return copy;
      });
      window.setTimeout(() => {
        setHistory((prev) => {
          const copy = [...prev];
          copy[historyIdx] = (copy[historyIdx] ?? []).filter(
            (item) => item.id !== finished.id
          );
          return copy;
        });
      }, 1100);
      return;
    }

    if (finished.kind === 'number') {
      setNextSeq((n) => n + 1);
    }
    commitAnnotations([...currentAnnotations, finished]);
  };

  /**
   * 【比例预设】【调整选区】按左上角胶囊选择的固定比例调整选区矩形
   * @param preset 宽高比预设
   * @returns 无返回值
   */
  const handleSelectAspect = (preset: AspectPreset) => {
    setAspectPreset(preset);
    if (preset === 'Free') {
      setSelectionBox(DEFAULT_BOX);
      return;
    }
    const [rw, rh] = preset.split(':').map(Number);
    const ratio = rw / rh;
    const targetH = 420;
    const targetW = Math.min(996, Math.round(targetH * ratio));
    setSelectionBox({
      x: Math.round((STAGE_W - 60 - targetW) / 2),
      y: 48,
      w: targetW,
      h: targetH,
    });
  };

  /**
   * 【右侧动作栏】【动作分发】执行复制、保存、OCR、贴图、原位翻译或主题切换
   * @param action 右侧动作枚举
   * @returns 无返回值
   */
  const handleRightAction = (action: ActionButtonId) => {
    if (action === 'scope') {
      const isFull = selectionBox.w >= 1040;
      setSelectionBox(isFull ? DEFAULT_BOX : { x: 24, y: 42, w: 1076, h: 408 });
      return;
    }
    if (action === 'pin') {
      setShowPin((v) => !v);
      return;
    }
    if (action === 'ocr') {
      setShowOcr((v) => !v);
      return;
    }
    if (action === 'translate') {
      setShowTranslate((v) => !v);
      return;
    }
    if (action === 'copy') {
      emitToast(labels.copiedImageMsg);
      return;
    }
    if (action === 'save_as') {
      setShowExportFrame((v) => !v);
      emitToast(labels.savedImageMsg);
      return;
    }
    if (action === 'settings') {
      setUiDark((v) => !v);
      emitToast(
        isZh
          ? `已切换截图工具栏至${!uiDark ? '深色' : '浅色'}主题 (Ctrl+Shift+L)`
          : `Switched Mark Shot UI to ${!uiDark ? 'Dark' : 'Light'} theme`
      );
      return;
    }
    if (action === 'cancel') {
      setStartupMode(true);
      return;
    }
    if (action === 'scroll') {
      emitToast(
        isZh
          ? '滚动长截图：按 18x24 亮度签名去重并自动拼接'
          : 'Scroll capture: deduplicating via 18x24 luma signature'
      );
      return;
    }
    if (action === 'scan_code') {
      emitToast(
        isZh
          ? '扫码检测：选区内未发现二维码或条形码'
          : 'Barcode scan: no QR/barcode detected in region'
      );
      return;
    }
    if (action === 'upload') {
      emitToast(
        isZh
          ? '图床上传就绪：可在 config.toml 配置自定义上传命令'
          : 'Upload ready: configure custom uploader in config.toml'
      );
      return;
    }
    emitToast(
      isZh
        ? '扩展动作：支持传入 {image} 与 {slurp} 选区几何占位符'
        : 'Extensions: passes {image} path and {slurp} geometry'
    );
  };

  /**
   * 【舞台复位】【恢复初始态】还原默认图元、比例与选中框
   * @returns 无返回值
   */
  const resetAll = () => {
    setHistory([createInitialAnnotations()]);
    setHistoryIdx(0);
    setNextSeq(2);
    setSelectionBox(DEFAULT_BOX);
    setAspectPreset('Free');
    setActiveTool('pick');
    setSelectedId('init-rect');
    setStartupMode(false);
  };

  return {
    startupMode,
    setStartupMode,
    uiDark,
    setUiDark,
    selectionBox,
    setSelectionBox,
    aspectPreset,
    aspectLocked,
    setAspectLocked,
    activeTool,
    setActiveTool,
    selectedId,
    setSelectedId,
    history,
    historyIdx,
    setHistoryIdx,
    setNextSeq,
    draft,
    showOcr,
    setShowOcr,
    showTranslate,
    setShowTranslate,
    showPin,
    setShowPin,
    showExportFrame,
    toolStyle,
    setToolStyle,
    currentAnnotations,
    commitAnnotations,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleSelectAspect,
    handleRightAction,
    resetAll,
  };
}
