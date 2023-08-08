import { FileTabularData } from '../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-info/file-info-cell/file-info-data/FileTabularData'
import styles from '../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-info/file-info-cell/FileInfoCell.module.scss'

describe('FileTabularData', () => {
  it('renders the tabular data and CopyToClipboardButton when tabularData is provided', () => {
    const tabularData = {
      variablesCount: 10,
      observationsCount: 100,
      unf: 'ABC123'
    }
    cy.customMount(<FileTabularData tabularData={tabularData} />)

    cy.findByText(/10 Variables, 100 Observations/).should('exist')
    cy.findByText(tabularData.unf).should('exist')
    cy.findByRole('button', { name: /Copy to clipboard icon/ }).should('exist')
  })

  it('renders an empty fragment when tabularData is not provided', () => {
    cy.customMount(<FileTabularData tabularData={undefined} />)

    cy.get(styles['checksum-container']).should('not.exist')
  })
})
