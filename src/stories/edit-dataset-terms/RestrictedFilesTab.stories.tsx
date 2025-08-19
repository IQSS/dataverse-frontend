import type { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../WithI18next'
import { WithLayout } from '../WithLayout'
import { RestrictedFilesTab } from '../../sections/edit-dataset-terms/restricted-files-tab/RestrictedFilesTab'

const meta: Meta<typeof RestrictedFilesTab> = {
  title: 'Sections/EditDatasetTerms/RestrictedFilesTab',
  component: RestrictedFilesTab,
  decorators: [WithI18next, WithLayout],
  parameters: {
    chromatic: { delay: 1000, pauseAnimationAtEnd: true }
  }
}

export default meta
type Story = StoryObj<typeof RestrictedFilesTab>

export const Default: Story = {
  render: () => <RestrictedFilesTab />
}

export const WithFormInteraction: Story = {
  render: () => (
    <RestrictedFilesTab
      onSave={(data) => {
        console.log('Form submitted with data:', data)
        alert('Form submitted! Check console for data.')
      }}
    />
  )
}
