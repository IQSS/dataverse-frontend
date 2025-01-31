import { Accordion } from '@iqss/dataverse-design-system'
import {
  DatasetLicense,
  DatasetTermsOfUse,
  DatasetVersion
} from '../../../dataset/domain/models/Dataset'
import { EditDatasetTermsButton } from '@/sections/dataset/dataset-terms/EditDatasetTermsButton'
import { useTranslation } from 'react-i18next'
import { useGetFilesCountInfo } from '@/sections/dataset/dataset-files/useGetFilesCountInfo'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { FileAccessCount } from '@/files/domain/models/FilesCountInfo'
import { FileAccessOption } from '@/files/domain/models/FileCriteria'
import { SpinnerSymbol } from '@/sections/dataset/dataset-files/files-table/spinner-symbol/SpinnerSymbol'
import { LicenseTerms } from '@/sections/dataset/dataset-terms/LicenseTerms'
import { TermsOfAccess } from '@/sections/dataset/dataset-terms/TermsOfAccess'
import styles from '@/sections/dataset/dataset-terms/DatasetTerms.module.scss'

interface DatasetTermsProps {
  license: DatasetLicense
  termsOfUse: DatasetTermsOfUse
  filesRepository: FileRepository
  datasetPersistentId: string
  datasetVersion: DatasetVersion
}

export function DatasetTerms({
  license,
  termsOfUse,
  filesRepository,
  datasetPersistentId,
  datasetVersion
}: DatasetTermsProps) {
  const { t } = useTranslation('dataset')
  const {
    filesCountInfo,
    isLoading,
    error: errorFilesCountInfo
  } = useGetFilesCountInfo({
    filesRepository,
    datasetPersistentId,
    datasetVersion
  })
  const restrictedFilesCount = filesCountInfo
    ? numberOfRestrictedFiles(filesCountInfo.perAccess)
    : 0
  const termsOfUseIsEmpty = Object.values(termsOfUse).every(
    (value) => value === undefined || typeof value === 'boolean'
  )

  if (isLoading) {
    return <SpinnerSymbol />
  }

  return (
    <>
      <div className={styles['edit-terms-button-container']}>
        <EditDatasetTermsButton />
      </div>
      <Accordion defaultActiveKey={['0', '1']} alwaysOpen={true}>
        <Accordion.Item eventKey={'0'}>
          <Accordion.Header>{t('termsTab.licenseTitle')}</Accordion.Header>
          <Accordion.Body>
            <LicenseTerms {...termsOfUse} license={license} />
          </Accordion.Body>
        </Accordion.Item>
        {!termsOfUseIsEmpty && (
          <Accordion.Item eventKey={'1'}>
            <Accordion.Header>{t('termsTab.termsTitle')}</Accordion.Header>
            <Accordion.Body>
              <TermsOfAccess
                {...termsOfUse}
                filesCountInfo={filesCountInfo}
                restrictedFilesCount={restrictedFilesCount}
              />
            </Accordion.Body>
          </Accordion.Item>
        )}
      </Accordion>
    </>
  )
}

const numberOfRestrictedFiles = (fileAccessArray: FileAccessCount[]): number => {
  return fileAccessArray.find((access) => access.access === FileAccessOption.RESTRICTED)?.count || 0
}
