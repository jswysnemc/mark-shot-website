import { useState } from 'react';
import { NativeMarkShotIcon } from '@/features/home/stage/stage-icons';
import {
  STAGE_H,
  STAGE_W,
  type AspectPreset,
  type SelectionBox,
} from '@/features/home/stage/stage-types';

interface SelectionChromeProps {
  box: SelectionBox;
  uiDark: boolean;
  isZh: boolean;
  aspectPreset: AspectPreset;
  aspectLocked: boolean;
  onToggleLock: () => void;
  onSelectPreset: (preset: AspectPreset) => void;
}

const PRESETS: AspectPreset[] = ['Free', '16:9', '16:10', '4:3', '1:1'];

/**
 * 【选区外框】【遮罩与尺寸胶囊】渲染选区四周半透明压暗遮罩、8 个白底青边缩放把柄及左上角 [W x H px | 锁 | Free] 胶囊
 * @param props 选区几何坐标、明暗主题及宽高比回调
 * @returns 选区外框与左上角胶囊节点
 */
export function SelectionChrome({
  box,
  uiDark,
  isZh,
  aspectPreset,
  aspectLocked,
  onToggleLock,
  onSelectPreset,
}: SelectionChromeProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const rightX = box.x + box.w;
  const bottomY = box.y + box.h;
  const midX = box.x + box.w / 2;
  const midY = box.y + box.h / 2;

  const handles = [
    { id: 'tl', x: box.x, y: box.y },
    { id: 'tm', x: midX, y: box.y },
    { id: 'tr', x: rightX, y: box.y },
    { id: 'ml', x: box.x, y: midY },
    { id: 'mr', x: rightX, y: midY },
    { id: 'bl', x: box.x, y: bottomY },
    { id: 'bm', x: midX, y: bottomY },
    { id: 'br', x: rightX, y: bottomY },
  ];

  const pillSurface = uiDark
    ? 'bg-[#0f1117]/92 text-[#f8fafc] border-white/14'
    : 'bg-[#f8fafc]/96 text-[#0f172a] border-slate-900/14';

  const presetText =
    aspectPreset === 'Free' ? (isZh ? '自由' : 'Free') : aspectPreset;

  return (
    <>
      {/* 选区外部四块半透明压暗遮罩（对应真实软件 (13,14,16) 导航外遮罩） */}
      <div
        aria-hidden="true"
        style={{ left: 0, top: 0, width: STAGE_W, height: box.y }}
        className="pointer-events-none absolute bg-[#0d0e10]/52"
      />
      <div
        aria-hidden="true"
        style={{
          left: 0,
          top: bottomY,
          width: STAGE_W,
          height: Math.max(0, STAGE_H - bottomY),
        }}
        className="pointer-events-none absolute bg-[#0d0e10]/52"
      />
      <div
        aria-hidden="true"
        style={{ left: 0, top: box.y, width: box.x, height: box.h }}
        className="pointer-events-none absolute bg-[#0d0e10]/52"
      />
      <div
        aria-hidden="true"
        style={{
          left: rightX,
          top: box.y,
          width: Math.max(0, STAGE_W - rightX),
          height: box.h,
        }}
        className="pointer-events-none absolute bg-[#0d0e10]/52"
      />

      {/* 1px 选区青蓝描边 */}
      <div
        aria-hidden="true"
        style={{ left: box.x, top: box.y, width: box.w, height: box.h }}
        className="pointer-events-none absolute border border-[#7dd3fc]/75"
      />

      {/* 四角与四边中点共 8 个方形白底青边控点 */}
      {handles.map((pt) => (
        <span
          key={pt.id}
          aria-hidden="true"
          style={{ left: pt.x - 3, top: pt.y - 3 }}
          className="pointer-events-none absolute block h-[6px] w-[6px] border border-[#0d9488] bg-white shadow-xs"
        />
      ))}

      {/* 选区左上角 [1140 x 528 px | 锁 | Free] 尺寸与比例胶囊（1:1 对应 02-selected-clean.png） */}
      <div
        data-ui-chrome
        style={{ left: box.x, top: Math.max(8, box.y - 34) }}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        className={`absolute z-30 flex h-[26px] items-center gap-1.5 rounded-[8px] border px-2.5 font-[family-name:var(--sans)] text-[12px] shadow-md backdrop-blur-md ${pillSurface}`}
      >
        <span className="font-semibold tabular-nums">{Math.round(box.w)}</span>
        <span className="opacity-55">×</span>
        <span className="font-semibold tabular-nums">{Math.round(box.h)}</span>
        <span className="ml-0.5 text-[11px] opacity-60">px</span>

        <span className="mx-0.5 h-3.5 w-px bg-current opacity-18" />

        <button
          type="button"
          onClick={onToggleLock}
          title={isZh ? '锁定长宽比' : 'Lock aspect ratio'}
          className={`grid h-5 w-5 cursor-pointer place-items-center rounded-[5px] text-inherit transition-colors ${
            aspectLocked
              ? 'bg-[#0d9488]/20 text-[#2dd4bf]'
              : 'opacity-75 hover:opacity-100'
          }`}
        >
          <NativeMarkShotIcon
            name={aspectLocked ? 'lock' : 'unlock'}
            size={13}
          />
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="inline-flex h-5 cursor-pointer items-center gap-1 rounded-[5px] px-1.5 text-[11.5px] font-medium text-inherit transition-colors hover:bg-black/6"
          >
            <span>{presetText}</span>
            <NativeMarkShotIcon name="chevron_down" size={12} />
          </button>

          {menuOpen ? (
            <ul
              className={`absolute top-7 left-0 z-40 w-24 rounded-[9px] border p-1 shadow-xl ${pillSurface}`}
            >
              {PRESETS.map((preset) => {
                const label =
                  preset === 'Free' ? (isZh ? '自由' : 'Free') : preset;
                const active = preset === aspectPreset;
                return (
                  <li key={preset}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectPreset(preset);
                        setMenuOpen(false);
                      }}
                      className={`flex w-full cursor-pointer items-center justify-between rounded-[6px] px-2 py-1 text-left text-[11.5px] text-inherit ${
                        active
                          ? 'bg-[#0d9488] text-white'
                          : 'hover:bg-black/8'
                      }`}
                    >
                      <span>{label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      </div>
    </>
  );
}
