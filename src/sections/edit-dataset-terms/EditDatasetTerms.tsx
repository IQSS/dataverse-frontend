import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Accordion, Tabs } from '@iqss/dataverse-design-system'
import { EditDatasetTermsHelper, EditDatasetTermsTabKey } from './EditDatasetTermsHelper'
import { useLoading } from '../../shared/contexts/loading/LoadingContext'
import { DatasetTermsTab } from './dataset-terms-tab/DatasetTermsTab'
import { RestrictedFilesTab } from './restricted-files-tab/RestrictedFilesTab'
import { LicenseRepository } from '../../licenses/domain/repositories/LicenseRepository'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { GuestBookTab } from './guest-book-tab/GuestBookTab'
import { useDataset } from '../dataset/DatasetContext'
import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'
import { NotFoundPage } from '../not-found-page/NotFoundPage'
import { AppLoader } from '../shared/layout/app-loader/AppLoader'
import { DatasetLicense } from '@/dataset/domain/models/Dataset'
import styles from './EditDatasetTerms.module.scss'
import { useMediaQuery } from '@/shared/hooks/useMediaQuery'

const tabsKeys = EditDatasetTermsHelper.EDIT_DATASET_TERMS_TABS_KEYS

interface EditDatasetTermsProps {
  defaultActiveTabKey: EditDatasetTermsTabKey
  licenseRepository: LicenseRepository
  datasetRepository: DatasetRepository
}

// TODO: Remove this interface and use from model
interface CustomTermsData {
  termsOfUse: string
  confidentialityDeclaration?: string
  specialPermissions?: string
  restrictions?: string
  citationRequirements?: string
  depositorRequirements?: string
  conditions?: string
  disclaimer?: string
}

export const EditDatasetTerms = ({
  defaultActiveTabKey,
  licenseRepository,
  datasetRepository
}: EditDatasetTermsProps) => {
  const { t } = useTranslation('dataset')
  const [activeKey, setActiveKey] = useState<string>(defaultActiveTabKey)
  const { dataset, isLoading } = useDataset()
  const { setIsLoading } = useLoading()
  const isMobile = useMediaQuery('(max-width: 576px)')

  useEffect(() => {
    setIsLoading(isLoading)
  }, [isLoading, setIsLoading])

  if (isLoading) {
    return <AppLoader />
  }

  if (!dataset) {
    return <NotFoundPage dvObjectNotFoundType="dataset" />
  }

  const updateTabOnSelect = (keySelected: string | null) => {
    if (keySelected) {
      setActiveKey(keySelected)
    }
  }
  return (
    <section>
      <div style={{ margin: '1rem 1rem 0 0' }}>
        <BreadcrumbsGenerator
          hierarchy={dataset?.hierarchy}
          withActionItem
          actionItemText={t('editTerms.breadcrumbActionItem')}
        />
      </div>

      <Alert variant="info" customHeading={t('editTerms.infoAlert.heading')}>
        {t('editTerms.infoAlert.text')}
      </Alert>

      {isMobile ? (
        <Accordion defaultActiveKey={[tabsKeys.datasetTerms]} alwaysOpen={true}>
          <Accordion.Item eventKey={tabsKeys.datasetTerms}>
            <Accordion.Header>{t('editTerms.tabs.datasetTerms')}</Accordion.Header>
            <Accordion.Body>
              <div className={styles['tab-container']}>
                <DatasetTermsTab
                  licenseRepository={licenseRepository}
                  datasetRepository={datasetRepository}
                  initialLicense={
                    (dataset.license as DatasetLicense) ||
                    (dataset.termsOfUse.customTerms as CustomTermsData)
                  }
                  isInitialCustomTerms={dataset.termsOfUse.customTerms !== undefined}
                />
              </div>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey={tabsKeys.restrictedFilesTerms}>
            <Accordion.Header>{t('editTerms.tabs.restrictedFilesTerms')}</Accordion.Header>
            <Accordion.Body>
              <div className={styles['tab-container']}>
                <RestrictedFilesTab
                  datasetRepository={datasetRepository}
                  initialTermsOfAccess={dataset.termsOfUse.termsOfAccess}
                />
              </div>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey={tabsKeys.guestBook}>
            <Accordion.Header>{t('editTerms.tabs.guestBook')}</Accordion.Header>
            <Accordion.Body>
              <div className={styles['tab-container']}>
                <GuestBookTab />
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      ) : (
        <Tabs activeKey={activeKey} onSelect={updateTabOnSelect}>
          <Tabs.Tab eventKey={tabsKeys.datasetTerms} title={t('editTerms.tabs.datasetTerms')}>
            <div className={styles['tab-container']}>
              <DatasetTermsTab
                licenseRepository={licenseRepository}
                datasetRepository={datasetRepository}
                initialLicense={
                  (dataset.license as DatasetLicense) ||
                  (dataset.termsOfUse.customTerms as CustomTermsData)
                }
                isInitialCustomTerms={dataset.termsOfUse.customTerms !== undefined}
              />
            </div>
          </Tabs.Tab>

          <Tabs.Tab
            eventKey={tabsKeys.restrictedFilesTerms}
            title={t('editTerms.tabs.restrictedFilesTerms')}>
            <div className={styles['tab-container']}>
              <RestrictedFilesTab
                datasetRepository={datasetRepository}
                initialTermsOfAccess={dataset.termsOfUse.termsOfAccess}
              />
            </div>
          </Tabs.Tab>

          <Tabs.Tab
            eventKey={tabsKeys.guestBook}
            title={t('editTerms.tabs.guestBook')}
            disabled={true}>
            <div className={styles['tab-container']}>
              <GuestBookTab />
            </div>
          </Tabs.Tab>
        </Tabs>
      )}
    </section>
  )
}
