import { Meta, StoryObj } from '@storybook/react'
import { NotImplementedModal } from '../../sections/not-implemented/NotImplementedModal'

import { useState } from 'react'
import { Button } from '@iqss/dataverse-design-system'

const meta: Meta<typeof NotImplementedModal> = {
  title: 'Sections/NotImplementedModal',
  component: NotImplementedModal
}

export default meta

type Story = StoryObj<typeof NotImplementedModal>

function DefaultExample() {
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  return (
    <>
      <Button onClick={handleShow}>Launch demo modal</Button>

      <NotImplementedModal show={show} handleClose={handleClose} />
    </>
  )
}

export const Default: Story = {
  render: () => DefaultExample()
}
