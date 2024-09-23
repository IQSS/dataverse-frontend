import { AccountHelper } from '../../../../src/sections/account/AccountHelper'

describe('AccountHelper', () => {
  describe('defineSelectedTabKey', () => {
    it('should return the correct tab key when a tab query param is present in the URL', () => {
      const searchParams = new URLSearchParams()
      searchParams.set(
        AccountHelper.ACCOUNT_PANEL_TAB_QUERY_KEY,
        AccountHelper.ACCOUNT_PANEL_TABS_KEYS.notifications
      )

      const result = AccountHelper.defineSelectedTabKey(searchParams)

      expect(result).to.equal(AccountHelper.ACCOUNT_PANEL_TABS_KEYS.notifications)
    })

    it('should return the my data tab key as default if the tab query param is not present in the URL', () => {
      const searchParams = new URLSearchParams()

      const result = AccountHelper.defineSelectedTabKey(searchParams)

      expect(result).to.equal(AccountHelper.ACCOUNT_PANEL_TABS_KEYS.myData)
    })
  })
})
