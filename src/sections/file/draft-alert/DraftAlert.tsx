import { Trans, useTranslation } from 'react-i18next'
import { Alert } from '@iqss/dataverse-design-system'
import { Route } from '@/sections/Route.enum'
import { LinkToPage } from '@/sections/shared/link-to-page/LinkToPage'
import { DvObjectType } from '@/shared/hierarchy/domain/models/UpwardHierarchyNode'
import {
  DatasetNonNumericVersionSearchParam,
  DatasetPublishingStatus,
  DatasetVersion
} from '@/dataset/domain/models/Dataset'

interface FileProps {
  datasetPersistentId: string
  datasetVersion: DatasetVersion
}
export const DraftAlert = ({ datasetPersistentId, datasetVersion }: FileProps) => {
  const { t } = useTranslation('file')

  if (datasetVersion.publishingStatus !== DatasetPublishingStatus.DRAFT) return null

  return (
    <Alert customHeading={t('alerts.draftVersion.heading')} variant="warning" dismissible={false}>
      <Trans
        t={t}
        i18nKey="alerts.draftVersion.alertText"
        components={{
          a: (
            <LinkToPage
              type={DvObjectType.DATASET}
              page={Route.DATASETS}
              searchParams={{
                persistentId: datasetPersistentId,
                ...(datasetVersion.publishingStatus === DatasetPublishingStatus.DRAFT && {
                  version: DatasetNonNumericVersionSearchParam.DRAFT
                })
              }}
            />
          )
        }}
      />
    </Alert>
  )
}
