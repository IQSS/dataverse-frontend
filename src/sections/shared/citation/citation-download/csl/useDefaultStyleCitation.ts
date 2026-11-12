import { useEffect, useState } from 'react'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { getDatasetCitationInOtherFormats } from '@/dataset/domain/useCases/getDatasetCitationInOtherFormats'
import { CitationFormat, FormattedCitation } from '@/dataset/domain/models/DatasetCitation'
import { Utils } from '@/shared/helpers/Utils'
import { formatCitationAsHtml, CslJsonItem } from './citeprocEngine'
import { DEFAULT_CSL_STYLE_SLUG } from './cslStyleOptions'

interface UseDefaultStyleCitationParams {
  datasetRepository: DatasetRepository
  datasetId: string
  version: string
}

interface UseDefaultStyleCitationResult {
  cslJsonCitation: FormattedCitation | null
  defaultStyleCitationHtml: string | null
  defaultStyleCitationText: string
  isFetching: boolean
}

export function useDefaultStyleCitation({
  datasetRepository,
  datasetId,
  version
}: UseDefaultStyleCitationParams): UseDefaultStyleCitationResult {
  const [cslJsonCitation, setCslJsonCitation] = useState<FormattedCitation | null>(null)
  const [defaultStyleCitationHtml, setDefaultStyleCitationHtml] = useState<string | null>(null)
  const [defaultStyleCitationText, setDefaultStyleCitationText] = useState('')
  const [isFetching, setIsFetching] = useState(true)

  useEffect(() => {
    let cancelled = false
    setIsFetching(true)
    setCslJsonCitation(null)
    setDefaultStyleCitationHtml(null)
    setDefaultStyleCitationText('')
    Promise.resolve()
      .then(() =>
        getDatasetCitationInOtherFormats(
          datasetRepository,
          datasetId,
          version,
          CitationFormat.CSLJson
        )
      )
      .then((citation) => {
        if (!cancelled) {
          setCslJsonCitation(citation)
        }
        return formatCitationAsHtml(
          JSON.parse(citation.content) as CslJsonItem,
          DEFAULT_CSL_STYLE_SLUG
        )
      })
      .then((html) => {
        if (!cancelled) {
          setDefaultStyleCitationHtml(html)
          setDefaultStyleCitationText(Utils.htmlToPlainText(html))
        }
      })
      .catch(() => {
        // Silently skip rendering the quick-copy icon if the default-style citation can't be built.
      })
      .finally(() => {
        if (!cancelled) {
          setIsFetching(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [datasetRepository, datasetId, version])

  return { cslJsonCitation, defaultStyleCitationHtml, defaultStyleCitationText, isFetching }
}
