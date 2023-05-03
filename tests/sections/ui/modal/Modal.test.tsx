import { render, fireEvent } from '@testing-library/react'
import { Modal } from '../../../../src/sections/ui/modal/Modal'
import { vi } from 'vitest'

describe('Modal', () => {
  const onHide = vi.fn()

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders the modal with header, body and footer', () => {
    const { getByRole, getByText } = render(
      <Modal show onHide={onHide}>
        <Modal.Header>
          <Modal.Title>Modal Title</Modal.Title>
        </Modal.Header>
        <Modal.Body>Modal Body</Modal.Body>
        <Modal.Footer>
          <button>Cancel</button>
          <button>Save</button>
        </Modal.Footer>
      </Modal>
    )

    expect(getByRole('dialog')).toBeInTheDocument()
    expect(getByText('Modal Title')).toBeInTheDocument()
    expect(getByText('Modal Body')).toBeInTheDocument()
    expect(getByText('Cancel')).toBeInTheDocument()
    expect(getByText('Save')).toBeInTheDocument()
  })

  it('calls onHide when the close button is clicked', () => {
    const { getByRole } = render(
      <Modal show onHide={onHide}>
        <Modal.Header>
          <Modal.Title>Modal Title</Modal.Title>
        </Modal.Header>
        <Modal.Body>Modal Body</Modal.Body>
      </Modal>
    )

    fireEvent.click(getByRole('button', { name: 'Close' }))
    expect(onHide).toHaveBeenCalled()
  })

  it('renders the modal with a custom size', () => {
    const { getByRole } = render(
      <Modal show onHide={onHide} size="sm">
        <Modal.Header>
          <Modal.Title>Modal Title</Modal.Title>
        </Modal.Header>
        <Modal.Body>Modal Body</Modal.Body>
      </Modal>
    )

    expect(getByRole('dialog').children[0]).toHaveClass('modal-sm')
  })
})
