import { LoadingContext } from '../sections/loading/LoadingContext'
import { StoryFn } from '@storybook/react'
import { Layout } from '../sections/layout/Layout'
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom'

export const WithLayoutLoading = (Story: StoryFn) => {
  const setIsLoading = () => {}

  return (
    <LoadingContext.Provider value={{ isLoading: true, setIsLoading }}>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/*" element={<Story />} />
          </Route>
        </Routes>
      </Router>
    </LoadingContext.Provider>
  )
}
