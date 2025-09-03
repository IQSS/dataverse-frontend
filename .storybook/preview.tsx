import React from 'react'
import type { Preview } from '@storybook/react'
import { ThemeProvider } from '@iqss/dataverse-design-system'
import { createBrowserRouter, RouteObject, RouterProvider } from 'react-router-dom'
import { FakerHelper } from '../tests/component/shared/FakerHelper'
import 'react-loading-skeleton/dist/skeleton.css'
import '../src/assets/global.scss'
import '../src/assets/swal-custom.scss'
import '../src/assets/react-toastify-custom.scss'

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

      const routes: RouteObject[] = [
        {
          element: <Story />,
          path: '/*'
        }
      ]
      const browserRouter = createBrowserRouter(routes)

      return (
        <ThemeProvider>
          <RouterProvider router={browserRouter} />
        </ThemeProvider>
      )
    }
  ]
}

export default preview
