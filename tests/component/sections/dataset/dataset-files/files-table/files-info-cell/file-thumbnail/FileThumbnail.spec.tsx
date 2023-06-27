import { FileThumbnail } from '../../../../../../../../src/sections/dataset/dataset-files/files-table/file-info-cell/file-thumbnail/FileThumbnail'
import { FileMother } from '../../../../../../files/domain/models/FileMother'

describe('FileThumbnail', () => {
  it('renders FileThumbnailRestrictedIcon when access is restricted', () => {
    const file = FileMother.create({ access: { restricted: true, canDownload: false } })

    cy.customMount(
      <FileThumbnail
        thumbnail={file.thumbnail}
        name={file.name}
        access={file.access}
        type={file.type}
      />
    )

    cy.findByText('Locked File Icon').should('exist')
  })

  it('renders FileThumbnailPreviewImage when thumbnail is provided', () => {
    const file = FileMother.create({
      access: { restricted: false, canDownload: true },
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
  })

  it('renders FileThumbnailIcon when thumbnail is not provided', () => {
    const file = FileMother.create({
      type: 'some-type',
      access: { restricted: false, canDownload: true }
    })

    cy.customMount(<FileThumbnail name={file.name} access={file.access} type={file.type} />)

    cy.findByText('icon-file').should('exist')
  })
})
