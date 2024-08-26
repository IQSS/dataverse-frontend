import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { Tabs } from '@iqss/dataverse-design-system'
import { UserPanelHelper } from './UserPanelHelper'
import { ApiTokenSection } from './ApiTokenSection'
import styles from './UserPanel.module.scss'

const tabsKeys = UserPanelHelper.USER_PANEL_TABS_KEYS

export const UserPanel = () => {
  const { t } = useTranslation('userPanel')
  const [searchParams] = useSearchParams()
  const defaultActiveTabKey = UserPanelHelper.defineSelectedTabKey(searchParams)

  return (
    <section>
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
