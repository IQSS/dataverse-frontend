/* eslint-disable @typescript-eslint/no-unused-vars */
import { i18nBuilder } from 'keycloakify/login'
import type { ThemeName } from '../kc.gen'

/** @see: https://docs.keycloakify.dev/features/i18n */
const { useI18n, ofTypeI18n } = i18nBuilder
  .withThemeName<ThemeName>()
  .withCustomTranslations({
    en: {
      signInNoticeTitle: 'Note',
      signInNoticeBody:
        'Please use your Username/Email or Institutional Account to sign in. Other identity providers(ORCID, GitHub, Microsoft and Google) are not supported for Dataverse SPA.'
    }
  })
  .build()

type I18n = typeof ofTypeI18n

export { useI18n, type I18n }
