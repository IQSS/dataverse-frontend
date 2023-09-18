import { CopyToClipboardButton } from '../../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-info/file-info-cell/file-info-data/copy-to-clipboard-button/CopyToClipboardButton'

describe('CopyToClipboardButton', () => {
  it('copies text to clipboard and shows success message when clicked', () => {
    const textToCopy = 'Sample text to copy'
    cy.customMount(<CopyToClipboardButton text={textToCopy} />)

    cy.window().then((win) => {
      cy.stub(win.navigator.clipboard, 'writeText').resolves()

      cy.findByRole('button', { name: /Copy to clipboard icon/ }).click()

      // eslint-disable-next-line @typescript-eslint/unbound-method
      cy.wrap(win.navigator.clipboard.writeText).should('be.calledWith', textToCopy)

      cy.findByRole('img', { name: 'Correctly copied to clipboard icon' }).should('exist')

      cy.findByRole('img', { name: /Copy to clipboard icon/ }).should('exist')
    })
  })

  it('shows tooltip when hovering over the button', () => {
    const textToCopy = 'Sample text to copy'
    cy.customMount(<CopyToClipboardButton text={textToCopy} />)

    cy.findByRole('button', { name: /Copy to clipboard icon/ }).trigger('mouseover')
    cy.findByText('Click to copy Sample text to copy').should('exist')
  })

  it('truncates text when it is too long', () => {
    const textToCopy = '0187a54071542738aa47939e8218e5f2'
    cy.customMount(<CopyToClipboardButton text={textToCopy} />)

    cy.findByText('018...5f2').should('exist')
  })

  it('truncates text when it is too long and it is UNF', () => {
    const textToCopy = 'UNF:6:xXw6cIZnwHWvmRdwhYCQZA=='
    cy.customMount(<CopyToClipboardButton text={textToCopy} />)

    cy.findByText('UNF:6:xXw6...QZA==').should('exist')
  })
})
