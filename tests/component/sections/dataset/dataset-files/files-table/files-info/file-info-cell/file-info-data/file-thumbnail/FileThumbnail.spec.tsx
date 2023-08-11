import { FileThumbnail } from '../../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-info/file-info-cell/file-info-data/file-thumbnail/FileThumbnail'
import { FileMother } from '../../../../../../../../files/domain/models/FileMother'

describe('FileThumbnail', () => {
  it('renders FileThumbnailPreviewImage when thumbnail is provided', () => {
    const file = FileMother.createWithThumbnail()
    cy.customMount(
      <FileThumbnail
        thumbnail={file.thumbnail}
        name={file.name}
        type={file.type}
        lockStatus={file.lockStatus}
      />
    )

    cy.findByAltText(file.name).should('exist')
    cy.findByAltText(file.name).trigger('mouseover')
    cy.findByRole('tooltip').should('exist')

    cy.findByText('Restricted File Icon').should('not.exist')
    cy.findByText('Restricted with access Icon').should('not.exist')
  })

  it('renders FileThumbnailPreviewImage when thumbnail is provided with unlocked icon if restricted with access', () => {
    const file = FileMother.createWithThumbnailRestrictedWithAccessGranted()

    cy.customMount(
      <FileThumbnail
        thumbnail={file.thumbnail}
        name={file.name}
        lockStatus={file.lockStatus}
        type={file.type}
      />
    )

    cy.findByAltText(file.name).should('exist')
    cy.findByAltText(file.name).trigger('mouseover')
    cy.findByRole('tooltip').should('exist')

    cy.findByText('Restricted File Icon').should('not.exist')
    cy.findByText('Restricted with access Icon').should('exist').parent().trigger('mouseover')
    cy.findByText('File Access: Restricted with Access Granted').should('exist')
  })

  it('does not render FileThumbnailPreviewImage when thumbnail is provided if restricted with no access', () => {
    const file = FileMother.createWithThumbnailRestricted()

    cy.customMount(
      <FileThumbnail
        thumbnail={file.thumbnail}
        name={file.name}
        lockStatus={file.lockStatus}
        type={file.type}
      />
    )

    cy.findByAltText(file.name).should('not.exist')
    cy.findByText('icon-image').should('exist')

    cy.findByText('Restricted File Icon').should('exist').parent().trigger('mouseover')
    cy.findByText('File Access: Restricted').should('exist')
    cy.findByText('Restricted with access Icon').should('not.exist')
  })

  it('renders FileThumbnailIcon when thumbnail is not provided', () => {
    const file = FileMother.createDefault()

    cy.customMount(<FileThumbnail name={file.name} lockStatus={file.lockStatus} type={file.type} />)

    cy.findByText('icon-file').should('exist')

    cy.findByText('Restricted File Icon').should('not.exist')
    cy.findByText('Restricted with access Icon').should('not.exist')
  })

  it('renders FileThumbnailIcon when thumbnail is not provided with lock icon when restricted with no access', () => {
    const file = FileMother.createWithRestrictedAccess()

    cy.customMount(<FileThumbnail name={file.name} lockStatus={file.lockStatus} type={file.type} />)

    cy.findByText('icon-file').should('exist')

    cy.findByText('Restricted File Icon').should('exist')
    cy.findByText('Restricted File Icon').should('exist').parent().trigger('mouseover')
    cy.findByText('File Access: Restricted').should('exist')
    cy.findByText('Restricted with access Icon').should('not.exist')
  })

  it('renders FileThumbnailIcon when thumbnail is not provided with unlock icon when restricted with access', () => {
    const file = FileMother.createWithRestrictedAccessWithAccessGranted()

    cy.customMount(<FileThumbnail name={file.name} lockStatus={file.lockStatus} type={file.type} />)

    cy.findByText('icon-file').should('exist')

    cy.findByText('Restricted File Icon').should('not.exist')
    cy.findByText('Restricted with access Icon').should('exist').parent().trigger('mouseover')
    cy.findByText('File Access: Restricted with Access Granted').should('exist')
  })
})
