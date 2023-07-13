import {
  FileAccessOption,
  FileCriteria
} from '../../../../../../src/files/domain/models/FileCriteria'
import { FilesCountInfoMother } from '../../../../files/domain/models/FilesCountInfoMother'
import styles from '../../../../../../src/sections/dataset/dataset-files/file-criteria-controls/FileCriteriaControls.module.scss'
import { FileCriteriaFilterByAccess } from '../../../../../../src/sections/dataset/dataset-files/file-criteria-controls/FileCriteriaFilterByAccess'

const defaultCriteria = new FileCriteria()
const filesCountInfo = FilesCountInfoMother.create({
  perAccess: [
    {
      access: FileAccessOption.PUBLIC,
      count: 5
    },
    {
      access: FileAccessOption.RESTRICTED,
      count: 10
    }
  ]
})

describe('FilesCriteriaFilterByAccess', () => {
  it('renders filter by access options', () => {
    const onCriteriaChange = cy.stub().as('onCriteriaChange')

    cy.customMount(
      <FileCriteriaFilterByAccess
        criteria={defaultCriteria}
        onCriteriaChange={onCriteriaChange}
        filesCountInfo={filesCountInfo}
      />
    )

    cy.findByRole('button', { name: 'Access: All' }).click()

    cy.findByText('All').should('exist')
    cy.findByText('Public (5)').should('exist')
    cy.findByText('Restricted (10)').should('exist')
  })

  it('calls onCriteriaChange with the selected filter by access value', () => {
    const onCriteriaChange = cy.stub().as('onCriteriaChange')

    cy.customMount(
      <FileCriteriaFilterByAccess
        criteria={defaultCriteria}
        onCriteriaChange={onCriteriaChange}
        filesCountInfo={filesCountInfo}
      />
    )

    cy.findByRole('button', { name: 'Access: All' }).click()
    cy.findByText('Public (5)').click()
    cy.wrap(onCriteriaChange).should(
      'be.calledWith',
      defaultCriteria.withFilterByAccess(FileAccessOption.PUBLIC)
    )

    cy.findByRole('button', { name: 'Access: Public' }).click()
    cy.findByText('Restricted (10)').click()
    cy.wrap(onCriteriaChange).should(
      'be.calledWith',
      defaultCriteria.withFilterByAccess(FileAccessOption.RESTRICTED)
    )
  })

  it('shows the selected filter in the dropdown title', () => {
    const onCriteriaChange = cy.stub().as('onCriteriaChange')
    const criteria = defaultCriteria.withFilterByAccess(FileAccessOption.PUBLIC)

    cy.customMount(
      <FileCriteriaFilterByAccess
        criteria={criteria}
        onCriteriaChange={onCriteriaChange}
        filesCountInfo={filesCountInfo}
      />
    )

    cy.findByRole('button', { name: 'Access: Public' }).click()
    cy.findByText('All').should('exist').click()
    cy.wrap(onCriteriaChange).should('be.calledWith', defaultCriteria.withFilterByAccess(undefined))
  })

  it('changes the filter option text to bold when selected', () => {
    const onCriteriaChange = cy.stub().as('onCriteriaChange')

    cy.customMount(
      <FileCriteriaFilterByAccess
        criteria={defaultCriteria}
        onCriteriaChange={onCriteriaChange}
        filesCountInfo={filesCountInfo}
      />
    )

    cy.findByRole('button', { name: 'Access: All' }).click()
    cy.findByText('All').should('have.class', styles['selected-option'])

    cy.findByRole('button', { name: 'Public (5)' }).click()
    cy.findByRole('button', { name: 'Access: Public' }).click()
    cy.findByText('Public (5)').should('have.class', styles['selected-option'])

    cy.findByRole('button', { name: 'Restricted (10)' }).click()
    cy.findByRole('button', { name: 'Access: Restricted' }).click()
    cy.findByText('Restricted (10)').should('have.class', styles['selected-option'])
  })
})
