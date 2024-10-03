import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Offcanvas } from '../../components/offcanvas/Offcanvas'
import { Button } from '../../components/button/Button'

const meta: Meta<typeof Offcanvas> = {
  title: 'Offcanvas',
  component: Offcanvas,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof Offcanvas>

const OffcanvasWithTrigger = ({
  placement = 'start',
  responsive
}: {
  placement?: 'start' | 'end' | 'top' | 'bottom'
  responsive?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
}) => {
  const [show, setShow] = useState(responsive ? true : false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  return (
    <div>
      {!responsive && <Button onClick={handleShow}>Open Offcanvas</Button>}

      <Offcanvas show={show} onHide={handleClose} placement={placement} responsive={responsive}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Offcanvas Title</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {responsive ? (
            <div>
              <p>Resize your browser to show the responsive offcanvas toggle.</p>
              <p>
                Responsive offcanvas classes hide content outside the viewport from a specified
                breakpoint and down. Above that breakpoint, the contents within will behave as
                usual.
              </p>
            </div>
          ) : (
            <p>All the content goes here</p>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  )
}

export const Default: Story = {
  render: () => <OffcanvasWithTrigger />
}

export const TopPlacement: Story = {
  render: () => <OffcanvasWithTrigger placement="top" />
}

export const EndPlacement: Story = {
  render: () => <OffcanvasWithTrigger placement="end" />
}

export const BottomPlacement: Story = {
  render: () => <OffcanvasWithTrigger placement="bottom" />
}

export const Responsive: Story = {
  render: () => <OffcanvasWithTrigger placement="start" responsive="md" />
}
