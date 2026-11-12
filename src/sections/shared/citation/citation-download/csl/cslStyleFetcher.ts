export const CSL_STYLES_BASE_URL =
  'https://cdn.jsdelivr.net/gh/citation-style-language/styles@v0.2.186'
export const CSL_LOCALES_BASE_URL =
  'https://cdn.jsdelivr.net/gh/citation-style-language/locales@v0.0.97'
export const DEFAULT_CSL_LOCALE = 'en-US'

const styleXmlCache = new Map<string, string>()
const localeXmlCache = new Map<string, string>()

export function clearCslCachesForTests(): void {
  styleXmlCache.clear()
  localeXmlCache.clear()
}

export class CslStyleResolutionError extends Error {
  constructor(styleSlug: string) {
    super(`Unable to resolve CSL style "${styleSlug}": no independent-parent link found.`)
  }
}

export async function getResolvedStyleXml(styleSlug: string): Promise<string> {
  const cached = styleXmlCache.get(styleSlug)
  if (cached !== undefined) {
    return cached
  }
  const xml = await resolveStyleXml(styleSlug)
  styleXmlCache.set(styleSlug, xml)
  return xml
}

export async function getLocaleXml(lang: string = DEFAULT_CSL_LOCALE): Promise<string> {
  const cached = localeXmlCache.get(lang)
  if (cached !== undefined) {
    return cached
  }
  const xml = await fetchTextOrThrow(`${CSL_LOCALES_BASE_URL}/locales-${lang}.xml`)
  localeXmlCache.set(lang, xml)
  return xml
}

async function resolveStyleXml(styleSlug: string): Promise<string> {
  const independentXml = await fetchTextOr404(`${CSL_STYLES_BASE_URL}/${styleSlug}.csl`)
  if (independentXml !== null) {
    return independentXml
  }

  const dependentXml = await fetchTextOrThrow(`${CSL_STYLES_BASE_URL}/dependent/${styleSlug}.csl`)
  const parentSlug = extractIndependentParentSlug(dependentXml)
  if (!parentSlug) {
    throw new CslStyleResolutionError(styleSlug)
  }

  return getResolvedStyleXml(parentSlug)
}

function extractIndependentParentSlug(xml: string): string | null {
  const doc = new DOMParser().parseFromString(xml, 'application/xml')
  const href = doc.querySelector('link[rel="independent-parent"]')?.getAttribute('href')
  if (!href) {
    return null
  }
  const segments = href.split('/').filter(Boolean)
  return segments[segments.length - 1] ?? null
}

async function fetchTextOr404(url: string): Promise<string | null> {
  const response = await fetch(url)
  if (response.status === 404) {
    return null
  }
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`)
  }
  return response.text()
}

async function fetchTextOrThrow(url: string): Promise<string> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`)
  }
  return response.text()
}
