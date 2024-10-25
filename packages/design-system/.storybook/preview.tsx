import React from 'react'
import type { Preview } from '@storybook/react'
import { ThemeProvider } from '../src/lib/components/theme/ThemeProvider'
import DocumentationTemplate from '../src/lib/stories/DocumentationTemplate.mdx'

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
    )
  ]
}

export default preview
