import { FileChecksum } from '../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-info/file-info-cell/file-info-data/FileChecksum'
import styles from '../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-info/file-info-cell/FileInfoCell.module.scss'
import { FileChecksumMother } from '../../../../../../../files/domain/models/FilePreviewMother'

describe('FileChecksum', () => {
  it('renders the checksum and CopyToClipboardButton when checksum is provided', () => {
    const checksum = FileChecksumMother.create({ value: '0187a54071542738aa47939e8218e5f2' })
    cy.customMount(<FileChecksum checksum={checksum} />)

    cy.findByText(`${checksum.algorithm}:`).should('exist')
    cy.findByText('018...5f2').should('exist')
    cy.findByRole('button', { name: /Copy to clipboard icon/ }).should('exist')
  })

  it('renders an empty fragment when checksum is not provided', () => {
    cy.customMount(<FileChecksum checksum={undefined} />)

    cy.get(styles['checksum-container']).should('not.exist')
  })
})
