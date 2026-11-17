import { useState } from 'react';
import {
  NativeMarkShotIcon,
  type NativeIconName,
} from '@/features/home/stage/stage-icons';
import type { DrawToolId } from '@/features/home/stage/stage-types';

type MainToolbarEntry =
  | { kind: 'sep'; id: string }
  | {
      kind: 'tool';
      id: DrawToolId;
      icon: NativeIconName;
      zh: string;
      en: string;
      shortcut?: string;
    }
  | {
      kind: 'cmd';
      id: 'clear' | 'undo' | 'redo';
      icon: NativeIconName;
      zh: string;
      en: string;
      shortcut?: string;
    };

const MAIN_ENTRIES: MainToolbarEntry[] = [
  { kind: 'tool', id: 'selection', icon: 'selection', zh: '调整选区', en: 'Selection', shortcut: 'S' },
  { kind: 'tool', id: 'pick', icon: 'pick', zh: '选择标注', en: 'Select annotation', shortcut: 'V' },
  { kind: 'sep', id: 's1' },
  { kind: 'tool', id: 'pen', icon: 'pen', zh: '画笔', en: 'Pen', shortcut: 'P' },
  { kind: 'tool', id: 'line', icon: 'line', zh: '直线', en: 'Line', shortcut: 'D' },
  { kind: 'tool', id: 'highlighter', icon: 'highlighter', zh: '荧光笔', en: 'Highlighter', shortcut: 'H' },
  { kind: 'sep', id: 's2' },
  { kind: 'tool', id: 'rectangle', icon: 'rectangle', zh: '矩形', en: 'Rectangle', shortcut: 'R' },
  { kind: 'tool', id: 'circle', icon: 'circle', zh: '椭圆', en: 'Ellipse', shortcut: 'C' },
  { kind: 'tool', id: 'marker', icon: 'marker', zh: '更多形状', en: 'More shapes', shortcut: 'K' },
  { kind: 'tool', id: 'arrow', icon: 'arrow', zh: '箭头', en: 'Arrow', shortcut: 'A' },
  { kind: 'sep', id: 's3' },
  { kind: 'tool', id: 'text', icon: 'text', zh: '文字', en: 'Text', shortcut: 'T' },
  { kind: 'tool', id: 'number', icon: 'number', zh: '序号', en: 'Number', shortcut: 'N' },
  { kind: 'tool', id: 'redact', icon: 'redact', zh: '马赛克', en: 'Redact', shortcut: 'M' },
  { kind: 'tool', id: 'magnifier', icon: 'magnifier', zh: '放大镜', en: 'Magnifier', shortcut: 'Z' },
  { kind: 'tool', id: 'ruler', icon: 'ruler', zh: '尺子', en: 'Ruler', shortcut: 'U' },
  { kind: 'tool', id: 'laser', icon: 'laser', zh: '激光笔', en: 'Laser', shortcut: 'G' },
  { kind: 'tool', id: 'eyedropper', icon: 'eyedropper', zh: '取色标注', en: 'Color sample', shortcut: 'I' },
  { kind: 'tool', id: 'recording', icon: 'recording', zh: '录屏', en: 'Recording' },
  { kind: 'sep', id: 's4' },
  { kind: 'cmd', id: 'clear', icon: 'clear', zh: '清除全部标注', en: 'Clear annotations' },
  { kind: 'cmd', id: 'undo', icon: 'undo', zh: '撤销', en: 'Undo', shortcut: 'Ctrl+Z' },
  { kind: 'cmd', id: 'redo', icon: 'redo', zh: '重做', en: 'Redo', shortcut: 'Ctrl+Y' },
];

interface MainFloatingToolbarProps {
  left: number;
  top: number;
  uiDark: boolean;
  isZh: boolean;
  activeTool: DrawToolId;
  canClear: boolean;
  canUndo: boolean;
  canRedo: boolean;
  onSelectTool: (tool: DrawToolId) => void;
  onClear: () => void;
  onUndo: () => void;
  onRedo: () => void;
}

/**
 * 【底部主栏】【原生浮动工具栏】1:1 复刻 Mark Shot 0.2.1 主工具栏（2x3 握柄圆点、20 按钮顺序、分隔细线与悬停实心青绿高亮）
 * @param props 定位坐标、明暗模式、当前工具及历史栈开关
 * @returns 浮动主工具栏节点
 */
export function MainFloatingToolbar({
  left,
  top,
  uiDark,
  isZh,
  activeTool,
  canClear,
  canUndo,
  canRedo,
  onSelectTool,
  onClear,
  onUndo,
  onRedo,
}: MainFloatingToolbarProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const shellClass = uiDark
    ? 'bg-[#0f1117]/92 border-white/12 text-[#e5e7eb]'
    : 'bg-[#f8fafc]/96 border-slate-900/12 text-[#334155]';

  const sepClass = uiDark ? 'bg-slate-400/28' : 'bg-slate-500/28';
  const dotClass = uiDark ? 'bg-slate-400/60' : 'bg-slate-500/60';

  return (
    <div
      data-ui-chrome
      style={{ left, top }}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      className={`absolute z-30 flex h-[38px] items-center gap-[3px] rounded-[11px] border px-1.5 shadow-[0_10px_28px_-10px_rgba(0,0,0,0.42)] backdrop-blur-md select-none ${shellClass}`}
    >
      {/* 左侧 2x3 拖动握柄圆点（对应 draw.rs 第 61-75 行） */}
      <div
        aria-hidden="true"
        className="grid grid-cols-2 gap-[2.5px] px-1.5 py-1"
      >
        {Array.from({ length: 6 }).map((_, idx) => (
          <i key={idx} className={`block h-[2.5px] w-[2.5px] rounded-full ${dotClass}`} />
        ))}
      </div>

      {MAIN_ENTRIES.map((item) => {
        if (item.kind === 'sep') {
          return (
            <span
              key={item.id}
              aria-hidden="true"
              className={`mx-0.5 h-4 w-px shrink-0 ${sepClass}`}
            />
          );
        }

        const isSelected = item.kind === 'tool' && activeTool === item.id;
        const isDisabled =
          item.kind === 'cmd' &&
          ((item.id === 'clear' && !canClear) ||
            (item.id === 'undo' && !canUndo) ||
            (item.id === 'redo' && !canRedo));
        const isHovered = hoveredId === item.id && !isDisabled;

        const btnLabel = isZh ? item.zh : item.en;

        // 严格对齐 toolbar.rs 的 active_fill / hover_fill 角色色值
        let btnClass = 'border border-transparent';
        if (isDisabled) {
          btnClass += ' opacity-35 cursor-default';
        } else if (isHovered) {
          btnClass = uiDark
            ? 'cursor-pointer border border-[#5eead4] bg-[#2dd4bf] text-[#1a1814]'
            : 'cursor-pointer border border-[#14b8a6] bg-[#0d9488] text-white';
        } else if (isSelected) {
          btnClass = uiDark
            ? 'cursor-pointer border border-[#99f6e4]/60 bg-[#99f6e4]/30 text-[#f8fafc]'
            : 'cursor-pointer border border-[#0d9488]/45 bg-[#0d9488]/15 text-[#0f172a]';
        } else {
          btnClass += ' cursor-pointer';
        }

        return (
          <div key={item.id} className="relative">
            <button
              type="button"
              disabled={isDisabled}
              aria-label={btnLabel}
              aria-pressed={item.kind === 'tool' ? isSelected : undefined}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => {
                if (item.kind === 'tool') {
                  onSelectTool(item.id);
                } else if (item.id === 'clear') {
                  onClear();
                } else if (item.id === 'undo') {
                  onUndo();
                } else {
                  onRedo();
                }
              }}
              className={`grid h-[28px] w-[28px] place-items-center rounded-[6px] transition-colors duration-100 ${btnClass}`}
            >
              <NativeMarkShotIcon name={item.icon} size={18} />
            </button>

            {isHovered ? (
              <div
                className={`pointer-events-none absolute -top-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-[7px] border px-2 py-1 font-[family-name:var(--sans)] text-[11px] leading-none shadow-lg ${
                  uiDark
                    ? 'border-white/14 bg-[#0f1117] text-slate-100'
                    : 'border-slate-900/12 bg-white text-slate-800'
                }`}
              >
                <span>{btnLabel}</span>
                {item.shortcut ? (
                  <kbd className="font-[family-name:var(--mono)] text-[10px] opacity-65">
                    {item.shortcut}
                  </kbd>
                ) : null}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
