import { useState } from 'react';
import {
  NativeMarkShotIcon,
  type NativeIconName,
} from '@/features/home/stage/stage-icons';

export type ActionButtonId =
  | 'scope'
  | 'open_with'
  | 'extensions'
  | 'scroll'
  | 'pin'
  | 'ocr'
  | 'scan_code'
  | 'translate'
  | 'copy'
  | 'save_as'
  | 'upload'
  | 'settings'
  | 'cancel';

type ActionEntry =
  | { kind: 'sep'; id: string }
  | {
      kind: 'btn';
      id: ActionButtonId;
      icon: NativeIconName;
      zh: string;
      en: string;
      shortcut?: string;
    };

const ACTION_ENTRIES: ActionEntry[] = [
  { kind: 'btn', id: 'scope', icon: 'scope', zh: '切换全图选区', en: 'Toggle full image', shortcut: 'Ctrl+A' },
  { kind: 'sep', id: 'a1' },
  { kind: 'btn', id: 'open_with', icon: 'open_with', zh: '打开方式', en: 'Open with' },
  { kind: 'btn', id: 'extensions', icon: 'extensions', zh: '扩展操作', en: 'Extensions' },
  { kind: 'btn', id: 'scroll', icon: 'scroll', zh: '滚动截图', en: 'Scrolling capture' },
  { kind: 'btn', id: 'pin', icon: 'pin', zh: '贴图置顶', en: 'Pin to screen', shortcut: 'Ctrl+P' },
  { kind: 'btn', id: 'ocr', icon: 'ocr', zh: '文字识别', en: 'OCR recognize', shortcut: 'O' },
  { kind: 'btn', id: 'scan_code', icon: 'scan_code', zh: '识别二维码与条码', en: 'Scan QR / barcode' },
  { kind: 'btn', id: 'translate', icon: 'translate', zh: '原位翻译', en: 'In-place translate' },
  { kind: 'sep', id: 'a2' },
  { kind: 'btn', id: 'copy', icon: 'copy', zh: '复制截图', en: 'Copy capture', shortcut: 'Ctrl+C' },
  { kind: 'btn', id: 'save_as', icon: 'save_as', zh: '保存截图', en: 'Save capture', shortcut: 'Ctrl+S' },
  { kind: 'btn', id: 'upload', icon: 'upload', zh: '上传图床', en: 'Upload image', shortcut: 'Ctrl+U' },
  { kind: 'sep', id: 'a3' },
  { kind: 'btn', id: 'settings', icon: 'settings', zh: '切换界面明暗主题', en: 'Toggle light/dark UI', shortcut: 'Ctrl+Shift+L' },
  { kind: 'sep', id: 'a4' },
  { kind: 'btn', id: 'cancel', icon: 'cancel', zh: '返回启动选区态', en: 'Back to startup mode', shortcut: 'Esc' },
];

interface ActionFloatingToolbarProps {
  left: number;
  top: number;
  uiDark: boolean;
  isZh: boolean;
  activeOverlays: {
    pin: boolean;
    ocr: boolean;
    translate: boolean;
  };
  onAction: (action: ActionButtonId) => void;
}

/**
 * 【右侧副栏】【纵向动作工具栏】1:1 复刻 Mark Shot 0.2.1 选区右侧纵向动作栏（含复制强调框、实心绿渐变保存钮与红色悬停关闭钮）
 * @param props 定位坐标、明暗模式、已开启浮层与动作回调
 * @returns 纵向动作工具栏节点
 */
export function ActionFloatingToolbar({
  left,
  top,
  uiDark,
  isZh,
  activeOverlays,
  onAction,
}: ActionFloatingToolbarProps) {
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
      className={`absolute z-30 flex w-[36px] flex-col items-center gap-[2px] rounded-[11px] border py-1.5 shadow-[0_10px_28px_-10px_rgba(0,0,0,0.42)] backdrop-blur-md select-none ${shellClass}`}
    >
      {/* 顶部横向 3x2 握柄圆点（对应 draw.rs Orientation::Vertical） */}
      <div
        aria-hidden="true"
        className="grid grid-cols-3 gap-[2.5px] px-1 py-1"
      >
        {Array.from({ length: 6 }).map((_, idx) => (
          <i key={idx} className={`block h-[2.5px] w-[2.5px] rounded-full ${dotClass}`} />
        ))}
      </div>

      {ACTION_ENTRIES.map((entry) => {
        if (entry.kind === 'sep') {
          return (
            <span
              key={entry.id}
              aria-hidden="true"
              className={`my-0.5 h-px w-4 shrink-0 ${sepClass}`}
            />
          );
        }

        const isHovered = hoveredId === entry.id;
        const isSave = entry.id === 'save_as';
        const isCopy = entry.id === 'copy';
        const isCancel = entry.id === 'cancel';
        const isToggled =
          (entry.id === 'pin' && activeOverlays.pin) ||
          (entry.id === 'ocr' && activeOverlays.ocr) ||
          (entry.id === 'translate' && activeOverlays.translate);

        const label = isZh ? entry.zh : entry.en;

        // 严格对齐 draw.rs 第 111-166 行的 Save 渐变、Copy 浅框与 Cancel 红色危险态
        let btnClass = 'cursor-pointer border border-transparent';
        if (isSave) {
          btnClass = isHovered
            ? 'cursor-pointer border border-[#6ee7b7] bg-gradient-to-b from-[#34d399] to-[#10b981] text-white'
            : 'cursor-pointer border border-[#34d399] bg-gradient-to-b from-[#10b981] to-[#059669] text-white';
        } else if (isCancel && isHovered) {
          btnClass = uiDark
            ? 'cursor-pointer border border-[#fca5a5]/55 bg-[#ef4444]/28 text-[#fca5a5]'
            : 'cursor-pointer border border-[#dc2626]/45 bg-[#ef4444]/16 text-[#b91c1c]';
        } else if (isCopy) {
          btnClass = isHovered
            ? uiDark
              ? 'cursor-pointer border border-[#5eead4]/60 bg-[#2dd4bf]/25 text-[#f8fafc]'
              : 'cursor-pointer border border-[#0d9488]/60 bg-[#0d9488]/20 text-[#0f172a]'
            : uiDark
              ? 'cursor-pointer border border-[#2dd4bf]/38 bg-[#2dd4bf]/14 text-[#e5e7eb]'
              : 'cursor-pointer border border-[#0d9488]/35 bg-[#0d9488]/10 text-[#334155]';
        } else if (isHovered) {
          btnClass = uiDark
            ? 'cursor-pointer border border-[#5eead4] bg-[#2dd4bf] text-[#1a1814]'
            : 'cursor-pointer border border-[#14b8a6] bg-[#0d9488] text-white';
        } else if (isToggled) {
          btnClass = uiDark
            ? 'cursor-pointer border border-[#99f6e4]/60 bg-[#99f6e4]/30 text-[#f8fafc]'
            : 'cursor-pointer border border-[#0d9488]/45 bg-[#0d9488]/15 text-[#0f172a]';
        }

        return (
          <div key={entry.id} className="relative">
            <button
              type="button"
              aria-label={label}
              onMouseEnter={() => setHoveredId(entry.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onAction(entry.id)}
              className={`grid h-[26px] w-[26px] place-items-center rounded-[6px] transition-colors duration-100 ${btnClass}`}
            >
              <NativeMarkShotIcon name={entry.icon} size={16} />
            </button>

            {isHovered ? (
              <div
                className={`pointer-events-none absolute top-1/2 right-8 z-50 flex -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-[7px] border px-2 py-1 font-[family-name:var(--sans)] text-[11px] leading-none shadow-lg ${
                  uiDark
                    ? 'border-white/14 bg-[#0f1117] text-slate-100'
                    : 'border-slate-900/12 bg-white text-slate-800'
                }`}
              >
                <span>{label}</span>
                {entry.shortcut ? (
                  <kbd className="font-[family-name:var(--mono)] text-[10px] opacity-65">
                    {entry.shortcut}
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
