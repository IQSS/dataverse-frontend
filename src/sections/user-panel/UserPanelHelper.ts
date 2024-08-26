export class UserPanelHelper {
  static USER_PANEL_TABS_KEYS = {
    myData: 'myData',
    notifications: 'notifications',
    accountInformation: 'accountInformation',
    apiToken: 'apiToken'
  }

  static USER_PANEL_TAB_QUERY_KEY = 'tab'

  public static defineSelectedTabKey(searchParams: URLSearchParams): string {
    const tabValue = searchParams.get(this.USER_PANEL_TAB_QUERY_KEY)

    return (
      this.USER_PANEL_TABS_KEYS[tabValue as keyof typeof this.USER_PANEL_TABS_KEYS] ??
      this.USER_PANEL_TABS_KEYS.myData
    )
  }
}
