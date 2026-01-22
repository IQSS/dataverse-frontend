import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ReadError, WriteError } from '@iqss/dataverse-client-javascript'
import { toast } from 'react-toastify'
import { TemplateRepository } from '@/templates/domain/repositories/TemplateRepository'
import { MetadataBlockInfoRepository } from '@/metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { type MetadataField } from '@/metadata-block-info/domain/models/MetadataBlockInfo'
import { getTemplate } from '@/templates/domain/useCases/getTemplate'
import { createTemplate } from '@/templates/domain/useCases/createTemplate'
import { getMetadataBlockInfoByCollectionId } from '@/metadata-block-info/domain/useCases/getMetadataBlockInfoByCollectionId'
import { MetadataFieldsHelper } from '@/sections/shared/form/DatasetMetadataForm/MetadataFieldsHelper'
import { TemplateInfo } from '@/templates/domain/models/TemplateInfo'
import { JSDataverseReadErrorHandler } from '@/shared/helpers/JSDataverseReadErrorHandler'
import { JSDataverseWriteErrorHandler } from '@/shared/helpers/JSDataverseWriteErrorHandler'
import { type DatasetMetadataFieldsDTO } from '@/dataset/domain/useCases/DTOs/DatasetDTO'
import { type DatasetMetadataFields } from '@/dataset/domain/models/Dataset'

interface UseCopyTemplateProps {
  collectionId: string
  templateRepository: TemplateRepository
  metadataBlockInfoRepository: MetadataBlockInfoRepository
}

interface CopyTemplateResult {
  copyTemplate: (templateId: number) => Promise<boolean>
  isCopyingTemplate: boolean
  errorCopyTemplate: string | null
}

const toDatasetMetadataFieldsDTO = (fields: DatasetMetadataFields): DatasetMetadataFieldsDTO => {
  const sanitized: DatasetMetadataFieldsDTO = {}
  Object.entries(fields).forEach(([key, value]) => {
    sanitized[key] = value as DatasetMetadataFieldsDTO[typeof key]
  })
  return sanitized
}

export const useCopyTemplate = ({
  collectionId,
  templateRepository,
  metadataBlockInfoRepository
}: UseCopyTemplateProps): CopyTemplateResult => {
  const { t } = useTranslation('datasetTemplates')
  const [isCopyingTemplate, setIsCopyingTemplate] = useState(false)
  const [errorCopyTemplate, setErrorCopyTemplate] = useState<string | null>(null)

  const copyTemplate = useCallback(
    async (templateId: number) => {
      setIsCopyingTemplate(true)
      setErrorCopyTemplate(null)

      try {
        const template = await getTemplate(templateRepository, templateId)
        const metadataBlocksInfo = await getMetadataBlockInfoByCollectionId(
          metadataBlockInfoRepository,
          collectionId
        )

        const metadataFieldsForMapping = metadataBlocksInfo.reduce<
          Record<string, Record<string, MetadataField>>
        >((acc, block) => {
          acc[block.name] = block.metadataFields ?? {}
          return acc
        }, {})

        const templateFields =
          template.datasetMetadataBlocks?.flatMap((metadataBlock) =>
            MetadataFieldsHelper.buildTemplateFieldsFromMetadataValues(
              toDatasetMetadataFieldsDTO(metadataBlock.fields),
              metadataFieldsForMapping[metadataBlock.name] ?? {}
            )
          ) ?? []

        const templatePayload: TemplateInfo = {
          name: t('copyNamePrefix', { name: template.name }),
          isDefault: template.isDefault,
          fields: templateFields,
          instructions: template.instructions
        }

        await createTemplate(templateRepository, templatePayload, collectionId)

        toast.success(t('alerts.copySuccess'))
        return true
      } catch (error) {
        if (error instanceof ReadError) {
          const handler = new JSDataverseReadErrorHandler(error)
          setErrorCopyTemplate(
            handler.getReasonWithoutStatusCode() ??
              /* istanbul ignore next */ handler.getErrorMessage()
          )
        } else if (error instanceof WriteError) {
          const handler = new JSDataverseWriteErrorHandler(error)
          setErrorCopyTemplate(
            handler.getReasonWithoutStatusCode() ??
              /* istanbul ignore next */ handler.getErrorMessage()
          )
        } else if (error instanceof Error && error.message) {
          setErrorCopyTemplate(error.message)
        } else {
          setErrorCopyTemplate(t('alerts.copyError'))
        }

        toast.error(t('alerts.copyError'))
        return false
      } finally {
        setIsCopyingTemplate(false)
      }
    },
    [collectionId, metadataBlockInfoRepository, t, templateRepository]
  )

  return { copyTemplate, isCopyingTemplate, errorCopyTemplate }
}
