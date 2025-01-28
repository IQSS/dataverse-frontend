import { Accordion, Col, Row } from '@iqss/dataverse-design-system'
import {
  DatasetLicense,
  DatasetTermsOfUse,
  DatasetVersion
} from '../../../dataset/domain/models/Dataset'
import { License } from '@/sections/dataset/dataset-summary/License'
import { EditDatasetTermsButton } from '@/sections/dataset/dataset-terms/EditDatasetTermsButton'
import { useTranslation } from 'react-i18next'
import { QuestionMarkTooltip } from '@iqss/dataverse-design-system'
import styles from '@/sections/dataset/dataset-terms/DatasetTerms.module.scss'
import { useGetFilesCountInfo } from '@/sections/dataset/dataset-files/useGetFilesCountInfo'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { FileAccessCount } from '@/files/domain/models/FilesCountInfo'
import { FileAccessOption } from '@/files/domain/models/FileCriteria'
import { SpinnerSymbol } from '@/sections/dataset/dataset-files/files-table/spinner-symbol/SpinnerSymbol'

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
            <License license={license} includeHelpText={true} />
          </Accordion.Body>
        </Accordion.Item>
        {!termsOfUseIsEmpty && (
          <Accordion.Item eventKey={'1'}>
            <Accordion.Header>{t('termsTab.termsTitle')}</Accordion.Header>
            <Accordion.Body>
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
                    value={termsOfUse.termsOfAccess}
                  />
                  <DatasetTermsRow
                    title={t('termsTab.requestAccess')}
                    tooltipMessage={t('termsTab.requestAccessTip')}
                    value={
                      termsOfUse.fileAccessRequest
                        ? t('termsTab.requestAccessTrue')
                        : t('termsTab.requestAccessFalse')
                    }
                  />
                </>
              )}
              <DatasetTermsRow
                title={t('termsTab.dataAccessPlace')}
                tooltipMessage={t('termsTab.dataAccessPlaceTip')}
                value={termsOfUse.dataAccessPlace}
              />
              <DatasetTermsRow
                title={t('termsTab.originalArchive')}
                tooltipMessage={t('termsTab.originalArchiveTip')}
                value={termsOfUse.originalArchive}
              />
              <DatasetTermsRow
                title={t('termsTab.availabilityStatus')}
                tooltipMessage={t('termsTab.availabilityStatusTip')}
                value={termsOfUse.availabilityStatus}
              />
              <DatasetTermsRow
                title={t('termsTab.contactForAccess')}
                tooltipMessage={t('termsTab.contactForAccessTip')}
                value={termsOfUse.contactForAccess}
              />
              <DatasetTermsRow
                title={t('termsTab.sizeOfCollection')}
                tooltipMessage={t('termsTab.sizeOfCollectionTip')}
                value={termsOfUse.sizeOfCollection}
              />
              <DatasetTermsRow
                title={t('termsTab.studyCompletion')}
                tooltipMessage={t('termsTab.studyCompletionTip')}
                value={termsOfUse.studyCompletion}
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

interface DatasetTermsRowProps {
  title: string
  tooltipMessage: string
  value: string | undefined
}

const DatasetTermsRow = ({ title, tooltipMessage, value }: DatasetTermsRowProps) => {
  if (value === undefined) {
    return null
  }

  return (
    <Row className={styles['dataset-terms-row']}>
      <Col sm={3}>
        <>
          <strong>{title} </strong>
          <QuestionMarkTooltip placement="right" message={tooltipMessage}></QuestionMarkTooltip>
        </>
      </Col>
      <Col>
        {value && (
          <div>
            {
              //TODO: handle html in value
              value
            }
          </div>
        )}
      </Col>
    </Row>
  )
}
