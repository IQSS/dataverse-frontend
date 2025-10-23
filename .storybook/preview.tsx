import React from 'react'
import type { Preview } from '@storybook/react'
import { ThemeProvider } from '@iqss/dataverse-design-system'
import { createBrowserRouter, RouteObject, RouterProvider } from 'react-router-dom'
import { FakerHelper } from '../tests/component/shared/FakerHelper'
import { ExternalToolsProvider } from '../src/shared/contexts/external-tools/ExternalToolsProvider'
import { RepositoriesProvider } from '../src/shared/contexts/repositories/RepositoriesProvider'
import { ExternalToolsEmptyMockRepository } from '../src/stories/shared-mock-repositories/externalTools/ExternalToolsMockRepository'
import { CollectionMockRepository } from '../src/stories/collection/CollectionMockRepository'
import { SearchMockRepository } from '../src/stories/shared-mock-repositories/search/SearchMockRepository'
import { ContactMockRepository } from '../src/stories/shared-mock-repositories/contact/ContactMockRepository'

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
          <RepositoriesProvider
            collectionRepository={new CollectionMockRepository()}
            searchRepository={new SearchMockRepository()}
            contactRepository={new ContactMockRepository()}>
            <ExternalToolsProvider externalToolsRepository={new ExternalToolsEmptyMockRepository()}>
              <RouterProvider router={browserRouter} />
            </ExternalToolsProvider>
          </RepositoriesProvider>
        </ThemeProvider>
      )
    }
  ]
}

export default preview
