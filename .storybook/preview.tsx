import type { Preview } from '@storybook/react'
import { ThemeProvider } from '@iqss/dataverse-design-system'
import { initialize, mswDecorator } from 'msw-storybook-addon'

/*
 * Initializes MSW
 * See https://github.com/mswjs/msw-storybook-addon#configuring-msw
 * to learn how to customize it
 */
initialize()

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/
      }
    }
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
    mswDecorator
  ]
}

export default preview
