import { useState } from 'react';
import { CopyCodeBlock } from '@/components/ui/CopyCodeBlock';
import type { SiteCopy } from '@/types/locale';
import type { QuickInstallMethod } from '@/types/release';

interface QuickInstallTabsProps {
  methods: QuickInstallMethod[];
  heading: string;
  subheading: string;
  verifyHeading: string;
  verifyBody: string;
  commonCopy: SiteCopy['common'];
}

const VERIFY_COMMANDS = `sha256sum mark-shot-native-0.2.1-linux-x86_64.tar.gz\n# Windows PowerShell\nGet-FileHash .\\mark-shot-native-0.2.1-windows-x86_64-msvc-setup.exe -Algorithm SHA256`;

/**
 * 【快捷安装】【选项卡面板】提供 Arch AUR、NixOS Flake、Cargo 构建与文件校验命令切换
 * @param props 安装方式列表与标题说明文案
 * @returns 选项卡式代码块展示组件
 */
export function QuickInstallTabs({
  methods,
  heading,
  subheading,
  verifyHeading,
  verifyBody,
  commonCopy,
}: QuickInstallTabsProps) {
  const [selectedId, setSelectedId] = useState<string>(methods[0]?.id ?? 'arch');
  const activeMethod =
    methods.find((item) => item.id === selectedId) ?? methods[0];

  return (
    <section className="relative" data-section data-hatch-band>
      <div className="wrap grid grid-cols-1 gap-8 pt-14 pb-14 lg:grid-cols-2 md:pt-18 md:pb-18">
        <div>
          <h2 className="text-[clamp(1.5rem,2.2vw,2rem)] leading-[1.15] font-normal text-[var(--ink)]">
            {heading}
          </h2>
          <p className="mt-2.5 text-[0.9375rem] leading-[1.6] text-[var(--soft)]">
            {subheading}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {methods.map((method) => {
              const isSelected = method.id === activeMethod.id;
              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setSelectedId(method.id)}
                  className={`cursor-pointer rounded-full px-3.5 py-1.5 font-[family-name:var(--sans)] text-[0.8125rem] transition-colors active:scale-[0.98] ${
                    isSelected
                      ? 'bg-[var(--ink)] text-[var(--paper)]'
                      : 'border border-[var(--rule)] bg-[var(--card)] text-[var(--soft)] hover:text-[var(--ink)]'
                  }`}
                >
                  {method.label}
                </button>
              );
            })}
          </div>

          <p className="mt-4 text-[0.875rem] text-[var(--soft)]">
            {activeMethod.description}
          </p>

          <div className="mt-3">
            <CopyCodeBlock
              code={activeMethod.code}
              label={activeMethod.label}
              copyLabel={commonCopy.copyLabel}
              copiedLabel={commonCopy.copiedLabel}
              toastText={commonCopy.copiedToast}
            />
          </div>
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-[clamp(1.5rem,2.2vw,2rem)] leading-[1.15] font-normal text-[var(--ink)]">
              {verifyHeading}
            </h2>
            <p className="mt-2.5 text-[0.9375rem] leading-[1.6] text-[var(--soft)]">
              {verifyBody}
            </p>
          </div>

          <div className="mt-5">
            <CopyCodeBlock
              code={VERIFY_COMMANDS}
              label="SHA-256 Checksum"
              copyLabel={commonCopy.copyLabel}
              copiedLabel={commonCopy.copiedLabel}
              toastText={commonCopy.copiedToast}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
