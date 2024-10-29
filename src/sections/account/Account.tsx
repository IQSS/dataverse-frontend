import { useTranslation } from 'react-i18next'
import { Tabs } from '@iqss/dataverse-design-system'
import { AccountHelper, AccountPanelTabKey } from './AccountHelper'
import { ApiTokenSection } from './api-token-section/ApiTokenSection'
import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'
import { useCollection } from '@/sections/collection/useCollection'
import { useLoading } from '../loading/LoadingContext'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import styles from './Account.module.scss'
import {
  DvObjectType,
  UpwardHierarchyNode
} from '../../shared/hierarchy/domain/models/UpwardHierarchyNode'

import { useEffect } from 'react'
import { BreadcrumbsSkeleton } from '@/sections/shared/hierarchy/BreadcrumbsSkeleton'

const tabsKeys = AccountHelper.ACCOUNT_PANEL_TABS_KEYS

interface AccountProps {
  defaultActiveTabKey: AccountPanelTabKey
  collectionRepository: CollectionRepository
}

export const Account = ({ defaultActiveTabKey, collectionRepository }: AccountProps) => {
  const { t } = useTranslation('account')
  const { collection, isLoading: collectionIsLoading } = useCollection(collectionRepository)
  const { setIsLoading } = useLoading()

  useEffect(() => {
    setIsLoading(collectionIsLoading)
  }, [collectionIsLoading, setIsLoading])

  if (collectionIsLoading || !collection) {
    return <BreadcrumbsSkeleton />
  }
  const rootHierarchy = new UpwardHierarchyNode(
    collection.name,
    DvObjectType.COLLECTION,
    collection.id
  )
  return (
    <section>
      <BreadcrumbsGenerator hierarchy={rootHierarchy} withActionItem actionItemText="Account" />

      <header>
        <h1>{t('pageTitle')}</h1>
      </header>

      <Tabs defaultActiveKey={defaultActiveTabKey}>
        <Tabs.Tab eventKey={tabsKeys.myData} title={t('tabs.myData')} disabled>
          <div className={styles['tab-container']}></div>
        </Tabs.Tab>
        <Tabs.Tab eventKey={tabsKeys.notifications} title={t('tabs.notifications')} disabled>
          <div className={styles['tab-container']}></div>
        </Tabs.Tab>
        <Tabs.Tab
          eventKey={tabsKeys.accountInformation}
          title={t('tabs.accountInformation')}
          disabled>
          <div className={styles['tab-container']}></div>
        </Tabs.Tab>
        <Tabs.Tab eventKey={tabsKeys.apiToken} title={t('tabs.apiToken')}>
          <div className={styles['tab-container']}>
            <ApiTokenSection />
          </div>
        </Tabs.Tab>
      </Tabs>
    </section>
  )
}
