import type { Preview } from '@storybook/react'
import { ThemeProvider } from '../src/sections/ui/theme/ThemeProvider'
import DocumentationTemplate from '../src/stories/ui/DocumentationTemplate.mdx'
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
    },
    docs: {
      page: DocumentationTemplate
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
