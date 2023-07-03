import { FileChecksum } from '../../../../../../../src/sections/dataset/dataset-files/files-table/file-info-cell/FileChecksum'
import styles from '../../../../../../../src/sections/dataset/dataset-files/files-table/file-info-cell/FileInfoCell.module.scss'

describe('FileChecksum', () => {
  it('renders the checksum and CopyToClipboardButton when checksum is provided', () => {
    const checksum = 'ABC123'
    cy.customMount(<FileChecksum checksum={checksum} />)

    cy.findByText(checksum).should('exist')
    cy.findByRole('button', { name: /Copy to clipboard icon/ }).should('exist')
  })

  it('renders an empty fragment when checksum is not provided', () => {
    cy.customMount(<FileChecksum checksum={undefined} />)

    cy.get(styles['checksum-container']).should('not.exist')
  })
})
