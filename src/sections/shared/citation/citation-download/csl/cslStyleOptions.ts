import cslStylesRaw from './cslStyles.json'

export interface CslStyleOption {
  value: string
  label: string
  group?: string
}

export const DEFAULT_CSL_STYLE_SLUG = 'chicago-author-date'

const COMMON_CSL_STYLE_SLUGS = ['chicago-author-date', 'ieee']

export function buildCslStyleOptions(
  commonStylesGroupLabel: string,
  moreStylesGroupLabel: string
): CslStyleOption[] {
  const commonSlugs = new Set(COMMON_CSL_STYLE_SLUGS)

  const commonOptions: CslStyleOption[] = COMMON_CSL_STYLE_SLUGS.map((slug) => ({
    value: slug,
    label: slug,
    group: commonStylesGroupLabel
  }))

  const moreOptions: CslStyleOption[] = cslStylesRaw
    .filter((style) => !commonSlugs.has(style.slug))
    .map((style) => ({
      value: style.slug,
      label: style.slug,
      group: moreStylesGroupLabel
    }))

  return [...commonOptions, ...moreOptions]
}
