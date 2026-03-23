/* eslint-disable @typescript-eslint/no-unused-vars */
import { i18nBuilder } from 'keycloakify/login'
import type { ThemeName } from '../kc.gen'

/** @see: https://docs.keycloakify.dev/features/i18n */
const { useI18n, ofTypeI18n } = i18nBuilder
  .withThemeName<ThemeName>()
  .withCustomTranslations({
    en: {
      signInNoticeTitle: 'Note about ORCID, GitHub, and Google sign-in:',
      signInNoticeBodyPrefix:
        'These options are available only to the existing accounts that previously authenticated with these methods. New sign-ups via ORCID, GitHub, or Google are not supported. Please use your Harvard Login or Username/Email to ',
      signInNoticeSignUpLinkText: 'sign up in Harvard Dataverse'
    }
  })
  .build()

type I18n = typeof ofTypeI18n

export { useI18n, type I18n }
