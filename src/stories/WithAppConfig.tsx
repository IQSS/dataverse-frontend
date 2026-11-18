import type { Decorator } from '@storybook/react'
import { AppConfig, initAppConfig } from '@/config'

export const withAppConfig = (overrides: Partial<AppConfig>): Decorator =>
  function WithAppConfig(Story) {
    const originalConfig = window.__APP_CONFIG__
    if (originalConfig) {
      window.__APP_CONFIG__ = { ...originalConfig, ...overrides }
      initAppConfig()
      window.__APP_CONFIG__ = originalConfig
    }
    return <Story />
  }
