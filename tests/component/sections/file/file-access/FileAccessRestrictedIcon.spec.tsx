import { FileAccessRestrictedIcon } from '../../../../../src/sections/file/file-access/FileAccessRestrictedIcon'

describe('FileAccessRestrictedIcon', () => {
  it('should render the restricted icon if the file is restricted and the user cannot download the file', () => {
    cy.customMount(<FileAccessRestrictedIcon isRestricted={true} canDownloadFile={false} />)

    cy.findByTitle('Restricted File Icon').should('exist').parent().trigger('mouseover')
    cy.findByText('File Access: Restricted').should('exist')

    cy.findByTitle('Restricted with access Icon').should('not.exist')
  })

  it('should render the restricted with access icon if the file is restricted and the user can download the file', () => {
    cy.customMount(<FileAccessRestrictedIcon isRestricted={true} canDownloadFile={true} />)

    cy.findByTitle('Restricted with access Icon').should('exist').parent().trigger('mouseover')
    cy.findByText('File Access: Restricted with Access Granted').should('exist')

    cy.findByTitle('Restricted File Icon').should('not.exist')
  })

  it('should not render any icon if the file is not restricted', () => {
    cy.customMount(<FileAccessRestrictedIcon isRestricted={false} canDownloadFile={true} />)

    cy.findByTitle('Restricted with access Icon').should('not.exist')
    cy.findByTitle('Restricted File Icon').should('not.exist')
  })
})
