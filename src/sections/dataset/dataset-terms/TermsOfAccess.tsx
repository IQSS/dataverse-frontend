import { useTranslation } from 'react-i18next'
import { DatasetTermsRow } from './DatasetTermsRow'
import { FilesCountInfo } from '@/files/domain/models/FilesCountInfo'

interface TermsOfAccessProps {
  termsOfAccess?: string | undefined
  fileAccessRequest: boolean
  dataAccessPlace?: string
  originalArchive?: string
  availabilityStatus?: string
  contactForAccess?: string
  sizeOfCollection?: string
  studyCompletion?: string
  filesCountInfo: FilesCountInfo | undefined
  restrictedFilesCount: number
}

export function TermsOfAccess({
  termsOfAccess,
  fileAccessRequest,
  dataAccessPlace,
  originalArchive,
  availabilityStatus,
  contactForAccess,
  sizeOfCollection,
  studyCompletion,
  filesCountInfo,
  restrictedFilesCount
}: TermsOfAccessProps) {
  const { t } = useTranslation('dataset')

  return (
    <>
      {filesCountInfo && restrictedFilesCount > 0 && (
        <>
          <DatasetTermsRow
            title={t('termsTab.restrictedFiles')}
            tooltipMessage={t('termsTab.restrictedFilesTip')}
            value={
              restrictedFilesCount === 1
                ? t('termsTab.restrictedFilesOne')
                : t('termsTab.restrictedFilesMany', {
                    count: restrictedFilesCount
                  })
            }
          />
          <DatasetTermsRow
            title={t('termsTab.termsOfAccess')}
            tooltipMessage={t('termsTab.termsOfAccessTip')}
            value={termsOfAccess}
          />
          <DatasetTermsRow
            title={t('termsTab.requestAccess')}
            tooltipMessage={t('termsTab.requestAccessTip')}
            value={
              fileAccessRequest ? t('termsTab.requestAccessTrue') : t('termsTab.requestAccessFalse')
            }
          />
        </>
      )}
      <DatasetTermsRow
        title={t('termsTab.dataAccessPlace')}
        tooltipMessage={t('termsTab.dataAccessPlaceTip')}
        value={dataAccessPlace}
      />
      <DatasetTermsRow
        title={t('termsTab.originalArchive')}
        tooltipMessage={t('termsTab.originalArchiveTip')}
        value={originalArchive}
      />
      <DatasetTermsRow
        title={t('termsTab.availabilityStatus')}
        tooltipMessage={t('termsTab.availabilityStatusTip')}
        value={availabilityStatus}
      />
      <DatasetTermsRow
        title={t('termsTab.contactForAccess')}
        tooltipMessage={t('termsTab.contactForAccessTip')}
        value={contactForAccess}
      />
      <DatasetTermsRow
        title={t('termsTab.sizeOfCollection')}
        tooltipMessage={t('termsTab.sizeOfCollectionTip')}
        value={sizeOfCollection}
      />
      <DatasetTermsRow
        title={t('termsTab.studyCompletion')}
        tooltipMessage={t('termsTab.studyCompletionTip')}
        value={studyCompletion}
      />
    </>
  )
}
