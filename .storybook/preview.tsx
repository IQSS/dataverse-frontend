import React from 'react'
import type { Preview } from '@storybook/react'
import { ThemeProvider } from '@iqss/dataverse-design-system'
import { createBrowserRouter, RouteObject, RouterProvider } from 'react-router-dom'
import { FakerHelper } from '../tests/component/shared/FakerHelper'
import { ExternalToolsProvider } from '../src/shared/contexts/external-tools/ExternalToolsProvider'
import { ExternalToolsEmptyMockRepository } from '../src/stories/shared-mock-repositories/externalTools/ExternalToolsMockRepository'
import 'react-loading-skeleton/dist/skeleton.css'
import '../src/assets/global.scss'
import '../src/assets/swal-custom.scss'
import '../src/assets/react-toastify-custom.scss'
import { initAppConfig } from '../src/config'

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
      const result = initAppConfig()
      if (!result.ok) {
        console.error('Storybook runtime config invalid/missing:', result.message)
      }

      FakerHelper.setFakerSeed()

      const routes: RouteObject[] = [
        {
          element: <Story />,
          path: '/*'
        }
      ]
      const browserRouter = createBrowserRouter(routes)

      return (
        <ThemeProvider>
          <ExternalToolsProvider externalToolsRepository={new ExternalToolsEmptyMockRepository()}>
            <RouterProvider router={browserRouter} />
          </ExternalToolsProvider>
        </ThemeProvider>
      )
    }
  ]
}

export default preview
