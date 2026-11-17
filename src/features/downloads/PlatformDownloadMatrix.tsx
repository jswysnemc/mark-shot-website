import { useEffect, useState } from 'react';
import { ArrowSquareOut, Check, Copy, DownloadSimple } from '@phosphor-icons/react';
import type { SiteCopy } from '@/types/locale';
import type { PlatformDownloadGroup, ReleaseAsset } from '@/types/release';
import { copyTextWithToast } from '@/utils/clipboard';

interface PlatformDownloadMatrixProps {
  groups: PlatformDownloadGroup[];
  copy: SiteCopy['downloadsPage'];
}

/**
 * 【平台嗅探】【推荐资产】根据浏览器 User-Agent 推断推荐安装包分组与默认直链
 * @param groups 全平台分组列表
 * @returns 推荐分组 ID 与首选资产对象
 */
function detectRecommendedAsset(groups: PlatformDownloadGroup[]): {
  groupId: PlatformDownloadGroup['id'];
  asset: ReleaseAsset | undefined;
} {
  if (typeof navigator === 'undefined') {
    return {
      groupId: 'portable-linux',
      asset: groups.find((g) => g.id === 'portable-linux')?.assets[0],
    };
  }

  // 1. 识别 Windows 环境并匹配用户级安装器
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('win')) {
    const winGroup = groups.find((g) => g.id === 'windows');
    return { groupId: 'windows', asset: winGroup?.assets[0] };
  }

  // 2. 识别 Ubuntu 或 Debian 关键字并优先推荐对应 DEB 分组
  if (ua.includes('ubuntu') || ua.includes('debian')) {
    const debGroup = groups.find((g) => g.id === 'deb');
    return { groupId: 'deb', asset: debGroup?.assets[0] };
  }

  // 3. 识别 Fedora 或 Arch 环境并推荐 RPM / Pacman 分组
  if (ua.includes('fedora') || ua.includes('arch')) {
    const rpmGroup = groups.find((g) => g.id === 'rpm-arch');
    return { groupId: 'rpm-arch', asset: rpmGroup?.assets[0] };
  }

  // 4. 其余 Linux/Unix 环境默认推荐免安装 AppImage 或 ARM64 归档
  const portableGroup = groups.find((g) => g.id === 'portable-linux');
  const isArm = ua.includes('aarch64') || ua.includes('arm64');
  const asset = isArm ? portableGroup?.assets[3] : portableGroup?.assets[0];
  return { groupId: 'portable-linux', asset };
}

/**
 * 【下载矩阵】【资产列表】按发行版分组展示 Mark Shot 0.2.1 安装包、推荐高亮与 SHA-256 复制按钮
 * @param props 平台分组数据与多语言文案
 * @returns 交互式安装包矩阵组件
 */
export function PlatformDownloadMatrix({
  groups,
  copy,
}: PlatformDownloadMatrixProps) {
  const [recommendedGroup, setRecommendedGroup] =
    useState<PlatformDownloadGroup['id']>('portable-linux');
  const [autoDownloadAsset, setAutoDownloadAsset] = useState<
    ReleaseAsset | undefined
  >(undefined);
  const [copiedSha, setCopiedSha] = useState<string | null>(null);

  useEffect(() => {
    // 1. 客户端挂载后探测操作系统分组
    const detected = detectRecommendedAsset(groups);
    setRecommendedGroup(detected.groupId);

    // 2. 当 URL 携带 ?start 参数时自动拉起推荐安装包下载
    const params = new URLSearchParams(window.location.search);
    if (params.has('start') && detected.asset) {
      setAutoDownloadAsset(detected.asset);
      const anchor = document.createElement('a');
      anchor.href = detected.asset.downloadUrl;
      anchor.rel = 'noopener noreferrer';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    }
  }, [groups]);

  /**
   * 【摘要核验】【复制哈希】复制指定安装包的完整 64 位 SHA-256 字符串
   * @param sha256 哈希字符串
   * @returns Promise<void>
   */
  const handleCopySha = async (sha256: string) => {
    const ok = await copyTextWithToast(sha256, copy.copiedSha256Msg);
    if (!ok) {
      return;
    }
    setCopiedSha(sha256);
    window.setTimeout(() => setCopiedSha(null), 1800);
  };

  const activeGroupTitle =
    groups.find((g) => g.id === recommendedGroup)?.title ?? '';

  return (
    <div className="mt-8 space-y-6">
      {autoDownloadAsset ? (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[color-mix(in_srgb,var(--accent)_40%,transparent)] bg-[var(--accent-soft)] px-4 py-3 font-[family-name:var(--sans)] text-[0.875rem] text-[var(--ink)]">
          <span>
            {copy.autoStartedHint}{' '}
            <a
              href={autoDownloadAsset.downloadUrl}
              className="font-medium text-[var(--accent)] underline underline-offset-3"
            >
              {copy.retryLinkText} ({autoDownloadAsset.fileName})
            </a>
          </span>
          <span className="font-[family-name:var(--mono)] text-[0.75rem] text-[var(--soft)]">
            {autoDownloadAsset.sizeLabel}
          </span>
        </div>
      ) : (
        <p className="font-[family-name:var(--sans)] text-[0.875rem] text-[var(--quiet)]">
          {copy.recommendedPrefix}{' '}
          <span className="font-medium text-[var(--ink)]">{activeGroupTitle}</span>
        </p>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {groups.map((group) => {
          const isRecommended = group.id === recommendedGroup;
          return (
            <div
              key={group.id}
              className={`flex flex-col justify-between rounded-2xl border bg-[var(--card)] p-5 sm:p-6 ${
                isRecommended
                  ? 'border-[color-mix(in_srgb,var(--accent)_55%,var(--rule))] shadow-[0_16px_40px_-28px_rgba(13,148,136,0.35)]'
                  : 'border-[var(--rule)]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-[1.3rem] leading-[1.2] font-normal text-[var(--ink)]">
                      {group.title}
                    </h2>
                    <p className="mt-1.5 text-[0.875rem] leading-[1.55] text-[var(--soft)]">
                      {group.subtitle}
                    </p>
                  </div>
                  {isRecommended ? (
                    <span className="shrink-0 rounded-full bg-[var(--accent-soft)] px-2.5 py-0.5 font-[family-name:var(--sans)] text-[0.75rem] font-medium text-[var(--accent)]">
                      0.2.1
                    </span>
                  ) : null}
                </div>

                <ul className="mt-5 space-y-2.5">
                  {group.assets.map((asset) => {
                    const isCopied = copiedSha === asset.sha256;
                    return (
                      <li
                        key={asset.fileName}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--rule)] bg-[var(--paper)] px-3.5 py-2.5 font-[family-name:var(--sans)]"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[0.875rem] font-medium text-[var(--ink)]">
                              {asset.distroNote}
                            </span>
                            <span className="rounded-md bg-[var(--frame)] px-1.5 py-0.5 font-[family-name:var(--mono)] text-[0.6875rem] text-[var(--soft)]">
                              {asset.arch}
                            </span>
                            <span className="font-[family-name:var(--mono)] text-[0.6875rem] text-[var(--quiet)]">
                              {asset.sizeLabel}
                            </span>
                          </div>
                          <p className="mt-0.5 truncate font-[family-name:var(--mono)] text-[0.72rem] text-[var(--quiet)]">
                            {asset.fileName}
                          </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleCopySha(asset.sha256)}
                            title={`${copy.sha256Label}: ${asset.sha256}`}
                            className="inline-flex h-8 cursor-pointer items-center gap-1 rounded-lg border border-[var(--rule)] bg-[var(--card)] px-2 text-[0.72rem] text-[var(--soft)] transition-colors hover:text-[var(--ink)] active:scale-[0.98]"
                          >
                            {isCopied ? (
                              <Check
                                size={13}
                                weight="bold"
                                className="text-[var(--accent)]"
                              />
                            ) : (
                              <Copy size={13} />
                            )}
                            <span className="font-[family-name:var(--mono)]">
                              {asset.sha256.slice(0, 8)}
                            </span>
                          </button>

                          <a
                            href={asset.downloadUrl}
                            className="inline-flex h-8 items-center gap-1 rounded-lg bg-[var(--ink)] px-2.5 text-[0.75rem] font-medium text-[var(--paper)] transition-opacity hover:opacity-88 active:scale-[0.98]"
                          >
                            <DownloadSimple size={14} weight="bold" />
                            <span>.{asset.fileName.split('.').pop()}</span>
                          </a>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {group.installHint ? (
                <p className="mt-4 truncate border-t border-[var(--rule)] pt-3 font-[family-name:var(--mono)] text-[0.72rem] text-[var(--quiet)]">
                  $ {group.installHint}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="pt-1">
        <a
          href="https://github.com/jswysnemc/mark-shot/releases"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-[family-name:var(--sans)] text-[0.875rem] text-[var(--soft)] transition-colors hover:text-[var(--ink)]"
        >
          <span>{copy.allReleasesLabel}</span>
          <ArrowSquareOut size={15} />
        </a>
      </div>
    </div>
  );
}
