import { motion, useReducedMotion } from 'motion/react';
import type { BenchmarkItem } from '@/types/benchmark';
import type { SiteCopy } from '@/types/locale';

interface BenchmarksSectionProps {
  copy: SiteCopy['benchmarks'];
  items: BenchmarkItem[];
}

/**
 * 【性能实测】【微图表渲染】根据指标类型绘制无底槽比例条、内存折线、脏矩形网格或二进制分布柱
 * @param item 单项实测数据对象
 * @returns 对应 SVG 或比例图节点
 */
function BenchmarkMicroViz({ item }: { item: BenchmarkItem }) {
  // 1. 常驻唤起延迟：使用无填充轨道的内联比例线段直观对比数量级差异
  if (item.id === 'timeline' && item.comparisons) {
    const maxMs = 1400;
    return (
      <div className="flex flex-col justify-end gap-2 pt-2 font-[family-name:var(--mono)] text-[0.72rem]">
        {item.comparisons.map((row) => {
          const widthPct = Math.max(3, Math.round((row.ms / maxMs) * 100));
          return (
            <div key={row.name} className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-[var(--soft)]">
                <span className={row.isSelf ? 'font-medium text-[var(--ink)]' : ''}>
                  {row.name}
                </span>
                <span className={row.isSelf ? 'text-[var(--accent)]' : 'text-[var(--quiet)]'}>
                  {row.ms} ms
                </span>
              </div>
              <span
                style={{ width: `${widthPct}%` }}
                className={`block h-1.5 rounded-full ${
                  row.isSelf
                    ? 'bg-[var(--accent)]'
                    : 'bg-[color-mix(in_srgb,var(--ink)_24%,transparent)]'
                }`}
              />
            </div>
          );
        })}
      </div>
    );
  }

  // 2. 后台内存：绘制常驻 -> 打开画布 -> 取消后回落稳态的 SVG 折线图
  if (item.id === 'memory') {
    return (
      <div className="flex h-full flex-col justify-end pt-3">
        <svg viewBox="0 0 240 84" className="h-20 w-full overflow-visible" aria-hidden="true">
          <line
            x1="0"
            y1="62"
            x2="240"
            y2="62"
            stroke="var(--rule)"
            strokeDasharray="3 4"
          />
          <path
            d="M 4 62 L 56 62 L 82 22 L 132 22 L 156 62 L 236 62 L 236 78 L 4 78 Z"
            fill="color-mix(in srgb, var(--accent) 12%, transparent)"
          />
          <path
            d="M 4 62 L 56 62 L 82 22 L 132 22 L 156 62 L 236 62"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="28" cy="62" r="3.5" fill="var(--accent)" />
          <circle cx="107" cy="22" r="3.5" fill="var(--ink)" />
          <circle cx="212" cy="62" r="3.5" fill="var(--accent)" />
          <text
            x="107"
            y="13"
            textAnchor="middle"
            fill="var(--quiet)"
            fontSize="10"
            fontFamily="var(--mono)"
          >
            70.1 MiB active
          </text>
        </svg>
      </div>
    );
  }

  // 3. 连续交互帧率：展示选框四边 128px 局部损坏区域跳过空白中心块的合成原理
  if (item.id === 'fps') {
    return (
      <div className="flex h-full flex-col justify-end pt-3">
        <div className="grid grid-cols-6 gap-1 rounded-xl border border-[var(--rule)] bg-[var(--paper)] p-2">
          {Array.from({ length: 18 }).map((_, idx) => {
            const row = Math.floor(idx / 6);
            const col = idx % 6;
            const isBorderTile = row === 0 || row === 2 || col === 0 || col === 5;
            return (
              <span
                key={idx}
                className={`h-4 rounded-[3px] ${
                  isBorderTile
                    ? 'bg-[color-mix(in_srgb,var(--accent)_42%,transparent)] ring-1 ring-[color-mix(in_srgb,var(--accent)_55%,transparent)]'
                    : 'bg-transparent'
                }`}
              />
            );
          })}
        </div>
      </div>
    );
  }

  // 4. 单文件体积：展示剥离静态 ONNX Runtime 后的各段比例柱
  const segments = [0.92, 0.88, 0.82, 0.76, 0.64, 0.48, 0.34, 0.22];
  return (
    <div className="flex h-full flex-col justify-end pt-4">
      <div className="grid h-16 grid-cols-8 items-end gap-1.5">
        {segments.map((ratio, idx) => (
          <span
            key={idx}
            style={{ height: `${Math.round(ratio * 100)}%` }}
            className={`block rounded-[4px] ${
              idx < 5
                ? 'bg-[color-mix(in_srgb,var(--ink)_78%,transparent)]'
                : 'bg-[var(--accent)]'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * 【首页分区】【性能实测】以 2x2 图表卡片呈现真实桌面环境测得的延迟、内存、帧率与二进制体积
 * @param props 分区标题文案与四项实测卡片数据
 * @returns 实测分区节点
 */
export function BenchmarksSection({ copy, items }: BenchmarksSectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section id="benchmarks" className="relative" data-section data-hatch-band>
      <div className="wrap pt-16 pb-16 md:pt-22 md:pb-22">
        <div className="max-w-[42rem]">
          <h2 className="text-[clamp(1.65rem,2.5vw,2.25rem)] leading-[1.12] font-normal text-[var(--ink)]">
            {copy.heading}
          </h2>
          <p className="mt-3 text-[1rem] leading-[1.65] text-[var(--soft)]">
            {copy.subheading}
          </p>
        </div>

        <dl className="mt-9 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {items.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={reduceMotion ? false : { opacity: 0.92, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.42,
                delay: idx * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="grid grid-cols-1 gap-5 rounded-2xl border border-[var(--rule)] bg-[var(--card)] p-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] sm:p-6"
            >
              <div className="flex flex-col justify-between">
                <dt className="flex flex-col gap-3">
                  <span className="text-[0.8125rem] text-[var(--quiet)]">
                    {item.tag}
                  </span>
                  <span className="flex items-baseline gap-1.5 whitespace-nowrap">
                    <span
                      className={`text-[clamp(2.1rem,3.1vw,2.85rem)] leading-[0.95] tracking-[-0.03em] tabular-nums ${
                        item.highlightAccent
                          ? 'text-[var(--accent)]'
                          : 'text-[var(--ink)]'
                      }`}
                    >
                      {item.value}
                    </span>
                    <span className="text-[1.125rem] leading-none text-[var(--quiet)]">
                      {item.unit}
                    </span>
                  </span>
                </dt>
                <dd className="mt-3 text-[0.875rem] leading-[1.55] text-[var(--soft)]">
                  {item.label}
                </dd>
              </div>

              <div className="flex flex-col justify-between">
                <div className="flex justify-end">
                  {item.badgeText ? (
                    <span className="rounded-full border border-[var(--rule)] bg-[var(--paper)] px-2.5 py-0.5 font-[family-name:var(--mono)] text-[0.6875rem] text-[var(--soft)]">
                      {item.badgeText}
                    </span>
                  ) : null}
                </div>

                <BenchmarkMicroViz item={item} />

                <div className="mt-2.5 flex items-center justify-between font-[family-name:var(--mono)] text-[0.6875rem] text-[var(--quiet)]">
                  <span>{item.captionLeft}</span>
                  <span>{item.captionRight}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </dl>

        <p className="mt-4 text-[0.8125rem] text-[var(--quiet)]">
          {copy.environmentNote}
        </p>
      </div>
    </section>
  );
}
