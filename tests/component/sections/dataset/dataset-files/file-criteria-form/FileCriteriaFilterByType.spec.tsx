import { FileCriteria } from '../../../../../../src/files/domain/models/FileCriteria'
import { FilesCountInfoMother } from '../../../../files/domain/models/FilesCountInfoMother'
import { FileType } from '../../../../../../src/files/domain/models/File'
import styles from '../../../../../../src/sections/dataset/dataset-files/file-criteria-form/FileCriteriaForm.module.scss'
import { FileCriteriaFilterByType } from '../../../../../../src/sections/dataset/dataset-files/file-criteria-form/FileCriteriaFilterByType'

const defaultCriteria = new FileCriteria()
const filesCountInfo = FilesCountInfoMother.create({
  perFileType: [
    {
      type: new FileType('image/png'),
      count: 5
    },
    {
      type: new FileType('text/plain'),
      count: 10
    }
  ]
})

describe('FilesCriteriaFilterByType', () => {
  it('renders filter by type options', () => {
    const onCriteriaChange = cy.stub().as('onCriteriaChange')

    cy.customMount(
      <FileCriteriaFilterByType
        criteria={defaultCriteria}
        onCriteriaChange={onCriteriaChange}
        filesCountInfo={filesCountInfo}
      />
    )

    cy.findByRole('button', { name: 'File Type: All' }).click()

    cy.findByText('All').should('exist')
    cy.findByText('PNG Image (5)').should('exist')
    cy.findByText('Plain Text (10)').should('exist')
  })

  it('calls onCriteriaChange with the selected filter by type value', () => {
    const onCriteriaChange = cy.stub().as('onCriteriaChange')

    cy.customMount(
      <FileCriteriaFilterByType
        criteria={defaultCriteria}
        onCriteriaChange={onCriteriaChange}
        filesCountInfo={filesCountInfo}
      />
    )

    cy.findByRole('button', { name: 'File Type: All' }).click()
    cy.findByText('PNG Image (5)').click()
    cy.wrap(onCriteriaChange).should('be.calledWith', defaultCriteria.withFilterByType('image/png'))

    cy.findByRole('button', { name: 'File Type: PNG Image' }).click()
    cy.findByText('Plain Text (10)').click()
    cy.wrap(onCriteriaChange).should(
      'be.calledWith',
      defaultCriteria.withFilterByType('text/plain')
    )
  })

  it('shows the selected filter in the dropdown title', () => {
    const onCriteriaChange = cy.stub().as('onCriteriaChange')
    const criteria = defaultCriteria.withFilterByType('image/png')

    cy.customMount(
      <FileCriteriaFilterByType
        criteria={criteria}
        onCriteriaChange={onCriteriaChange}
        filesCountInfo={filesCountInfo}
      />
    )

    cy.findByRole('button', { name: 'File Type: PNG Image' }).click()
    cy.findByText('All').should('exist').click()
    cy.wrap(onCriteriaChange).should('be.calledWith', defaultCriteria.withFilterByType(undefined))
  })

  it('changes the filter option text to bold when selected', () => {
    const onCriteriaChange = cy.stub().as('onCriteriaChange')

    cy.customMount(
      <FileCriteriaFilterByType
        criteria={defaultCriteria}
        onCriteriaChange={onCriteriaChange}
        filesCountInfo={filesCountInfo}
      />
    )

    cy.findByRole('button', { name: 'File Type: All' }).click()
    cy.findByText('All').should('have.class', styles['selected-option'])

    cy.findByRole('button', { name: 'PNG Image (5)' }).click()
    cy.findByRole('button', { name: 'File Type: PNG Image' }).click()
    cy.findByText('PNG Image (5)').should('have.class', styles['selected-option'])

    cy.findByRole('button', { name: 'Plain Text (10)' }).click()
    cy.findByRole('button', { name: 'File Type: Plain Text' }).click()
    cy.findByText('Plain Text (10)').should('have.class', styles['selected-option'])
  })

  it('does not render the filter by type dropdown if there are no filter options', () => {
    const onCriteriaChange = cy.stub().as('onCriteriaChange')
    const criteria = defaultCriteria.withFilterByType('image')

    cy.customMount(
      <FileCriteriaFilterByType
        criteria={criteria}
        onCriteriaChange={onCriteriaChange}
        filesCountInfo={FilesCountInfoMother.create({ perFileType: [] })}
      />
    )

    cy.findByRole('button', { name: 'File Type: PNG Image' }).should('not.exist')
  })
})
