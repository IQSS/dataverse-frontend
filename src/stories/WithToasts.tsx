import { StoryFn } from '@storybook/react'
import { ToastContainer } from 'react-toastify'

export const WithToasts = (Story: StoryFn) => {
  return (
    <>
      <Story />
      <ToastContainer position="top-right" autoClose={5000} pauseOnHover />
    </>
  )
}
