import type { Preview } from '@storybook/react'
import '../src/assets/styles/index.scss'
import DocumentationTemplate from '../src/stories/ui/DocumentationTemplate.mdx'

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
  }
}

export default preview
