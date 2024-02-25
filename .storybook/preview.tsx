import type { Preview } from '@storybook/react'
import { ThemeProvider } from '@iqss/dataverse-design-system'
import { MemoryRouter } from 'react-router-dom'
import { faker } from '@faker-js/faker'
import { FakerHelper } from '../tests/component/shared/FakerHelper'

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
