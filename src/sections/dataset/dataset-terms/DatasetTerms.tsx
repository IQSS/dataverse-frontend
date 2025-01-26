import { Accordion } from '@iqss/dataverse-design-system'
import { DatasetLicense, DatasetTermsOfUse } from '../../../dataset/domain/models/Dataset'
import { License } from '@/sections/dataset/dataset-summary/License'
import { EditDatasetTermsButton } from '@/sections/dataset/dataset-terms/EditDatasetTermsButton'
import styles from '@/sections/dataset/dataset-terms/DatasetTerms.module.scss'

interface DatasetTermsProps {
  license: DatasetLicense
  termsOfUse: DatasetTermsOfUse
}
/*
{termsOfUse.termsOfAccess && <div>termsOfUse.termsOfAccess</div>}
          {termsOfUse.dataAccessPlace && <div>termsOfUse.dataAccessPlace</div>}

 */
export function DatasetTerms({ license, termsOfUse }: DatasetTermsProps) {
  return (
    <>
      <div className={styles['edit-terms-button-container']}>
        <EditDatasetTermsButton />
      </div>
      <Accordion defaultActiveKey={['0']} alwaysOpen={true}>
        <Accordion.Item eventKey={'0'}>
          <Accordion.Header>License</Accordion.Header>
          <Accordion.Body>
            <License license={license} />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey={'1'}>
          <Accordion.Header>Terms of Use</Accordion.Header>
          <Accordion.Body>
            {termsOfUse.termsOfAccess && <div>{termsOfUse.termsOfAccess}</div>}
            {termsOfUse.dataAccessPlace && <div>{termsOfUse.dataAccessPlace}</div>}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  )
}
