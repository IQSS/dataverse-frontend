import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { Tabs } from '@iqss/dataverse-design-system'
import { AccountHelper } from './AccountHelper'
import { ApiTokenSection } from './ApiTokenSection/ApiTokenSection'
import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'
import { UpwardHierarchyNodeMother } from '../../../tests/component/shared/hierarchy/domain/models/UpwardHierarchyNodeMother'
import styles from './Account.module.scss'

const tabsKeys = AccountHelper.ACCOUNT_PANEL_TABS_KEYS

export const Account = () => {
  const { t } = useTranslation('account')
  const [searchParams] = useSearchParams()
  const defaultActiveTabKey = AccountHelper.defineSelectedTabKey(searchParams)

  const rootHierarchy = UpwardHierarchyNodeMother.createCollection({
    name: 'Root',
    id: 'root'
  })

  return (
    <section>
      <BreadcrumbsGenerator hierarchy={rootHierarchy} withActionItem actionItemText="Account" />

      <header>
        <h1>{t('pageTitle')}</h1>
      </header>

      <Tabs defaultActiveKey={defaultActiveTabKey}>
        <Tabs.Tab eventKey={tabsKeys.myData} title={t('tabs.myData')}>
          <div className={styles['tab-container']}>My Data here.</div>
        </Tabs.Tab>
        <Tabs.Tab eventKey={tabsKeys.notifications} title={t('tabs.notifications')}>
          <div className={styles['tab-container']}>Notifications here.</div>
        </Tabs.Tab>
        <Tabs.Tab eventKey={tabsKeys.accountInformation} title={t('tabs.accountInformation')}>
          <div className={styles['tab-container']}>Account Information.</div>
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
