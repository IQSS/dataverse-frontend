import { useCallback, useEffect, useState } from 'react'
import { ReadError } from '@iqss/dataverse-client-javascript'
import { JSDataverseReadErrorHandler } from '@/shared/helpers/JSDataverseReadErrorHandler'
import { getTemplate } from '@/templates/domain/useCases/getTemplate'
import { TemplateRepository } from '@/templates/domain/repositories/TemplateRepository'
import { Template } from '../models/DatasetTemplate'

interface UseGetTemplateProps {
  templateRepository: TemplateRepository
  templateId: number
  autoFetch?: boolean
}

export const useGetTemplate = ({
  templateRepository,
  templateId,
  autoFetch = true
}: UseGetTemplateProps) => {
  const [template, setTemplate] = useState<Template | null>(null)
  const [isLoadingTemplate, setIsLoadingTemplate] = useState<boolean>(autoFetch)
  const [errorGetTemplate, setErrorGetTemplate] = useState<string | null>(null)

  const fetchTemplate = useCallback(async () => {
    setIsLoadingTemplate(true)
    setErrorGetTemplate(null)

    try {
      const response = await getTemplate(templateRepository, templateId)
      setTemplate(response)
    } catch (err) {
      if (err instanceof ReadError) {
        const error = new JSDataverseReadErrorHandler(err)
        const formattedError =
          error.getReasonWithoutStatusCode() ?? /* istanbul ignore next */ error.getErrorMessage()

        setErrorGetTemplate(formattedError)
      } else {
        setErrorGetTemplate('Something went wrong getting the template. Try again later.')
      }
    } finally {
      setIsLoadingTemplate(false)
    }
  }, [templateRepository, templateId])

  useEffect(() => {
    if (autoFetch) {
      void fetchTemplate()
    }
  }, [autoFetch, fetchTemplate])

  return {
    template,
    isLoadingTemplate,
    errorGetTemplate,
    fetchTemplate
  }
}
