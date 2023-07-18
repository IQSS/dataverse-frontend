import { FileMother } from '../../../../../files/domain/models/FileMother'
import { ZipDownloadLimitMessage } from '../../../../../../../src/sections/dataset/dataset-files/files-table/zip-download-limit-message/ZipDownloadLimitMessage'
import { FileSize, FileSizeUnit } from '../../../../../../../src/files/domain/models/File'

const files = [
  FileMother.create({ size: new FileSize(1024, FileSizeUnit.BYTES) }),
  FileMother.create({ size: new FileSize(2048, FileSizeUnit.BYTES) })
]
describe('ZipDownloadLimitMessage', () => {
  it('should render the component with no message if conditions are not met', () => {
    cy.customMount(
      <ZipDownloadLimitMessage
        selectedFiles={[FileMother.create({ size: new FileSize(1024, FileSizeUnit.BYTES) })]}
      />
    )

    cy.findByText(/The overall size of the files selected/).should('not.exist')
  })

  it('should render the component with the appropriate message if conditions are met', () => {
    cy.customMount(<ZipDownloadLimitMessage selectedFiles={files} />)

    cy.findByText(
      'The overall size of the files selected (3.0 KB) for download exceeds the zip limit of 500.0 B. Please unselect some files to continue.'
    ).should('exist')
  })

  it('should show the more than 1024 PB message if the total size is too big', () => {
    const files = [
      FileMother.create({ size: new FileSize(1000000, FileSizeUnit.PETABYTES) }),
      FileMother.create({ size: new FileSize(1000000, FileSizeUnit.PETABYTES) })
    ]
    cy.customMount(<ZipDownloadLimitMessage selectedFiles={files} />)

    cy.findByText(
      'The overall size of the files selected (more than 1024.0 PB) for download exceeds the zip limit of 500.0 B. Please unselect some files to continue.'
    ).should('exist')
  })
})
