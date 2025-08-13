import styles from '../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-info/file-info-cell/FileInfoCell.module.scss'
import { FileDescription } from '../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-info/file-info-cell/file-info-data/FileDescription'

describe('FileDescription', () => {
  it('renders the file description when a description is provided', () => {
    const description = 'This is a file description'
    cy.customMount(<FileDescription description={description} />)

    cy.findByText(description).should('exist')
  })

  it('renders an empty fragment when description is not provided', () => {
    cy.customMount(<FileDescription description={undefined} />)

    cy.get(styles['description-container']).should('not.exist')
  })
})
