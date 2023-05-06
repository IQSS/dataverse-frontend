import type { Meta, StoryObj } from '@storybook/react'
import { Modal } from '../../../sections/ui/modal/Modal'
import { useState } from 'react'
import { Button } from '../../../sections/ui/button/Button'

/**
 * ## Description
 * A Modal is a dialog box or pop-up window that is used to display content and require user interaction. It typically
 * appears in front of the main content of the page and requires the user to take some action before it can be dismissed.
 *
 * ## Usage guidelines
 *
 * ### Dos
 * - Use Modals to display content that requires user interaction or attention.
 * - Use Modals sparingly, only when necessary to avoid overwhelming the user with too many pop-ups.
 * - Provide a clear and concise message or call to action in the Modal.
 *
 * ### Don'ts
 * - Do not use Modals for non-essential content or information.
 * - Do not use Modals as a replacement for navigating to a new page.
 * - Do not use Modals that cannot be easily dismissed by the user.
 *
 */
const meta: Meta<typeof Modal> = {
  title: 'UI/Modal',
  component: Modal,
  tags: ['autodocs']
}

function DefaultExample(size?: 'sm' | 'lg' | 'xl') {
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  return (
    <>
      <Button onClick={handleShow}>Launch demo modal</Button>

      <Modal show={show} onHide={handleClose} size={size}>
        <Modal.Header>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>You are reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default meta
type Story = StoryObj<typeof Modal>

export const Default: Story = {
  render: () => DefaultExample()
}

export const SmallModal: Story = {
  render: () => DefaultExample('sm')
}

export const LargeModal: Story = {
  render: () => DefaultExample('lg')
}
export const ExtraLargeModal: Story = {
  render: () => DefaultExample('xl')
}
