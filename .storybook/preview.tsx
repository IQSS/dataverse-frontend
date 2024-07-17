import type { Preview } from '@storybook/react'
import { ThemeProvider } from '@iqss/dataverse-design-system'
import { MemoryRouter } from 'react-router-dom'
import { FakerHelper } from '../tests/component/shared/FakerHelper'
import 'react-loading-skeleton/dist/skeleton.css'

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
    (Story) => {
      FakerHelper.setFakerSeed()
      return (
        <ThemeProvider>
          <MemoryRouter>
            <Story />
          </MemoryRouter>
        </ThemeProvider>
      )
    }
  ]
}

export default preview
