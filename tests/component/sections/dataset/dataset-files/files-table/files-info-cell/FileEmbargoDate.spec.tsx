import { FileEmbargoDate } from '../../../../../../../src/sections/dataset/dataset-files/files-table/file-info-cell/FileEmbargoDate'
import { FileStatus } from '../../../../../../../src/files/domain/models/File'

describe('FileEmbargoDate', () => {
  it('renders the embargo date when embargo exists', () => {
    const embargo = {
      active: true,
      date: '2023-06-14'
    }
    const status = FileStatus.RELEASED
    cy.customMount(<FileEmbargoDate embargo={embargo} status={status} />)

    cy.findByText('Embargoed until 2023-06-14').should('exist')
  })

  it('renders the until embargo date when embargo is not active and the file is not released', () => {
    const embargo = {
      active: false,
      date: '2023-06-14'
    }
    const status = FileStatus.RELEASED

    cy.customMount(<FileEmbargoDate embargo={embargo} status={status} />)

    cy.findByText('Was embargoed until 2023-06-14').should('exist')
  })

  it('renders the draft until embargo date when embargo is active and the file is not released', () => {
    const embargo = {
      active: true,
      date: '2023-06-14'
    }
    const status = FileStatus.DRAFT

    cy.customMount(<FileEmbargoDate embargo={embargo} status={status} />)

    cy.findByText('Draft: will be embargoed until 2023-06-14').should('exist')
  })

  it('renders an empty fragment when embargo is undefined', () => {
    const embargo = undefined
    const status = FileStatus.RELEASED

    cy.customMount(<FileEmbargoDate embargo={embargo} status={status} />)

    cy.findByText('Draft: will be embargoed until 2023-06-14').should('not.exist')
    cy.findByText('Embargoed until 2023-06-14').should('not.exist')
    cy.findByText('Was embargoed until 2023-06-14').should('not.exist')
  })
})
