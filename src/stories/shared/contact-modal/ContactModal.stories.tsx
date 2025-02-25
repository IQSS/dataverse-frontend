import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import { ContactModal } from '@/sections/shared/contact/contact-modal/contact-modal'
import { ContactRepository } from '@/contact/domain/repositories/ContactRepository'

const meta: Meta<typeof ContactModal> = {
  title: 'Sections/Shared/ContactModal',
  component: ContactModal,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof ContactModal>

export const Default: Story = {
  render: () => (
    <ContactModal
      show
      title="Email Collection Contact"
      handleClose={() => {}}
      toContactName="Root"
      id="123"
      contactRepository={{} as ContactRepository}
    />
  )
}

export const ContactDataset: Story = {
  render: () => (
    <ContactModal
      show
      title="Email Dataset Contact"
      handleClose={() => {}}
      toContactName="Dataset"
      id="123"
      contactRepository={{} as ContactRepository}
    />
  )
}
