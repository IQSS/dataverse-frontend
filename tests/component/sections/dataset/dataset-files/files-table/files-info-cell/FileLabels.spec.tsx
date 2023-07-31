import { FileLabelType } from '../../../../../../../src/files/domain/models/File'
import { FileLabels } from '../../../../../../../src/sections/dataset/dataset-files/files-table/file-info-cell/FileLabels'
import styles from '../../../../../../../src/sections/dataset/dataset-files/files-table/file-info-cell/FileInfoCell.module.scss'

describe('FileLabels', () => {
  it('renders labels with correct variants and values', () => {
    const labels = [
      { value: 'Category 1', type: FileLabelType.CATEGORY },
      { value: 'Tag 1', type: FileLabelType.TAG },
      { value: 'Tag 2', type: FileLabelType.TAG }
    ]
    cy.customMount(<FileLabels labels={labels} />)

    cy.findByText('Category 1').should('have.class', 'bg-secondary')
    cy.findAllByText(/Tag/).should('have.class', 'bg-info')
  })

  it('renders an empty fragment when no labels are provided', () => {
    cy.customMount(<FileLabels labels={[]} />)

    cy.get(styles['labels-container']).should('not.exist')
  })
})
