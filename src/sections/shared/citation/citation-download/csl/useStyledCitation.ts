import { useEffect, useState } from 'react'
import { formatCitationAsHtml, CslJsonItem } from './citeprocEngine'

interface UseStyledCitationResult {
  citationHtml: string | null
  isLoading: boolean
  error: boolean
}

export interface StyledCitationSeed {
  styleSlug: string
  html: string
}

export function useStyledCitation(
  cslJsonItem: CslJsonItem | null,
  styleSlug: string,
  seed?: StyledCitationSeed | null
): UseStyledCitationResult {
  const [citationHtml, setCitationHtml] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!cslJsonItem) {
      setCitationHtml(null)
      setError(false)
      setIsLoading(true)
      return
    }

    if (seed && seed.styleSlug === styleSlug) {
      setCitationHtml(seed.html)
      setError(false)
      setIsLoading(false)
      return
    }

    let cancelled = false
    setIsLoading(true)
    setError(false)
    formatCitationAsHtml(cslJsonItem, styleSlug)
      .then((html) => {
        if (!cancelled) {
          setCitationHtml(html)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true)
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false)
        }
      })
    return () => {
      cancelled = true
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cslJsonItem, styleSlug, seed?.styleSlug, seed?.html])

  return { citationHtml, isLoading, error }
}
