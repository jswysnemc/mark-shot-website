import {
  computeOuterTangents,
  getPaddedBounds,
} from '@/features/home/stage/stage-geometry';
import {
  formatStepSeq,
  STAGE_H,
  STAGE_W,
  type CanvasAnnotation,
} from '@/features/home/stage/stage-types';

interface CanvasAnnotationsLayerProps {
  annotations: CanvasAnnotation[];
  draftAnnotation: CanvasAnnotation | null;
  selectedId: string | null;
  activePickMode: boolean;
  backdropSrc: string;
  isZh: boolean;
  onSelectAnnotation: (id: string) => void;
  onDeleteAnnotation: (id: string) => void;
}

/**
 * 【画布合成层】【真实矢量图元】渲染矩形、椭圆、内凹箭头、画笔、带尾圆章序号、切线放大镜、像素标尺与橙色外扩选中控制框
 * @param props 图元列表、草稿图元与当前选中项回调
 * @returns 矢量与滤镜合成节点
 */
export function CanvasAnnotationsLayer({
  annotations,
  draftAnnotation,
  selectedId,
  activePickMode,
  backdropSrc,
  isZh,
  onSelectAnnotation,
  onDeleteAnnotation,
}: CanvasAnnotationsLayerProps) {
  const allItems = draftAnnotation
    ? [...annotations, draftAnnotation]
    : annotations;
  const selectedItem = annotations.find((a) => a.id === selectedId) ?? null;

  return (
    <>
      {/* 滤镜、放大镜镜面与文字标注 DOM 层 */}
      {allItems.map((item) => {
        if (item.kind === 'redact') {
          const filterStyle =
            item.filter === 'pixelate'
              ? 'backdrop-blur-[6px] bg-slate-900/28 [background-image:radial-gradient(rgba(255,255,255,0.16)_1px,transparent_1px)] [background-size:8px_8px]'
              : item.filter === 'blur'
                ? 'backdrop-blur-[12px] bg-white/6'
                : item.filter === 'invert'
                  ? 'backdrop-invert'
                  : 'ring-[400px] ring-black/45';
          return (
            <div
              key={item.id}
              data-annotation-item="true"
              onClick={(e) => {
                if (activePickMode) {
                  e.stopPropagation();
                  onSelectAnnotation(item.id);
                }
              }}
              style={{
                left: item.x,
                top: item.y,
                width: item.w,
                height: item.h,
                borderRadius: item.radius,
              }}
              className={`absolute ${
                activePickMode ? 'cursor-pointer' : 'pointer-events-none'
              } ${filterStyle}`}
            />
          );
        }

        if (item.kind === 'magnifier') {
          const d = item.lensRadius * 2;
          const bgW = STAGE_W * item.zoom;
          const bgH = STAGE_H * item.zoom;
          const bgX = -(item.srcX * item.zoom - item.lensRadius);
          const bgY = -(item.srcY * item.zoom - item.lensRadius);
          return (
            <div
              key={`${item.id}-lens`}
              data-annotation-item="true"
              onClick={(e) => {
                if (activePickMode) {
                  e.stopPropagation();
                  onSelectAnnotation(item.id);
                }
              }}
              style={{
                left: item.lensX - item.lensRadius,
                top: item.lensY - item.lensRadius,
                width: d,
                height: d,
                borderRadius: item.square ? 10 : 999,
                borderColor: item.color,
                borderWidth: item.strokeWidth,
                backgroundImage: `url(${backdropSrc})`,
                backgroundSize: `${bgW}px ${bgH}px`,
                backgroundPosition: `${bgX}px ${bgY}px`,
              }}
              className={`absolute overflow-hidden border-solid shadow-2xl ${
                activePickMode ? 'cursor-pointer' : 'pointer-events-none'
              }`}
            />
          );
        }

        if (item.kind === 'text') {
          return (
            <div
              key={item.id}
              data-annotation-item="true"
              onClick={(e) => {
                if (activePickMode) {
                  e.stopPropagation();
                  onSelectAnnotation(item.id);
                }
              }}
              style={{
                left: item.x,
                top: item.y,
                color: item.color,
                fontSize: item.fontSize,
                backgroundColor: item.hasBg
                  ? 'rgba(15, 23, 42, 0.78)'
                  : 'transparent',
              }}
              className={`absolute rounded-[6px] px-2 py-0.5 font-[family-name:var(--sans)] leading-tight font-semibold ${
                activePickMode ? 'cursor-pointer' : 'pointer-events-none'
              }`}
            >
              {item.text}
            </div>
          );
        }

        return null;
      })}

      {/* 统一 SVG 矢量标注绘制层 */}
      <svg
        viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <defs>
          <filter id="msDrop" x="-12%" y="-12%" width="128%" height="128%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1.6" floodOpacity="0.28" />
          </filter>
        </defs>

        {allItems.map((item) => {
          const hitProps = activePickMode
            ? {
                'data-annotation-item': 'true',
                style: {
                  pointerEvents: 'visiblePainted' as const,
                  cursor: 'pointer',
                },
                onClick: (e: React.MouseEvent) => {
                  e.stopPropagation();
                  onSelectAnnotation(item.id);
                },
              }
            : {};

          if (item.kind === 'rect') {
            return (
              <rect
                key={item.id}
                x={item.x}
                y={item.y}
                width={item.w}
                height={item.h}
                rx={item.radius}
                fill={item.filled ? `${item.color}38` : 'none'}
                stroke={item.color}
                strokeWidth={item.strokeWidth}
                filter="url(#msDrop)"
                {...hitProps}
              />
            );
          }

          if (item.kind === 'ellipse') {
            return (
              <ellipse
                key={item.id}
                cx={item.x + item.w / 2}
                cy={item.y + item.h / 2}
                rx={Math.max(2, item.w / 2)}
                ry={Math.max(2, item.h / 2)}
                fill={item.filled ? `${item.color}38` : 'none'}
                stroke={item.color}
                strokeWidth={item.strokeWidth}
                filter="url(#msDrop)"
                {...hitProps}
              />
            );
          }

          if (item.kind === 'arrow' || item.kind === 'line') {
            const dx = item.x2 - item.x1;
            const dy = item.y2 - item.y1;
            const len = Math.hypot(dx, dy) || 1;
            const angle = Math.atan2(dy, dx);
            const headLen = Math.max(14, item.strokeWidth * 3.6);
            const wing = headLen * 0.44;
            const dashAttr =
              item.dash === 'dashed'
                ? '10 6'
                : item.dash === 'dotted'
                  ? '2 6'
                  : undefined;

            const bx = item.x2 - Math.cos(angle) * headLen;
            const by = item.y2 - Math.sin(angle) * headLen;
            const nx = -Math.sin(angle) * wing;
            const ny = Math.cos(angle) * wing;
            const notchX = item.x2 - Math.cos(angle) * (headLen * 0.72);
            const notchY = item.y2 - Math.sin(angle) * (headLen * 0.72);

            return (
              <g key={item.id} filter="url(#msDrop)" {...hitProps}>
                <line
                  x1={item.x1}
                  y1={item.y1}
                  x2={item.kind === 'arrow' && len > headLen ? notchX : item.x2}
                  y2={item.kind === 'arrow' && len > headLen ? notchY : item.y2}
                  stroke={item.color}
                  strokeWidth={item.strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={dashAttr}
                />
                {item.kind === 'arrow' ? (
                  item.head === 'open' ? (
                    <polyline
                      points={`${bx + nx},${by + ny} ${item.x2},${item.y2} ${bx - nx},${by - ny}`}
                      fill="none"
                      stroke={item.color}
                      strokeWidth={item.strokeWidth}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ) : (
                    <polygon
                      points={
                        item.head === 'concave'
                          ? `${item.x2},${item.y2} ${bx + nx},${by + ny} ${notchX},${notchY} ${bx - nx},${by - ny}`
                          : `${item.x2},${item.y2} ${bx + nx},${by + ny} ${bx - nx},${by - ny}`
                      }
                      fill={item.color}
                    />
                  )
                ) : null}
              </g>
            );
          }

          if (item.kind === 'pen' || item.kind === 'highlighter') {
            if (item.points.length < 2) {
              return null;
            }
            const d = item.points
              .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`)
              .join(' ');
            return (
              <path
                key={item.id}
                d={d}
                fill="none"
                stroke={item.color}
                strokeOpacity={item.kind === 'highlighter' ? 0.42 : 1}
                strokeWidth={
                  item.kind === 'highlighter'
                    ? item.strokeWidth * 3.2
                    : item.strokeWidth
                }
                strokeLinecap="round"
                strokeLinejoin="round"
                {...hitProps}
              />
            );
          }

          if (item.kind === 'number') {
            const label = formatStepSeq(item.seq, item.format);
            let arrowNode = null;
            if (item.tailX !== undefined && item.tailY !== undefined) {
              const dx = item.tailX - item.x;
              const dy = item.tailY - item.y;
              if (Math.hypot(dx, dy) > 20) {
                const ang = Math.atan2(dy, dx);
                const sx = item.x + Math.cos(ang) * 14;
                const sy = item.y + Math.sin(ang) * 14;
                const head = 17;
                const wing = 6.5;
                const bx = item.tailX - Math.cos(ang) * head;
                const by = item.tailY - Math.sin(ang) * head;
                const nx = -Math.sin(ang) * wing;
                const ny = Math.cos(ang) * wing;
                const notchX = item.tailX - Math.cos(ang) * (head * 0.75);
                const notchY = item.tailY - Math.sin(ang) * (head * 0.75);
                arrowNode = (
                  <>
                    <line
                      x1={sx}
                      y1={sy}
                      x2={notchX}
                      y2={notchY}
                      stroke={item.color}
                      strokeWidth={4.5}
                      strokeLinecap="round"
                    />
                    <polygon
                      points={`${item.tailX},${item.tailY} ${bx + nx},${by + ny} ${notchX},${notchY} ${bx - nx},${by - ny}`}
                      fill={item.color}
                    />
                  </>
                );
              }
            }
            return (
              <g key={item.id} filter="url(#msDrop)" {...hitProps}>
                {arrowNode}
                <circle
                  cx={item.x}
                  cy={item.y}
                  r={14}
                  fill={item.color}
                  stroke="#ffffff"
                  strokeWidth={2}
                />
                <text
                  x={item.x}
                  y={item.y + 4.5}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="13"
                  fontWeight="700"
                  fontFamily="var(--sans)"
                >
                  {label}
                </text>
              </g>
            );
          }

          if (item.kind === 'magnifier') {
            const srcR = Math.max(14, item.lensRadius / item.zoom);
            const tangents = computeOuterTangents(
              item.srcX,
              item.srcY,
              srcR,
              item.lensX,
              item.lensY,
              item.lensRadius
            );
            return (
              <g key={item.id} {...hitProps}>
                {tangents.map(([tx1, ty1, tx2, ty2], idx) => (
                  <line
                    key={idx}
                    x1={tx1}
                    y1={ty1}
                    x2={tx2}
                    y2={ty2}
                    stroke={item.color}
                    strokeWidth={2.2}
                  />
                ))}
                <circle
                  cx={item.srcX}
                  cy={item.srcY}
                  r={srcR}
                  fill="none"
                  stroke={item.color}
                  strokeWidth={item.strokeWidth}
                />
              </g>
            );
          }

          if (item.kind === 'ruler') {
            const dx = item.x2 - item.x1;
            const dy = item.y2 - item.y1;
            const diag = Math.round(Math.hypot(dx, dy));
            const absW = Math.round(Math.abs(dx));
            const absH = Math.round(Math.abs(dy));
            const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
            const ticks: number[] = [];
            for (let t = 0; t <= diag; t += 10) {
              ticks.push(t);
            }
            const midX = (item.x1 + item.x2) / 2;
            const midY = (item.y1 + item.y2) / 2;
            const readoutText = `${absW} x ${absH} px   diag ${diag} px   area ${absW * absH} px`;

            return (
              <g key={item.id} {...hitProps}>
                <g transform={`translate(${item.x1}, ${item.y1}) rotate(${angleDeg})`}>
                  <line x1={0} y1={0} x2={diag} y2={0} stroke={item.color} strokeWidth={1.6} />
                  {ticks.map((t) => {
                    const isMajor = t % 50 === 0;
                    const halfH = isMajor ? 8 : t % 25 === 0 ? 5.5 : 3.5;
                    return (
                      <g key={t}>
                        <line
                          x1={t}
                          y1={-halfH}
                          x2={t}
                          y2={halfH}
                          stroke={item.color}
                          strokeWidth={isMajor ? 1.4 : 1}
                        />
                        {isMajor ? (
                          <text
                            x={t}
                            y={-12}
                            textAnchor="middle"
                            fill={item.color}
                            fontSize="11"
                            fontFamily="var(--sans)"
                          >
                            {t}
                          </text>
                        ) : null}
                      </g>
                    );
                  })}
                </g>
                <g transform={`translate(${midX}, ${midY + 26})`}>
                  <rect x={-118} y={-12} width={236} height={24} rx={10} fill="rgba(18, 21, 26, 0.9)" />
                  <text x={0} y={4} textAnchor="middle" fill="#f8fafc" fontSize="11" fontFamily="var(--sans)">
                    {readoutText}
                  </text>
                </g>
              </g>
            );
          }

          return null;
        })}

        {/* 选中标注外扩橙色虚线控制框（16-selected-annotation.png） */}
        {activePickMode && selectedItem ? (
          (() => {
            const b = getPaddedBounds(selectedItem);
            const mx = b.x + b.w / 2;
            const my = b.y + b.h / 2;
            const rx = b.x + b.w;
            const by = b.y + b.h;
            const pts = [
              [b.x, b.y],
              [mx, b.y],
              [rx, b.y],
              [b.x, my],
              [rx, my],
              [b.x, by],
              [mx, by],
              [rx, by],
            ];
            return (
              <g>
                <rect
                  x={b.x}
                  y={b.y}
                  width={b.w}
                  height={b.h}
                  fill="none"
                  stroke="#f97316"
                  strokeWidth={1.5}
                  strokeDasharray="5 3"
                />
                <line x1={mx} y1={b.y} x2={mx} y2={b.y - 18} stroke="#f97316" strokeWidth={1.5} />
                <circle cx={mx} cy={b.y - 21} r={3.5} fill="#f97316" />
                {pts.map(([px, py], idx) => (
                  <rect key={idx} x={px - 3} y={py - 3} width={6} height={6} rx={1} fill="#f97316" />
                ))}
              </g>
            );
          })()
        ) : null}
      </svg>

      {activePickMode && selectedItem ? (
        (() => {
          const b = getPaddedBounds(selectedItem);
          return (
            <button
              type="button"
              data-ui-chrome
              title={isZh ? '删除选中标注 (Delete)' : 'Delete selected mark'}
              style={{ left: b.x + b.w + 6, top: b.y - 18 }}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onDeleteAnnotation(selectedItem.id);
              }}
              className="absolute z-30 grid h-[18px] w-[18px] cursor-pointer place-items-center rounded-full bg-[#ef4444] text-[11px] leading-none font-bold text-white shadow-md hover:bg-[#dc2626]"
            >
              ×
            </button>
          );
        })()
      ) : null}
    </>
  );
}
