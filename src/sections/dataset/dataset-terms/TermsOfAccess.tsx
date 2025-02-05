import { useTranslation } from 'react-i18next'
import { DatasetTermsRow } from './DatasetTermsRow'
import { FilesCountInfo } from '@/files/domain/models/FilesCountInfo'
import { TermsOfAccess as TermsOfAccessModel } from '@/dataset/domain/models/Dataset'
interface TermsOfAccessProps {
  termsOfAccess: TermsOfAccessModel
  filesCountInfo: FilesCountInfo | undefined
  restrictedFilesCount: number
}

export function TermsOfAccess({
  termsOfAccess,
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
            value={termsOfAccess.termsOfAccessForRestrictedFiles}
          />
          <DatasetTermsRow
            title={t('termsTab.requestAccess')}
            tooltipMessage={t('termsTab.requestAccessTip')}
            value={
              termsOfAccess.fileAccessRequest
                ? t('termsTab.requestAccessTrue')
                : t('termsTab.requestAccessFalse')
            }
          />
        </>
      )}
      <DatasetTermsRow
        title={t('termsTab.dataAccessPlace')}
        tooltipMessage={t('termsTab.dataAccessPlaceTip')}
        value={termsOfAccess.dataAccessPlace}
      />
      <DatasetTermsRow
        title={t('termsTab.originalArchive')}
        tooltipMessage={t('termsTab.originalArchiveTip')}
        value={termsOfAccess.originalArchive}
      />
      <DatasetTermsRow
        title={t('termsTab.availabilityStatus')}
        tooltipMessage={t('termsTab.availabilityStatusTip')}
        value={termsOfAccess.availabilityStatus}
      />
      <DatasetTermsRow
        title={t('termsTab.contactForAccess')}
        tooltipMessage={t('termsTab.contactForAccessTip')}
        value={termsOfAccess.contactForAccess}
      />
      <DatasetTermsRow
        title={t('termsTab.sizeOfCollection')}
        tooltipMessage={t('termsTab.sizeOfCollectionTip')}
        value={termsOfAccess.sizeOfCollection}
      />
      <DatasetTermsRow
        title={t('termsTab.studyCompletion')}
        tooltipMessage={t('termsTab.studyCompletionTip')}
        value={termsOfAccess.studyCompletion}
      />
    </>
  )
}
