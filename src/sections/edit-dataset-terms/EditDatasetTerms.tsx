import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Accordion, Tabs } from '@iqss/dataverse-design-system'
import { EditDatasetTermsHelper, EditDatasetTermsTabKey } from './EditDatasetTermsHelper'
import { useLoading } from '../../shared/contexts/loading/LoadingContext'
import { EditLicenseAndTerms } from './edit-license-and-terms/EditLicenseAndTerms'
import { EditTermsOfAccess } from './edit-terms-of-access/EditTermsOfAccess'
import { LicenseRepository } from '../../licenses/domain/repositories/LicenseRepository'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { EditGuestbook } from './edit-guestbook/EditGuestbook'
import { GuestbookRepository } from '@/guestbooks/domain/repositories/GuestbookRepository'
import { useDataset } from '../dataset/DatasetContext'
import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'
import { NotFoundPage } from '../not-found-page/NotFoundPage'
import { AppLoader } from '../shared/layout/app-loader/AppLoader'
import { useMediaQuery } from '@/shared/hooks/useMediaQuery'
import { ConfirmLeaveModal } from './confirm-leave-modal/ConfirmLeaveModal'
import styles from './EditDatasetTerms.module.scss'

const tabsKeys = EditDatasetTermsHelper.EDIT_DATASET_TERMS_TABS_KEYS

interface EditDatasetTermsProps {
  defaultActiveTabKey: EditDatasetTermsTabKey
  licenseRepository: LicenseRepository
  datasetRepository: DatasetRepository
  guestbookRepository: GuestbookRepository
}

export const EditDatasetTerms = ({
  defaultActiveTabKey,
  licenseRepository,
  datasetRepository,
  guestbookRepository
}: EditDatasetTermsProps) => {
  const { t } = useTranslation('dataset')
  const [activeKey, setActiveKey] = useState<string>(defaultActiveTabKey)
  const { dataset, isLoading } = useDataset()
  const { setIsLoading } = useLoading()
  const isMobile = useMediaQuery('(max-width: 576px)')

  const [showUnsavedChangesModal, setShowUnsavedChangesModal] = useState(false)
  const [pendingTabKey, setPendingTabKey] = useState<string | null>(null)

  const [licenseFormIsDirty, setLicenseFormIsDirty] = useState(false)
  const [termsOfAccessFormIsDirty, setTermsOfAccessFormIsDirty] = useState(false)
  const [guestbookFormIsDirty, setGuestbookFormIsDirty] = useState(false)

  useEffect(() => {
    setIsLoading(isLoading)
  }, [isLoading, setIsLoading])

  if (isLoading) {
    return <AppLoader />
  }

  if (!dataset) {
    return <NotFoundPage dvObjectNotFoundType="dataset" />
  }

  const getCurrentFormDirtyState = (): boolean => {
    switch (activeKey) {
      case tabsKeys.datasetTerms:
        return licenseFormIsDirty
      case tabsKeys.restrictedFilesTerms:
        return termsOfAccessFormIsDirty
      case tabsKeys.guestbook:
        return guestbookFormIsDirty
      default:
        return false
    }
  }

  const handleModalDiscardChanges = () => {
    setShowUnsavedChangesModal(false)
    if (pendingTabKey) {
      setActiveKey(pendingTabKey)
    }
    setPendingTabKey(null)
  }

  const handleModalKeepEditing = () => {
    setShowUnsavedChangesModal(false)
    setPendingTabKey(null)
  }

  const updateTabOnSelect = (keySelected: string | null) => {
    if (!keySelected || keySelected === activeKey) return

    if (getCurrentFormDirtyState()) {
      setPendingTabKey(keySelected)
      setShowUnsavedChangesModal(true)
    } else {
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
        <Accordion defaultActiveKey={[tabsKeys.datasetTerms]}>
          <Accordion.Item eventKey={tabsKeys.datasetTerms}>
            <Accordion.Header>{t('editTerms.tabs.datasetTerms')}</Accordion.Header>
            <Accordion.Body>
              <div className={styles['tab-container']}>
                <EditLicenseAndTerms
                  licenseRepository={licenseRepository}
                  datasetRepository={datasetRepository}
                  onFormStateChange={setLicenseFormIsDirty}
                />
              </div>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey={tabsKeys.restrictedFilesTerms}>
            <Accordion.Header>{t('editTerms.tabs.restrictedFilesTerms')}</Accordion.Header>
            <Accordion.Body>
              <div className={styles['tab-container']}>
                <EditTermsOfAccess
                  datasetRepository={datasetRepository}
                  onFormStateChange={setTermsOfAccessFormIsDirty}
                />
              </div>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey={tabsKeys.guestbook}>
            <Accordion.Header>{t('editTerms.tabs.guestbook')}</Accordion.Header>
            <Accordion.Body>
              <div className={styles['tab-container']}>
                <EditGuestbook
                  guestbookRepository={guestbookRepository}
                  onFormStateChange={setGuestbookFormIsDirty}
                />
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      ) : (
        <Tabs activeKey={activeKey} onSelect={updateTabOnSelect}>
          <Tabs.Tab eventKey={tabsKeys.datasetTerms} title={t('editTerms.tabs.datasetTerms')}>
            <div className={styles['tab-container']}>
              <EditLicenseAndTerms
                licenseRepository={licenseRepository}
                datasetRepository={datasetRepository}
                onFormStateChange={setLicenseFormIsDirty}
              />
            </div>
          </Tabs.Tab>

          <Tabs.Tab
            eventKey={tabsKeys.restrictedFilesTerms}
            title={t('editTerms.tabs.restrictedFilesTerms')}>
            <div className={styles['tab-container']}>
              <EditTermsOfAccess
                datasetRepository={datasetRepository}
                onFormStateChange={setTermsOfAccessFormIsDirty}
              />
            </div>
          </Tabs.Tab>

          <Tabs.Tab eventKey={tabsKeys.guestbook} title={t('editTerms.tabs.guestbook')}>
            <div className={styles['tab-container']}>
              <EditGuestbook
                guestbookRepository={guestbookRepository}
                onFormStateChange={setGuestbookFormIsDirty}
              />
            </div>
          </Tabs.Tab>
        </Tabs>
      )}

      <ConfirmLeaveModal
        show={showUnsavedChangesModal}
        onStay={handleModalKeepEditing}
        onLeave={handleModalDiscardChanges}
      />
    </section>
  )
}
