import { WithI18next } from '@/stories/WithI18next'
import { Meta, StoryObj } from '@storybook/react'
import { ConfirmLeaveModal } from '@/sections/shared/file-uploader/confirm-leave-modal/ConfirmLeaveModal'
import { OperationType } from '@/sections/shared/file-uploader/FileUploader'
import { WithFileUploaderContext } from './WithFileUploaderContext'

const meta: Meta<typeof ConfirmLeaveModal> = {
  title: 'Sections/Shared/File Uploader/Confirm Leave Modal',
  component: ConfirmLeaveModal,
  decorators: [WithI18next],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}

export default meta
type Story = StoryObj<typeof ConfirmLeaveModal>

export const Default: Story = {
  render: () => (
    <WithFileUploaderContext mode={OperationType.REPLACE_FILE}>
      <ConfirmLeaveModal show onLeave={() => {}} onStay={() => {}} />
    </WithFileUploaderContext>
  )
}
