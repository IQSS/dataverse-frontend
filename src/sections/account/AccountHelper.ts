export class AccountHelper {
  static ACCOUNT_PANEL_TABS_KEYS = {
    myData: 'myData',
    notifications: 'notifications',
    accountInformation: 'accountInformation',
    apiToken: 'apiToken'
  }

  static ACCOUNT_PANEL_TAB_QUERY_KEY = 'tab'

  public static defineSelectedTabKey(searchParams: URLSearchParams): string {
    const tabValue = searchParams.get(this.ACCOUNT_PANEL_TAB_QUERY_KEY)

    return (
      this.ACCOUNT_PANEL_TABS_KEYS[tabValue as keyof typeof this.ACCOUNT_PANEL_TABS_KEYS] ??
      this.ACCOUNT_PANEL_TABS_KEYS.myData
    )
  }
}
