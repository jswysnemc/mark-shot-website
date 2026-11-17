/**
 * 支持的站点语言代码
 */
export type Locale = 'zh-cn' | 'en';

/**
 * 顶部或底部导航项结构
 */
export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

/**
 * 首页与下载页全站文案字典结构
 */
export interface SiteCopy {
  locale: Locale;
  htmlLang: string;
  switchLabel: string;
  switchHref: string;
  meta: {
    homeTitle: string;
    homeDescription: string;
    downloadsTitle: string;
    downloadsDescription: string;
  };
  header: {
    navFeatures: string;
    navBenchmarks: string;
    navThemes: string;
    navDownloads: string;
    dayLabel: string;
    nightLabel: string;
  };
  hero: {
    versionBadge: string;
    headline: string;
    lede: string;
    primaryCta: string;
    secondaryCta: string;
  };
  stage: {
    windowTitle: string;
    selectionHint: string;
    ocrPanelTitle: string;
    ocrCopyTsv: string;
    ocrCopiedMsg: string;
    pinTranslatedBadge: string;
    exportFrameLabel: string;
    resetCanvasLabel: string;
    copiedImageMsg: string;
    savedImageMsg: string;
    tools: {
      select: string;
      rectangle: string;
      arrow: string;
      number: string;
      highlighter: string;
      mosaic: string;
      magnifier: string;
      ruler: string;
      ocr: string;
      translate: string;
      pin: string;
      frame: string;
    };
  };
  benchmarks: {
    heading: string;
    subheading: string;
    environmentNote: string;
  };
  capabilities: {
    heading: string;
    subheading: string;
  };
  themesProtocols: {
    heading: string;
    subheading: string;
    tabGroupThemes: string;
    tabGroupProtocols: string;
  };
  downloadCallout: {
    heading: string;
    body: string;
    primaryCta: string;
    secondaryCta: string;
    slots: Array<{
      platform: string;
      requirement: string;
    }>;
  };
  downloadsPage: {
    heading: string;
    subheading: string;
    recommendedPrefix: string;
    autoStartedHint: string;
    retryLinkText: string;
    sha256Label: string;
    copySha256Label: string;
    copiedSha256Msg: string;
    allReleasesLabel: string;
    quickInstallHeading: string;
    quickInstallSubheading: string;
    verifyHeading: string;
    verifyBody: string;
    changelogHeading: string;
    changelogSubheading: string;
    categoryAdded: string;
    categoryImproved: string;
    categoryFixed: string;
    helpHeading: string;
    helpItems: Array<{
      title: string;
      body: string;
      linkLabel?: string;
      linkHref?: string;
    }>;
  };
  footer: {
    tagline: string;
    downloads: string;
    issues: string;
    licenseNote: string;
    versionText: string;
  };
  common: {
    copyLabel: string;
    copiedLabel: string;
    copiedToast: string;
  };
}
