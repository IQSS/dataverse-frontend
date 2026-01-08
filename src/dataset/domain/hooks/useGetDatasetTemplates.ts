import { useCallback, useEffect, useState } from 'react'
import { ReadError } from '@iqss/dataverse-client-javascript'
import { JSDataverseReadErrorHandler } from '@/shared/helpers/JSDataverseReadErrorHandler'
import { TemplateRepository } from '@/templates/domain/repositories/TemplateRepository'
import { Template } from '../models/DatasetTemplate'
import { getDatasetTemplates } from '../useCases/getDatasetTemplates'

interface useGetDatasetTemplatesProps {
  templateRepository: TemplateRepository
  collectionIdOrAlias: number | string
  autoFetch?: boolean
}

export const useGetDatasetTemplates = ({
  templateRepository,
  collectionIdOrAlias,
  autoFetch = true
}: useGetDatasetTemplatesProps) => {
  const [datasetTemplates, setDatasetTemplates] = useState<Template[]>([])
  const [isLoadingDatasetTemplates, setIsLoadingDatasetTemplates] = useState<boolean>(autoFetch)
  const [errorGetDatasetTemplates, setErrorGetDatasetTemplates] = useState<string | null>(null)

  const fetchDatasetTemplates = useCallback(async () => {
    setIsLoadingDatasetTemplates(true)
    setErrorGetDatasetTemplates(null)

    try {
      const response: Template[] = await getDatasetTemplates(
        templateRepository,
        collectionIdOrAlias
      )

      setDatasetTemplates(response)
    } catch (err) {
      if (err instanceof ReadError) {
        const error = new JSDataverseReadErrorHandler(err)
        const formattedError =
          error.getReasonWithoutStatusCode() ?? /* istanbul ignore next */ error.getErrorMessage()

        setErrorGetDatasetTemplates(formattedError)
      } else {
        setErrorGetDatasetTemplates(
          'Something went wrong getting the dataset templates. Try again later.'
        )
      }
    } finally {
      setIsLoadingDatasetTemplates(false)
    }
  }, [templateRepository, collectionIdOrAlias])

  useEffect(() => {
    if (autoFetch) {
      void fetchDatasetTemplates()
    }
  }, [autoFetch, fetchDatasetTemplates])

  return {
    datasetTemplates,
    isLoadingDatasetTemplates,
    errorGetDatasetTemplates,
    fetchDatasetTemplates
  }
}
