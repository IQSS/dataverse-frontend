import type { DeepPartial } from 'keycloakify/tools/DeepPartial'
import type { KcContext } from '../../keycloak-theme/login/KcContext'
import KcPage from '../../keycloak-theme/login/KcPage'
import { createGetKcContextMock } from 'keycloakify/login/KcContext'
import type {
  KcContextExtension,
  KcContextExtensionPerPage
} from '../../keycloak-theme/login/KcContext'
import { themeNames, kcEnvDefaults } from '../../keycloak-theme/kc.gen'

const kcContextExtension: KcContextExtension = {
  themeName: themeNames[0],
  properties: {
    ...kcEnvDefaults
  }
}
const kcContextExtensionPerPage: KcContextExtensionPerPage = {}

export const { getKcContextMock } = createGetKcContextMock({
  kcContextExtension,
  kcContextExtensionPerPage,
  overrides: {},
  overridesPerPage: {}
})

export function createKcPageStory<PageId extends KcContext['pageId']>(params: { pageId: PageId }) {
  const { pageId } = params

  function KcPageStory(props: { kcContext?: DeepPartial<Extract<KcContext, { pageId: PageId }>> }) {
    const { kcContext: overrides } = props

    const kcContextMock = getKcContextMock({
      pageId,
      overrides
    })

    return <KcPage kcContext={kcContextMock} />
  }

  return { KcPageStory }
}
