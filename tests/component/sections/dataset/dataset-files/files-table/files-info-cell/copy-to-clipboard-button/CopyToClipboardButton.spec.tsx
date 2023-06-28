import { CopyToClipboardButton } from '../../../../../../../../src/sections/dataset/dataset-files/files-table/file-info-cell/copy-to-clipboard-button/CopyToClipboardButton'

describe('CopyToClipboardButton', () => {
  it('copies text to clipboard and shows success message when clicked', () => {
    const textToCopy = 'Sample text to copy'
    cy.customMount(<CopyToClipboardButton text={textToCopy} />)

    cy.window().then((win) => {
      cy.stub(win.navigator.clipboard, 'writeText').resolves()

      cy.findByRole('button', { name: 'Copy to clipboard icon' }).click()

      cy.wrap(win.navigator.clipboard.writeText).should('be.calledWith', textToCopy)

      cy.findByRole('img', { name: 'Correctly copied to clipboard icon' }).should('exist')
    })
  })

  it('shows tooltip when hovering over the button', () => {
    const textToCopy = 'Sample text to copy'
    cy.customMount(<CopyToClipboardButton text={textToCopy} />)

    cy.findByRole('button', { name: 'Copy to clipboard icon' }).trigger('mouseover')
    cy.findByText('Click to copy Sample text to copy').should('exist')
  })
})
