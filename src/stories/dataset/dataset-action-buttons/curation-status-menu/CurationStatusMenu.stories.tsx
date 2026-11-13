import { useState } from 'react'
import { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, waitFor, within } from '@storybook/test'
import { CurationStatusMenu } from '@/sections/dataset/dataset-action-buttons/curation-status-menu/CurationStatusMenu'
import { DatasetCurationStatusContext } from '@/sections/dataset/dataset-curation-status/DatasetCurationStatusContext'
import { DatasetLabels } from '@/sections/dataset/dataset-labels/DatasetLabels'
import { RepositoriesStoryProvider } from '@/stories/WithRepositories'
import { WithI18next } from '@/stories/WithI18next'
import { WithToasts } from '@/stories/WithToasts'
import {
  CurationStoryRepository,
  curationHistory
} from '../../dataset-curation-status/CurationStoryRepository'

interface CurationExampleProps {
  empty?: boolean
  readOnly?: boolean
  error?: boolean
}

function CurationExample({ empty = false, readOnly = false, error = false }: CurationExampleProps) {
  const [repository] = useState(() => {
    const repo = new CurationStoryRepository(empty ? null : curationHistory[0])
    if (error) repo.setCurationStatus = () => Promise.reject(new Error('Service unavailable'))
    return repo
  })
  const [currentStatus, setCurrentStatus] = useState(repository.current)
  return (
    <RepositoriesStoryProvider datasetRepository={repository}>
      <DatasetCurationStatusContext.Provider
        value={{
          currentStatus,
          allowedLabels: ['Author Contacted', 'Privacy Review', 'Final Approval'],
          canSeeCurationStatus: true,
          canChangeCurationStatus: !readOnly,
          refreshCurationStatus: () => setCurrentStatus(repository.current)
        }}>
        <div
          style={{ display: 'flex', justifyContent: 'space-between', minHeight: 320, padding: 24 }}>
          <DatasetLabels labels={[]} curationStatusLabel={currentStatus?.label} />
          <div>
            <CurationStatusMenu datasetId="doi:10.5072/FK2/STORY" />
          </div>
        </div>
      </DatasetCurationStatusContext.Provider>
    </RepositoriesStoryProvider>
  )
}
const meta: Meta<typeof CurationExample> = {
  tags: ['curation-workflow'],
  title: 'Sections/Dataset Page/DatasetActionButtons/CurationStatusMenu',
  component: CurationExample,
  decorators: [WithI18next, WithToasts]
}
export default meta
type Story = StoryObj<typeof CurationExample>
export const CurrentStatus: Story = {}
export const NoCurrentStatus: Story = { args: { empty: true } }
export const ReadOnly: Story = { args: { readOnly: true } }
export const ChangeStatus: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(await canvas.findByRole('button', { name: 'Curation Status' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Change Curation Status' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Final Approval' }))
    await expect(await canvas.findByText('Final Approval', { selector: 'span' })).toBeVisible()
    const toast = await within(canvasElement.ownerDocument.body).findByRole('alert')
    await Promise.all(toast.getAnimations().map((animation) => animation.finished))
  }
}
export const ChangeError: Story = {
  args: { error: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(await canvas.findByRole('button', { name: 'Curation Status' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Change Curation Status' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Final Approval' }))
    await expect(
      await within(canvasElement.ownerDocument.body).findByRole('alert')
    ).toHaveTextContent('Unable to change Curation Status')
    const toast = within(canvasElement.ownerDocument.body).getByRole('alert')
    await Promise.all(toast.getAnimations().map((animation) => animation.finished))
  }
}

export const ViewHistory: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(await canvas.findByRole('button', { name: 'Curation Status' }))
    await userEvent.click(canvas.getByRole('button', { name: 'View Curation Status History' }))
    const dialog = await within(canvasElement.ownerDocument.body).findByRole('dialog', {
      name: 'Curation Status History'
    })
    await waitFor(() => expect(dialog).toBeVisible())
  }
}
