import type { Locale, SiteCopy } from '@/types/locale';
import { siteCopyEn } from '@/data/site-copy-en';
import { siteCopyZh } from '@/data/site-copy-zh';

/**
 * 【国际化字典】【按需读取】根据语言代码返回对应语言的全站结构化文案
 * @param locale 目标语言标识（'zh-cn' 或 'en'）
 * @returns 对应语言的完整文案对象
 */
export function getSiteCopy(locale: Locale): SiteCopy {
  // 1. 匹配简体中文或回退至英文词典
  return locale === 'zh-cn' ? siteCopyZh : siteCopyEn;
}
