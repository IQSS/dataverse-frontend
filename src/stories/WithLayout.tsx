import { StoryFn } from '@storybook/react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from '../sections/layout/Layout'
import { LoadingProvider } from '../sections/loading/LoadingProvider'

export const WithLayout = (Story: StoryFn) => (
  <LoadingProvider>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/*" element={<Story />} />
      </Route>
    </Routes>
  </LoadingProvider>
)
