import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { toast } from 'react-toastify'
import { TemplateRepository } from '@/templates/domain/repositories/TemplateRepository'
import { setTemplateAsDefault } from '@/templates/domain/useCases/setTemplateAsDefault'
import { unsetTemplateAsDefault } from '@/templates/domain/useCases/unsetTemplateAsDefault'
import { JSDataverseWriteErrorHandler } from '@/shared/helpers/JSDataverseWriteErrorHandler'

interface UseSetTemplateAsDefaultProps {
  collectionId: string
  templateRepository: TemplateRepository
}

interface UseSetTemplateAsDefaultResult {
  handleSetTemplateAsDefault: (templateId: number) => Promise<boolean>
  handleUnsetTemplateAsDefault: () => Promise<boolean>
  isSettingDefault: boolean
}

export const useSetTemplateAsDefault = ({
  collectionId,
  templateRepository
}: UseSetTemplateAsDefaultProps): UseSetTemplateAsDefaultResult => {
  const { t } = useTranslation('datasetTemplates')
  const [isSettingDefault, setIsSettingDefault] = useState(false)

  const handleSetTemplateAsDefault = useCallback(
    async (templateId: number) => {
      setIsSettingDefault(true)

      try {
        await setTemplateAsDefault(templateRepository, templateId, collectionId)
        toast.success(t('alerts.setDefaultSuccess'))
        return true
      } catch (error) {
        if (error instanceof WriteError) {
          const handler = new JSDataverseWriteErrorHandler(error)
          const reason = handler.getReasonWithoutStatusCode() ?? handler.getErrorMessage()
          toast.error(reason)
        } else {
          toast.error(t('alerts.setDefaultError'))
        }
        return false
      } finally {
        setIsSettingDefault(false)
      }
    },
    [collectionId, t, templateRepository]
  )

  const handleUnsetTemplateAsDefault = useCallback(async () => {
    setIsSettingDefault(true)

    try {
      await unsetTemplateAsDefault(templateRepository, collectionId)
      toast.success(t('alerts.unsetDefaultSuccess'))
      return true
    } catch (error) {
      if (error instanceof WriteError) {
        const handler = new JSDataverseWriteErrorHandler(error)
        const reason = handler.getReasonWithoutStatusCode() ?? handler.getErrorMessage()
        toast.error(reason)
      } else {
        toast.error(t('alerts.unsetDefaultError'))
      }
      return false
    } finally {
      setIsSettingDefault(false)
    }
  }, [collectionId, t, templateRepository])

  return { handleSetTemplateAsDefault, handleUnsetTemplateAsDefault, isSettingDefault }
}
