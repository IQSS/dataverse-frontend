import { Accordion, Col, Row } from '@iqss/dataverse-design-system'
import { DatasetLicense, DatasetTermsOfUse } from '../../../dataset/domain/models/Dataset'
import { License } from '@/sections/dataset/dataset-summary/License'
import { EditDatasetTermsButton } from '@/sections/dataset/dataset-terms/EditDatasetTermsButton'
import { useTranslation } from 'react-i18next'
import { QuestionMarkTooltip } from '@iqss/dataverse-design-system'
import styles from '@/sections/dataset/dataset-terms/DatasetTerms.module.scss'

interface DatasetTermsProps {
  license: DatasetLicense
  termsOfUse: DatasetTermsOfUse
  numberOfRestrictedFiles: number
}
/*
 dataAccessPlace?: string
  originalArchive?: string
  availabilityStatus?: string
  contactForAccess?: string
  sizeOfCollection?: string
  studyCompletion?: string
 */
export function DatasetTerms({ license, termsOfUse }: DatasetTermsProps) {
  const { t } = useTranslation('dataset')
  return (
    <>
      <div className={styles['edit-terms-button-container']}>
        <EditDatasetTermsButton />
      </div>
      <Accordion defaultActiveKey={['0']} alwaysOpen={true}>
        <Accordion.Item eventKey={'0'}>
          <Accordion.Header>{t('termsTab.licenseTitle')}</Accordion.Header>
          <Accordion.Body>
            <License license={license} />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey={'1'}>
          <Accordion.Header>{t('termsTab.termsTitle')}</Accordion.Header>
          <Accordion.Body>
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
      </Accordion>
    </>
  )
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
