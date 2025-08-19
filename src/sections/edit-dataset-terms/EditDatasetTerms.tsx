import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { Alert, Breadcrumb, Tabs } from '@iqss/dataverse-design-system'
import { EditDatasetTermsHelper, EditDatasetTermsTabKey } from './EditDatasetTermsHelper'
import { useLoading } from '../loading/LoadingContext'
import { DatasetTermsTab } from './dataset-terms-tab/DatasetTermsTab'
import { RestrictedFilesTab } from './restricted-files-tab/RestrictedFilesTab'
import styles from './EditDatasetTerms.module.scss'
import { GuestBookTab } from './guest-book-tab/GuestBookTab'

const tabsKeys = EditDatasetTermsHelper.EDIT_DATASET_TERMS_TABS_KEYS

interface EditDatasetTermsProps {
  defaultActiveTabKey: EditDatasetTermsTabKey
}

export const EditDatasetTerms = ({ defaultActiveTabKey }: EditDatasetTermsProps) => {
  const { t } = useTranslation('dataset')
  const [searchParams, setSearchParams] = useSearchParams()
  const { setIsLoading } = useLoading()

  // 🔑 local state to control which tab is active
  const [activeKey, setActiveKey] = useState<string>(defaultActiveTabKey)

  useEffect(() => setIsLoading(false), [setIsLoading])

  // if query param exists, sync it with state
  useEffect(() => {
    const queryKey = searchParams.get(EditDatasetTermsHelper.EDIT_DATASET_TERMS_TAB_QUERY_KEY)
    if (queryKey && queryKey !== activeKey) {
      setActiveKey(queryKey)
    }
  }, [searchParams, activeKey])

  const updateSearchParamTabKeyOnSelect = (keySelected: string | null) => {
    if (keySelected) {
      setActiveKey(keySelected)
      setSearchParams({
        [EditDatasetTermsHelper.EDIT_DATASET_TERMS_TAB_QUERY_KEY]: keySelected
      })
    }
  }

  return (
    <section>
      <div style={{ margin: '1rem 1rem 0 0' }}>
        <Breadcrumb>
          <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
          <Breadcrumb.Item href="/dataset">Dataset Name</Breadcrumb.Item>
          <Breadcrumb.Item active>Edit Dataset Terms</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <Alert variant="info" customHeading="Edit Dataset Terms">
        Add the terms of use for this dataset to explain how to access and use your data.
      </Alert>

      <Tabs activeKey={activeKey} onSelect={updateSearchParamTabKeyOnSelect}>
        <Tabs.Tab eventKey={tabsKeys.datasetTerms} title={t('editTerms.tabs.datasetTerms')}>
          <div className={styles['tab-container']}>
            <DatasetTermsTab />
          </div>
        </Tabs.Tab>

        <Tabs.Tab
          eventKey={tabsKeys.restrictedFilesTerms}
          title={t('editTerms.tabs.restrictedFilesTerms')}>
          <div className={styles['tab-container']}>
            <RestrictedFilesTab />
          </div>
        </Tabs.Tab>

        <Tabs.Tab eventKey={tabsKeys.guestBook} title={t('editTerms.tabs.guestBook')}>
          <div className={styles['tab-container']}>
            <GuestBookTab />
          </div>
        </Tabs.Tab>
      </Tabs>
    </section>
  )
}
