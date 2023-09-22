import { FileEmbargoDate } from '../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-info/file-info-cell/file-info-data/FileEmbargoDate'
import { FileStatus } from '../../../../../../../../../src/files/domain/models/File'
import { FileEmbargoMother } from '../../../../../../../files/domain/models/FileMother'

describe('FileEmbargoDate', () => {
  it('renders the embargo date when embargo exists', () => {
    const embargo = FileEmbargoMother.create()
    const status = FileStatus.RELEASED
    cy.customMount(<FileEmbargoDate embargo={embargo} status={status} />)

    cy.findByText(`Embargoed until ${embargo.dateAvailable.toDateString()}`).should('exist')
  })

  it('renders the until embargo date when embargo is not active and the file is not released', () => {
    const embargo = FileEmbargoMother.createNotActive()
    const status = FileStatus.RELEASED

    cy.customMount(<FileEmbargoDate embargo={embargo} status={status} />)

    cy.findByText(`Was embargoed until ${embargo.dateAvailable.toDateString()}`).should('exist')
  })

  it('renders the draft until embargo date when embargo is active and the file is not released', () => {
    const embargo = FileEmbargoMother.create()
    const status = FileStatus.DRAFT

    cy.customMount(<FileEmbargoDate embargo={embargo} status={status} />)

    cy.findByText(`Draft: will be embargoed until ${embargo.dateAvailable.toDateString()}`).should(
      'exist'
    )
  })

  it('renders an empty fragment when embargo is undefined', () => {
    const embargo = undefined
    const status = FileStatus.RELEASED

    cy.customMount(<FileEmbargoDate embargo={embargo} status={status} />)

    cy.findByText(/Draft: will be embargoed until/).should('not.exist')
    cy.findByText(/Embargoed until/).should('not.exist')
    cy.findByText(/Was embargoed until/).should('not.exist')
  })
})
