import { Suspense } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18next from '../i18n'
import { StoryFn } from '@storybook/react'

export const WithI18next = (Story: StoryFn) => {
  return (
    <Suspense>
      <I18nextProvider i18n={i18next}>
        <Story />
      </I18nextProvider>
    </Suspense>
  )
}
