import type { Preview } from '@storybook/react'
import { ThemeProvider } from '@iqss/dataverse-design-system'
import { MemoryRouter } from 'react-router-dom'
import { faker } from '@faker-js/faker'




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
      if (import.meta.env.STORYBOOK_USE_FAKER_SEED === 'true' ) {
        faker.seed(123) // Use a specific seed during Chromatic runs
      }return (
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
