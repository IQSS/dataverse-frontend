import { useCallback, useEffect, useState } from 'react'
import { ReadError } from '@iqss/dataverse-client-javascript'
import { JSDataverseReadErrorHandler } from '@/shared/helpers/JSDataverseReadErrorHandler'
import { getTemplatesByCollectionId } from '@/templates/domain/useCases/getTemplatesByCollectionId'
import { TemplateRepository } from '@/templates/domain/repositories/TemplateRepository'
import { Template } from '@/templates/domain/models/Template'

interface useGetTemplatesByCollectionIdProps {
  templateRepository: TemplateRepository
  collectionIdOrAlias: number | string
  autoFetch?: boolean
}

export const useGetTemplatesByCollectionId = ({
  templateRepository,
  collectionIdOrAlias
}: useGetTemplatesByCollectionIdProps) => {
  const [datasetTemplates, setDatasetTemplates] = useState<Template[]>([])
  const [isLoadingDatasetTemplates, setIsLoadingDatasetTemplates] = useState<boolean>(false)
  const [errorGetDatasetTemplates, setErrorGetDatasetTemplates] = useState<string | null>(null)

  const fetchDatasetTemplates = useCallback(async (): Promise<Template[]> => {
    setIsLoadingDatasetTemplates(true)
    setErrorGetDatasetTemplates(null)

    try {
      const response: Template[] = await getTemplatesByCollectionId(
        templateRepository,
        collectionIdOrAlias
      )

      setDatasetTemplates(response)
      return response
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
      return []
    } finally {
      setIsLoadingDatasetTemplates(false)
    }
  }, [templateRepository, collectionIdOrAlias])

  useEffect(() => {
    void fetchDatasetTemplates()
  }, [fetchDatasetTemplates])

  return {
    datasetTemplates,
    isLoadingDatasetTemplates,
    errorGetDatasetTemplates,
    fetchDatasetTemplates
  }
}
