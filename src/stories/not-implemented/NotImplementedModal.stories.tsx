import { Meta, StoryObj } from '@storybook/react'
import { NotImplementedModal } from '../../sections/not-implemented/NotImplementedModal'
import { Button } from '@iqss/dataverse-design-system'
import { useNotImplementedModal } from '../../sections/not-implemented/NotImplementedModalContext'
import { WithNotImplementedModal } from '../WithNotImplementedModal'

const meta: Meta<typeof NotImplementedModal> = {
  title: 'Sections/NotImplementedModal',
  component: NotImplementedModal,
  decorators: [WithNotImplementedModal]
}

export default meta

type Story = StoryObj<typeof NotImplementedModal>

function DefaultExample() {
  const { showModal, hideModal, isModalOpen } = useNotImplementedModal()
  return (
    <>
      <Button onClick={showModal}>Launch demo modal</Button>

      <NotImplementedModal show={isModalOpen} handleClose={hideModal} />
    </>
  )
}

export const Default: Story = {
  render: () => DefaultExample()
}
