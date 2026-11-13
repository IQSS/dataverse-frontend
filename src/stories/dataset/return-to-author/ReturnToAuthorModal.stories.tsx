import { useState } from 'react'
import { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { Button } from '@iqss/dataverse-design-system'
import { ReturnToAuthorModal } from '@/sections/dataset/return-to-author/ReturnToAuthorModal'
import { DatasetContext } from '@/sections/dataset/DatasetContext'
import { DatasetMockRepository } from '../DatasetMockRepository'
import { WithI18next } from '@/stories/WithI18next'
import { WithToasts } from '@/stories/WithToasts'

const successRepository = new DatasetMockRepository()
const errorRepository = new DatasetMockRepository()
errorRepository.returnToAuthor = () => Promise.reject(new Error('Service unavailable'))
const pendingRepository = new DatasetMockRepository()
pendingRepository.returnToAuthor = () => new Promise(() => {})

function ReturnToAuthorExample(props: React.ComponentProps<typeof ReturnToAuthorModal>) {
  const [show, setShow] = useState(true)
  const [returned, setReturned] = useState(false)
  return (
    <DatasetContext.Provider
      value={{ dataset: undefined, isLoading: false, refreshDataset: () => setReturned(true) }}>
      <Button
        onClick={() => {
          setReturned(false)
          setShow(true)
        }}>
        Open Return to Author
      </Button>
      {returned && <p role="status">Dataset returned to author.</p>}
      {show && <ReturnToAuthorModal {...props} handleClose={() => setShow(false)} />}
    </DatasetContext.Provider>
  )
}

const meta: Meta<typeof ReturnToAuthorModal> = {
  tags: ['curation-workflow'],
  title: 'Sections/Dataset Page/ReturnToAuthorModal',
  component: ReturnToAuthorModal,
  decorators: [WithI18next, WithToasts],
  args: { datasetId: 'doi:10.5072/FK2/STORY', repository: successRepository },
  render: (args) => <ReturnToAuthorExample {...args} />
}
export default meta
type Story = StoryObj<typeof ReturnToAuthorModal>

export const Default: Story = {}
export const LongReason: Story = {
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body)
    const textbox = await page.findByRole('textbox', { name: 'Reason for return' })
    const originalHeight = textbox.clientHeight
    await userEvent.click(textbox)
    await userEvent.paste(
      'Please clarify the methods and provide complete documentation for each variable. '.repeat(22)
    )
    await expect(textbox.clientHeight).toBeGreaterThan(originalHeight)
  }
}
const submitReason: Story['play'] = async ({ canvasElement }) => {
  const page = within(canvasElement.ownerDocument.body)
  await userEvent.type(await page.findByRole('textbox'), 'Please add the missing data dictionary.')
  await userEvent.click(page.getByRole('button', { name: 'Continue' }))
}
export const Submitting: Story = { args: { repository: pendingRepository }, play: submitReason }
export const SubmissionError: Story = {
  args: { repository: errorRepository },
  play: async (context) => {
    await submitReason(context)
    await expect(
      await within(context.canvasElement.ownerDocument.body).findByRole('alert')
    ).toHaveTextContent('Unable to return this dataset')
  }
}
export const SuccessfulReturn: Story = {
  play: async (context) => {
    await submitReason(context)
    await expect(await within(context.canvasElement).findByRole('status')).toHaveTextContent(
      'Dataset returned to author.'
    )
    const toast = await within(context.canvasElement.ownerDocument.body).findByRole('alert')
    await Promise.all(toast.getAnimations().map((animation) => animation.finished))
  }
}
