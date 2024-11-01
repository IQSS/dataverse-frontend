import { useTranslation } from 'react-i18next'
import { Tabs } from '@iqss/dataverse-design-system'
import { AccountHelper, AccountPanelTabKey } from './AccountHelper'
import { ApiTokenSection } from './api-token-section/ApiTokenSection'
import styles from './Account.module.scss'

const tabsKeys = AccountHelper.ACCOUNT_PANEL_TABS_KEYS

interface AccountProps {
  defaultActiveTabKey: AccountPanelTabKey
}

export const Account = ({ defaultActiveTabKey }: AccountProps) => {
  const { t } = useTranslation('account')

  return (
    <section>
      <header className={styles['header']}>
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
