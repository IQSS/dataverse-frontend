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
import { CustomTerms } from '@/sections/dataset/dataset-terms/CustomTerms'
import { TermsOfAccess } from '@/sections/dataset/dataset-terms/TermsOfAccess'
import { License } from '@/sections/dataset/dataset-terms/License'
import { DatasetGuestbook } from '@/sections/dataset/dataset-guestbook/DatasetGuestbook'
import { GuestbookRepository } from '@/guestbooks/domain/repositories/GuestbookRepository'

interface DatasetTermsProps {
  license: DatasetLicense | undefined
  termsOfUse: DatasetTermsOfUse
  filesRepository: FileRepository
  datasetPersistentId: string
  datasetVersion: DatasetVersion
  canUpdateDataset?: boolean
  guestbookRepository?: GuestbookRepository
}

export function DatasetTerms({
  license,
  termsOfUse,
  filesRepository,
  datasetPersistentId,
  datasetVersion,
  canUpdateDataset,
  guestbookRepository
}: DatasetTermsProps) {
  const { t } = useTranslation('dataset')
  const { filesCountInfo, isLoading } = useGetFilesCountInfo({
    filesRepository,
    datasetPersistentId,
    datasetVersion,
    includeDeaccessioned: canUpdateDataset
  })
  const restrictedFilesCount = filesCountInfo
    ? numberOfRestrictedFiles(filesCountInfo.perAccess)
    : 0
  const termsOfAccessIsEmpty = Object.values(termsOfUse.termsOfAccess).every(
    (value) => value === undefined || typeof value === 'boolean'
  )
  const displayTermsOfAccess = !termsOfAccessIsEmpty || restrictedFilesCount > 0

  if (isLoading) {
    return <SpinnerSymbol />
  }

  const defaultActiveKeys = ['0']
  if (displayTermsOfAccess) {
    defaultActiveKeys.push('1')
  }

  return (
    <>
      <EditDatasetTermsButton />
      <Accordion defaultActiveKey={defaultActiveKeys} alwaysOpen={true}>
        <Accordion.Item eventKey={'0'}>
          <Accordion.Header>{t('termsTab.licenseTitle')}</Accordion.Header>
          <Accordion.Body>
            <License license={license} />
            <CustomTerms customTerms={termsOfUse.customTerms} />
          </Accordion.Body>
        </Accordion.Item>
        {displayTermsOfAccess && (
          <Accordion.Item eventKey={'1'}>
            <Accordion.Header>{t('termsTab.termsTitle')}</Accordion.Header>
            <Accordion.Body>
              <TermsOfAccess
                termsOfAccess={termsOfUse.termsOfAccess}
                filesCountInfo={filesCountInfo}
                restrictedFilesCount={restrictedFilesCount}
              />
            </Accordion.Body>
          </Accordion.Item>
        )}
        <Accordion.Item eventKey={'2'} data-testid="dataset-terms-guestbook-accordion-item">
          <Accordion.Header data-testid="dataset-terms-guestbook-accordion-header">
            {t('termsTab.guestbookTitle')}
          </Accordion.Header>
          <Accordion.Body data-testid="dataset-terms-guestbook-accordion-body">
            <DatasetGuestbook guestbookRepository={guestbookRepository} />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  )
}

const numberOfRestrictedFiles = (fileAccessArray: FileAccessCount[]): number => {
  return fileAccessArray.find((access) => access.access === FileAccessOption.RESTRICTED)?.count || 0
}
