import { Story } from '@storybook/react'
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from '../sections/layout/Layout'

export const WithLayout = (Story: Story) => (
  <Router>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/*" element={<Story />} />
      </Route>
    </Routes>
  </Router>
)
