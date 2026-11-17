/**
 * 发行版资产文件条目
 */
export interface ReleaseAsset {
  fileName: string;
  arch: string;
  distroNote: string;
  sizeLabel: string;
  sha256: string;
  downloadUrl: string;
}

/**
 * 按操作系统或包格式分组的下载卡片
 */
export interface PlatformDownloadGroup {
  id: 'deb' | 'rpm-arch' | 'portable-linux' | 'windows';
  title: string;
  subtitle: string;
  installHint?: string;
  assets: ReleaseAsset[];
}

/**
 * 快捷命令行安装方式条目
 */
export interface QuickInstallMethod {
  id: string;
  label: string;
  description: string;
  code: string;
  lang: string;
}

/**
 * 版本更新记录条目
 */
export interface ReleaseLogEntry {
  version: string;
  date: string;
  tagUrl: string;
  summary: string;
  added: string[];
  improved: string[];
  fixed: string[];
}
