import { Meta, StoryObj } from '@storybook/react'
import { PreviewGuestbookModal } from '@/sections/guestbooks/preview-modal/PreviewGuestbookModal'
import { WithI18next } from '@/stories/WithI18next'
import { Guestbook } from '@/guestbooks/domain/models/Guestbook'

const mockGuestbook: Guestbook = {
  id: 3,
  name: 'Storybook Guestbook',
  enabled: true,
  nameRequired: true,
  emailRequired: true,
  institutionRequired: false,
  positionRequired: false,
  customQuestions: [
    {
      question: 'How will you use this data?',
      required: true,
      displayOrder: 1,
      type: 'text',
      hidden: false
    },
    {
      question: 'Do you plan to cite this dataset?',
      required: false,
      displayOrder: 2,
      type: 'text',
      hidden: false
    }
  ],
  createTime: '2026-01-01T00:00:00.000Z',
  dataverseId: 1
}

const meta: Meta<typeof PreviewGuestbookModal> = {
  title: 'Sections/Guestbooks/PreviewGuestbookModal',
  component: PreviewGuestbookModal,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof PreviewGuestbookModal>

export const Default: Story = {
  args: {
    show: true,
    handleClose: () => {},
    guestbook: mockGuestbook
  }
}
