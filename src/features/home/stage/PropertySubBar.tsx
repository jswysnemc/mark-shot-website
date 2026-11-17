import { useState } from 'react';
import { NativeMarkShotIcon } from '@/features/home/stage/stage-icons';
import {
  PRESET_COLORS,
  type ArrowHeadKind,
  type DrawToolId,
  type FilterKind,
  type NumeralFormat,
  type StrokeDashKind,
} from '@/features/home/stage/stage-types';

export interface ToolStyleState {
  color: string;
  strokeWidth: number;
  filled: boolean;
  lockSquare: boolean;
  cornerRadius: number;
  arrowHead: ArrowHeadKind;
  dash: StrokeDashKind;
  numeralFormat: NumeralFormat;
  filterKind: FilterKind;
  filterIntensity: number;
  magnifierZoom: number;
  magnifierSquare: boolean;
  fontSize: number;
  textBg: boolean;
  recordFormat: 'MP4' | 'MKV' | 'GIF';
}

interface PropertySubBarProps {
  left: number;
  top: number;
  uiDark: boolean;
  isZh: boolean;
  activeTool: DrawToolId;
  style: ToolStyleState;
  onChange: (patch: Partial<ToolStyleState>) => void;
  onResetNumberSeq: () => void;
  onTriggerRecordDemo: () => void;
}

/**
 * 【步进器图标】【双向上下尖角】对齐原生二级属性栏数值步进按钮右侧双箭头（13-rect-prop.png）
 * @returns 双向上下箭头 SVG
 */
function StepperChevron() {
  return (
    <svg
      width={11}
      height={11}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="ml-1 inline-block shrink-0 opacity-60"
    >
      <path d="M8 9l4-4 4 4M8 15l4 4 4-4" />
    </svg>
  );
}

/**
 * 【下拉指示器】【向下单尖角】对齐原生二级属性栏下拉枚举按钮右侧箭头
 * @returns 向下单箭头 SVG
 */
function DropdownChevron() {
  return (
    <svg
      width={11}
      height={11}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="ml-1 inline-block shrink-0 opacity-60"
    >
      <path d="M6 9.5l6 6 6-6" />
    </svg>
  );
}

/**
 * 【二级属性栏】【动态参数与调色弹层】复刻 niri-use 捕获的各工具二级属性胶囊（04/05/06/07/08/09/13/14 实机图）
 * @param props 坐标、主题、当前工具及样式变更回调
 * @returns 二级浮动属性栏与可选调色板弹层
 */
export function PropertySubBar({
  left,
  top,
  uiDark,
  isZh,
  activeTool,
  style,
  onChange,
  onResetNumberSeq,
  onTriggerRecordDemo,
}: PropertySubBarProps) {
  const [colorOpen, setColorOpen] = useState(false);

  // 调整选区、选择标注与取色器无二级属性条（与 02-selected-clean.png / 16-selected-annotation.png 一致）
  if (
    activeTool === 'selection' ||
    activeTool === 'pick' ||
    activeTool === 'eyedropper'
  ) {
    return null;
  }

  const shellClass = uiDark
    ? 'bg-[#0f1117]/92 border-white/12 text-[#e5e7eb]'
    : 'bg-[#f8fafc]/96 border-slate-900/12 text-[#334155]';

  const ctrlClass = uiDark
    ? 'border-white/12 bg-white/8 hover:bg-white/14 text-slate-100'
    : 'border-slate-900/12 bg-slate-900/4 hover:bg-slate-900/8 text-slate-800';

  const cycleWidth = () => {
    const steps = [2, 4, 6, 10, 14];
    const next = steps[(steps.indexOf(style.strokeWidth) + 1) % steps.length] ?? 4;
    onChange({ strokeWidth: next });
  };

  const cycleRadius = () => {
    const steps = [0, 4, 10, 18];
    const next = steps[(steps.indexOf(style.cornerRadius) + 1) % steps.length] ?? 4;
    onChange({ cornerRadius: next });
  };

  return (
    <div
      data-ui-chrome
      style={{ left, top }}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      className={`absolute z-30 flex h-[34px] items-center gap-1.5 rounded-[11px] border px-2 font-[family-name:var(--sans)] text-[11.5px] shadow-xl backdrop-blur-md select-none ${shellClass}`}
    >
      {/* 录制工具专属参数条 */}
      {activeTool === 'recording' ? (
        <>
          {(['MP4', 'MKV', 'GIF'] as const).map((fmt) => (
            <button
              key={fmt}
              type="button"
              onClick={() => onChange({ recordFormat: fmt })}
              className={`cursor-pointer rounded-[6px] border px-2 py-0.5 text-[11px] font-medium ${
                style.recordFormat === fmt
                  ? 'border-[#0d9488] bg-[#0d9488]/20 text-[#0d9488] dark:text-[#5eead4]'
                  : ctrlClass
              }`}
            >
              {fmt}
            </button>
          ))}
          <span className="px-1 font-[family-name:var(--mono)] text-[11px] opacity-75">
            60 fps · VAAPI
          </span>
          <button
            type="button"
            onClick={onTriggerRecordDemo}
            className="cursor-pointer rounded-[6px] bg-gradient-to-b from-[#10b981] to-[#059669] px-2.5 py-0.5 text-[11px] font-medium text-white"
          >
            {isZh ? '开始录制' : 'Start'}
          </button>
        </>
      ) : (
        <>
          {/* 左侧颜色圆角方块按钮：点击弹出真实 HSV + HEX + 预设色块调色板（14-color-popover.png） */}
          <div className="relative">
            <button
              type="button"
              aria-label="Stroke color"
              onClick={() => setColorOpen((v) => !v)}
              style={{ backgroundColor: style.color }}
              className="block h-[20px] w-[20px] cursor-pointer rounded-[6px] border border-black/20 shadow-xs dark:border-white/25"
            />

            {colorOpen ? (
              <div
                className={`absolute top-9 left-0 z-50 w-[184px] rounded-[12px] border p-2 shadow-2xl ${
                  uiDark
                    ? 'border-white/15 bg-[#0f1117] text-slate-100'
                    : 'border-slate-900/14 bg-white text-slate-800'
                }`}
              >
                <div
                  style={{
                    background: `linear-gradient(to bottom, transparent, #000), linear-gradient(to right, #fff, ${style.color})`,
                  }}
                  className="relative h-[64px] w-full rounded-[7px] border border-black/10"
                >
                  <span className="absolute top-2 right-3 h-3 w-3 rounded-full border-2 border-white shadow-xs" />
                </div>
                <div
                  className="mt-1.5 h-2 w-full rounded-full"
                  style={{
                    background:
                      'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
                  }}
                />
                <div className="mt-1.5 flex items-center gap-2">
                  <span
                    style={{ backgroundColor: style.color }}
                    className="h-5 w-5 shrink-0 rounded-[5px] border border-black/15"
                  />
                  <span className="flex-1 rounded-[5px] border border-current/15 px-2 py-0.5 font-[family-name:var(--mono)] text-[11px]">
                    {style.color.toUpperCase()}
                  </span>
                </div>
                <div className="mt-1.5 grid grid-cols-8 gap-1">
                  {PRESET_COLORS.map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      aria-label={hex}
                      onClick={() => {
                        onChange({ color: hex });
                        setColorOpen(false);
                      }}
                      style={{ backgroundColor: hex }}
                      className={`h-4 w-4 cursor-pointer rounded-[4px] border ${
                        style.color.toUpperCase() === hex
                          ? 'scale-110 border-[#0d9488] ring-1 ring-[#0d9488]'
                          : 'border-black/20'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {/* 矩形 / 椭圆 / 形状标记属性项（对应 13-rect-prop.png） */}
          {(activeTool === 'rectangle' ||
            activeTool === 'circle' ||
            activeTool === 'marker') && (
            <>
              <button
                type="button"
                onClick={cycleWidth}
                className={`inline-flex cursor-pointer items-center rounded-[6px] border px-2 py-0.5 font-[family-name:var(--mono)] text-[11px] ${ctrlClass}`}
              >
                <span>{style.strokeWidth}px</span>
                <StepperChevron />
              </button>
              <button
                type="button"
                onClick={() => onChange({ filled: !style.filled })}
                className={`inline-flex cursor-pointer items-center gap-1 rounded-[6px] border px-2 py-0.5 text-[11px] ${
                  style.filled
                    ? 'border-[#0d9488] bg-[#0d9488]/20 text-[#0d9488] dark:text-[#5eead4]'
                    : ctrlClass
                }`}
              >
                <span className="h-2 w-2 rounded-full border border-current" />
                <span>{isZh ? '填充' : 'Fill'}</span>
              </button>
              <button
                type="button"
                onClick={() => onChange({ lockSquare: !style.lockSquare })}
                className={`cursor-pointer rounded-[6px] border px-2 py-0.5 font-[family-name:var(--mono)] text-[11px] ${
                  style.lockSquare
                    ? 'border-[#0d9488] bg-[#0d9488]/20 text-[#0d9488] dark:text-[#5eead4]'
                    : ctrlClass
                }`}
              >
                1:1
              </button>
              {activeTool === 'rectangle' ? (
                <button
                  type="button"
                  onClick={cycleRadius}
                  className={`inline-flex cursor-pointer items-center rounded-[6px] border px-2 py-0.5 font-[family-name:var(--mono)] text-[11px] ${ctrlClass}`}
                >
                  <span>R {style.cornerRadius}px</span>
                  <StepperChevron />
                </button>
              ) : null}
            </>
          )}

          {/* 箭头 / 直线 / 画笔 / 荧光笔 / 激光笔属性项（对应 04-prop-arrow.png） */}
          {(activeTool === 'arrow' ||
            activeTool === 'line' ||
            activeTool === 'pen' ||
            activeTool === 'highlighter' ||
            activeTool === 'laser') && (
            <>
              {activeTool === 'arrow' ? (
                <button
                  type="button"
                  onClick={() => {
                    const order: ArrowHeadKind[] = ['concave', 'solid', 'open'];
                    const next =
                      order[(order.indexOf(style.arrowHead) + 1) % order.length] ??
                      'concave';
                    onChange({ arrowHead: next });
                  }}
                  className={`inline-flex cursor-pointer items-center rounded-[6px] border px-2 py-0.5 text-[11px] ${ctrlClass}`}
                >
                  <span>
                    {style.arrowHead === 'concave'
                      ? isZh
                        ? '直箭头'
                        : 'Concave'
                      : style.arrowHead === 'solid'
                        ? isZh
                          ? '实心三角'
                          : 'Solid'
                        : isZh
                          ? '开口箭头'
                          : 'Open'}
                  </span>
                  <DropdownChevron />
                </button>
              ) : null}
              {(activeTool === 'arrow' || activeTool === 'line') && (
                <button
                  type="button"
                  onClick={() => {
                    const order: StrokeDashKind[] = ['solid', 'dashed', 'dotted'];
                    const next =
                      order[(order.indexOf(style.dash) + 1) % order.length] ??
                      'solid';
                    onChange({ dash: next });
                  }}
                  className={`inline-flex cursor-pointer items-center rounded-[6px] border px-2 py-0.5 font-[family-name:var(--mono)] text-[11px] ${ctrlClass}`}
                >
                  <span>
                    {style.dash === 'solid'
                      ? '───'
                      : style.dash === 'dashed'
                        ? '- - -'
                        : '····'}
                  </span>
                  <DropdownChevron />
                </button>
              )}
              <button
                type="button"
                onClick={cycleWidth}
                className={`inline-flex cursor-pointer items-center rounded-[6px] border px-2 py-0.5 font-[family-name:var(--mono)] text-[11px] ${ctrlClass}`}
              >
                <span>{style.strokeWidth}px</span>
                <StepperChevron />
              </button>
            </>
          )}

          {/* 序号属性项（对应 05-prop-number.png） */}
          {activeTool === 'number' && (
            <>
              <button
                type="button"
                onClick={() => {
                  const order: NumeralFormat[] = ['123', 'ABC', 'ROMAN', 'STEM'];
                  const next =
                    order[(order.indexOf(style.numeralFormat) + 1) % order.length] ??
                    '123';
                  onChange({ numeralFormat: next });
                }}
                className={`inline-flex cursor-pointer items-center rounded-[6px] border px-2 py-0.5 font-[family-name:var(--mono)] text-[11px] ${ctrlClass}`}
              >
                <span>
                  {style.numeralFormat === 'ROMAN'
                    ? 'I, II'
                    : style.numeralFormat === 'STEM'
                      ? '甲, 乙'
                      : style.numeralFormat}
                </span>
                <DropdownChevron />
              </button>
              <button
                type="button"
                onClick={onResetNumberSeq}
                title={isZh ? '重置序号计数' : 'Reset counter'}
                className={`grid h-[22px] w-[24px] cursor-pointer place-items-center rounded-[6px] border ${ctrlClass}`}
              >
                <NativeMarkShotIcon name="reset_number" size={14} />
              </button>
            </>
          )}

          {/* 马赛克 / 滤镜属性项（对应 06-prop-filter.png） */}
          {activeTool === 'redact' && (
            <>
              <button
                type="button"
                onClick={() => {
                  const order: FilterKind[] = [
                    'pixelate',
                    'blur',
                    'spotlight',
                    'invert',
                  ];
                  const next =
                    order[(order.indexOf(style.filterKind) + 1) % order.length] ??
                    'pixelate';
                  onChange({ filterKind: next });
                }}
                className={`inline-flex cursor-pointer items-center rounded-[6px] border px-2 py-0.5 text-[11px] ${ctrlClass}`}
              >
                <span>
                  {style.filterKind === 'pixelate'
                    ? isZh
                      ? '像素化'
                      : 'Pixelate'
                    : style.filterKind === 'blur'
                      ? isZh
                        ? '毛玻璃'
                        : 'Blur'
                      : style.filterKind === 'spotlight'
                        ? isZh
                          ? '聚焦暗角'
                          : 'Spotlight'
                        : isZh
                          ? '反色'
                          : 'Invert'}
                </span>
                <DropdownChevron />
              </button>
              <button
                type="button"
                onClick={() => {
                  const steps = [10, 18, 28, 40];
                  const next =
                    steps[(steps.indexOf(style.filterIntensity) + 1) % steps.length] ??
                    18;
                  onChange({ filterIntensity: next });
                }}
                className={`inline-flex cursor-pointer items-center rounded-[6px] border px-2 py-0.5 font-[family-name:var(--mono)] text-[11px] ${ctrlClass}`}
              >
                <span>{style.filterIntensity}</span>
                <StepperChevron />
              </button>
              <button
                type="button"
                onClick={cycleRadius}
                className={`inline-flex cursor-pointer items-center rounded-[6px] border px-2 py-0.5 font-[family-name:var(--mono)] text-[11px] ${ctrlClass}`}
              >
                <span>R {style.cornerRadius}px</span>
                <StepperChevron />
              </button>
            </>
          )}

          {/* 双框放大镜属性项（对应 08-magnifier.png） */}
          {activeTool === 'magnifier' && (
            <>
              <button
                type="button"
                onClick={cycleWidth}
                className={`inline-flex cursor-pointer items-center rounded-[6px] border px-2 py-0.5 font-[family-name:var(--mono)] text-[11px] ${ctrlClass}`}
              >
                <span>{style.strokeWidth}px</span>
                <StepperChevron />
              </button>
              <button
                type="button"
                onClick={() => {
                  const zooms = [2.0, 3.25, 4.5, 6.0];
                  const next =
                    zooms[(zooms.indexOf(style.magnifierZoom) + 1) % zooms.length] ??
                    3.25;
                  onChange({ magnifierZoom: next });
                }}
                className={`inline-flex cursor-pointer items-center rounded-[6px] border px-2 py-0.5 font-[family-name:var(--mono)] text-[11px] ${ctrlClass}`}
              >
                <span>{style.magnifierZoom.toFixed(2)}x</span>
                <StepperChevron />
              </button>
              <button
                type="button"
                onClick={() =>
                  onChange({ magnifierSquare: !style.magnifierSquare })
                }
                className={`cursor-pointer rounded-[6px] border px-2 py-0.5 text-[11px] ${ctrlClass}`}
              >
                {style.magnifierSquare
                  ? isZh
                    ? '矩形镜框'
                    : 'Square'
                  : isZh
                    ? '圆形镜框'
                    : 'Circle'}
              </button>
            </>
          )}

          {/* 像素标尺属性项（对应 09-ruler.png） */}
          {activeTool === 'ruler' && (
            <>
              <span className={`rounded-[6px] border px-2 py-0.5 text-[11px] ${ctrlClass}`}>
                {isZh ? '长度标尺' : 'Length'}
              </span>
              <span className="px-1 font-[family-name:var(--mono)] text-[11px] opacity-75">
                {isZh ? '在画布拖拽测量像素距离' : 'Drag on canvas to measure'}
              </span>
            </>
          )}

          {/* 文字属性项（对应 07-prop-text.png） */}
          {activeTool === 'text' && (
            <>
              <button
                type="button"
                onClick={() => {
                  const sizes = [18, 24, 34, 48];
                  const next =
                    sizes[(sizes.indexOf(style.fontSize) + 1) % sizes.length] ??
                    24;
                  onChange({ fontSize: next });
                }}
                className={`inline-flex cursor-pointer items-center rounded-[6px] border px-2 py-0.5 font-[family-name:var(--mono)] text-[11px] ${ctrlClass}`}
              >
                <span>{style.fontSize}pt</span>
                <StepperChevron />
              </button>
              <button
                type="button"
                onClick={() => onChange({ textBg: !style.textBg })}
                className={`cursor-pointer rounded-[6px] border px-2 py-0.5 text-[11px] ${
                  style.textBg
                    ? 'border-[#0d9488] bg-[#0d9488]/20 text-[#0d9488] dark:text-[#5eead4]'
                    : ctrlClass
                }`}
              >
                {isZh ? '文字底色' : 'Text Bg'}
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}
