import { useState } from 'react'
import { Guestbook } from '@/guestbooks/domain/models/Guestbook'
import { GuestbookActionButtons } from '@/sections/guestbooks/action-buttons/GuestbookActionButtons'
import { PreviewGuestbookModal } from '@/sections/guestbooks/preview-modal/PreviewGuestbookModal'

const guestbook: Guestbook = {
  id: 10,
  name: 'Downloadable Guestbook',
  enabled: true,
  emailRequired: true,
  nameRequired: true,
  institutionRequired: false,
  positionRequired: false,
  customQuestions: [
    {
      question: 'How will you use this data?',
      required: true,
      displayOrder: 1,
      type: 'text',
      hidden: false
    }
  ],
  createTime: '2026-01-01T00:00:00.000Z',
  dataverseId: 17
}

const GuestbookActionButtonsTestWrapper = ({
  isEnabled = true,
  isTogglingEnabled = false,
  isDownloadingResponses = false,
  onToggleEnabled = () => {},
  onDownloadResponses = () => {}
}: {
  isEnabled?: boolean
  isTogglingEnabled?: boolean
  isDownloadingResponses?: boolean
  onToggleEnabled?: () => void
  onDownloadResponses?: () => void
}) => {
  const [showPreview, setShowPreview] = useState(false)

  return (
    <>
      <GuestbookActionButtons
        isEnabled={isEnabled}
        onView={() => setShowPreview(true)}
        onToggleEnabled={onToggleEnabled}
        isTogglingEnabled={isTogglingEnabled}
        onDownloadResponses={onDownloadResponses}
        isDownloadingResponses={isDownloadingResponses}
      />
      <PreviewGuestbookModal
        show={showPreview}
        handleClose={() => setShowPreview(false)}
        guestbook={guestbook}
      />
    </>
  )
}

describe('GuestbookActionButtons', () => {
  it('renders Disable when guestbook is enabled and triggers toggle handler', () => {
    const onToggleEnabled = cy.stub().as('onToggleEnabled')

    cy.customMount(<GuestbookActionButtonsTestWrapper onToggleEnabled={onToggleEnabled} />)

    cy.findByRole('button', { name: 'Disable' }).click()
    cy.get('@onToggleEnabled').should('have.been.calledOnce')
  })

  it('renders Enable when guestbook is disabled', () => {
    cy.customMount(<GuestbookActionButtonsTestWrapper isEnabled={false} />)

    cy.findByRole('button', { name: 'Enable' }).should('exist')
  })

  it('opens and closes the preview guestbook modal from the view button', () => {
    cy.customMount(<GuestbookActionButtonsTestWrapper />)

    cy.findByRole('button', { name: 'View' }).click()
    cy.findByRole('dialog').should('be.visible')
    cy.findByText('Preview Guestbook').should('exist')
    cy.findByText('Downloadable Guestbook').should('exist')
    cy.findByText(/How will you use this data\?/).should('exist')
    cy.findByText('Close').click()
    cy.findByRole('dialog').should('not.exist')
  })

  it('triggers download handler', () => {
    const onDownloadResponses = cy.stub().as('onDownloadResponses')

    cy.customMount(<GuestbookActionButtonsTestWrapper onDownloadResponses={onDownloadResponses} />)

    cy.findByRole('button', { name: 'Download responses' }).click()
    cy.get('@onDownloadResponses').should('have.been.calledOnce')
  })

  it('opens the not implemented modal from copy, edit, and view responses buttons', () => {
    cy.customMount(<GuestbookActionButtonsTestWrapper />)

    cy.findByRole('button', { name: 'Copy' }).click()
    cy.findByText('Not Implemented').should('exist')
    cy.findByText(/This feature is not implemented yet in the Modern version./i).should('exist')
    cy.findByText('Close').click()
    cy.findByText('Not Implemented').should('not.exist')

    cy.findByRole('button', { name: 'Edit' }).click()
    cy.findByText('Not Implemented').should('exist')
    cy.findByText('Close').click()
    cy.findByText('Not Implemented').should('not.exist')

    cy.findByRole('button', { name: 'View Responses' }).click()
    cy.findByText('Not Implemented').should('exist')
  })

  it('keeps toggle and download buttons enabled when loading flags are false', () => {
    cy.customMount(
      <GuestbookActionButtonsTestWrapper isTogglingEnabled={false} isDownloadingResponses={false} />
    )

    cy.findByRole('button', { name: 'Disable' }).should('not.be.disabled')
    cy.findByRole('button', { name: 'Download responses' }).should('not.be.disabled')
  })

  it('disables toggle and download buttons while actions are in progress', () => {
    cy.customMount(
      <GuestbookActionButtonsTestWrapper isTogglingEnabled={true} isDownloadingResponses={true} />
    )

    cy.findByRole('button', { name: 'Disable' }).should('be.disabled')
    cy.findByRole('button', { name: 'Download responses' }).should('be.disabled')
  })
})
