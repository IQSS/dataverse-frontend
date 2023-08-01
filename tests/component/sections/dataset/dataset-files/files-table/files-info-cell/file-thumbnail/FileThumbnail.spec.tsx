import { FileThumbnail } from '../../../../../../../../src/sections/dataset/dataset-files/files-table/file-info-cell/file-thumbnail/FileThumbnail'
import { FileMother } from '../../../../../../files/domain/models/FileMother'
import { FileType } from '../../../../../../../../src/files/domain/models/File'

describe('FileThumbnail', () => {
  it('renders FileThumbnailPreviewImage when thumbnail is provided', () => {
    const file = FileMother.create({
      access: { restricted: false, canDownload: true },
      thumbnail: 'thumbnail?'
    })

    cy.customMount(
      <FileThumbnail
        thumbnail={file.thumbnail}
        name={file.name}
        access={file.access}
        type={file.type}
      />
    )

    cy.findByAltText(file.name).should('exist')
    cy.findByAltText(file.name).trigger('mouseover')
    cy.findByRole('tooltip').should('exist')

    cy.findByText('Restricted File Icon').should('not.exist')
    cy.findByText('Restricted with access Icon').should('not.exist')
  })

  it('renders FileThumbnailPreviewImage when thumbnail is provided with unlocked icon if restricted with access', () => {
    const file = FileMother.create({
      access: { restricted: true, canDownload: true },
      thumbnail: 'thumbnail'
    })

    cy.customMount(
      <FileThumbnail
        thumbnail={file.thumbnail}
        name={file.name}
        access={file.access}
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
    const file = FileMother.create({
      access: { restricted: true, canDownload: false },
      thumbnail: 'thumbnail',
      type: new FileType('image')
    })

    cy.customMount(
      <FileThumbnail
        thumbnail={file.thumbnail}
        name={file.name}
        access={file.access}
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
    const file = FileMother.create({
      type: new FileType('some-type'),
      access: { restricted: false, canDownload: true }
    })

    cy.customMount(<FileThumbnail name={file.name} access={file.access} type={file.type} />)

    cy.findByText('icon-file').should('exist')

    cy.findByText('Restricted File Icon').should('not.exist')
    cy.findByText('Restricted with access Icon').should('not.exist')
  })

  it('renders FileThumbnailIcon when thumbnail is not provided with lock icon when restricted with no access', () => {
    const file = FileMother.create({
      type: new FileType('some-type'),
      access: { restricted: true, canDownload: false }
    })

    cy.customMount(<FileThumbnail name={file.name} access={file.access} type={file.type} />)

    cy.findByText('icon-file').should('exist')

    cy.findByText('Restricted File Icon').should('exist')
    cy.findByText('Restricted File Icon').should('exist').parent().trigger('mouseover')
    cy.findByText('File Access: Restricted').should('exist')
    cy.findByText('Restricted with access Icon').should('not.exist')
  })

  it('renders FileThumbnailIcon when thumbnail is not provided with unlock icon when restricted with access', () => {
    const file = FileMother.create({
      type: new FileType('some-type'),
      access: { restricted: true, canDownload: true }
    })

    cy.customMount(<FileThumbnail name={file.name} access={file.access} type={file.type} />)

    cy.findByText('icon-file').should('exist')

    cy.findByText('Restricted File Icon').should('not.exist')
    cy.findByText('Restricted with access Icon').should('exist').parent().trigger('mouseover')
    cy.findByText('File Access: Restricted with Access Granted').should('exist')
  })
})
