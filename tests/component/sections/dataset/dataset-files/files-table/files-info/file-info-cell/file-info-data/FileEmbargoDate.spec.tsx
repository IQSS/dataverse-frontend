import { FileEmbargoDate } from '../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-info/file-info-cell/file-info-data/FileEmbargoDate'
import { FilePublishingStatus } from '../../../../../../../../../src/files/domain/models/File'
import { FileEmbargoMother } from '../../../../../../../files/domain/models/FileMother'

describe('FileEmbargoDate', () => {
  it('renders the embargo date when embargo exists', () => {
    const embargo = FileEmbargoMother.create(new Date('2123-09-18'))
    const status = FilePublishingStatus.RELEASED
    cy.customMount(<FileEmbargoDate embargo={embargo} publishingStatus={status} />)

    cy.findByText(`Embargoed until Sep 18, 2123`).should('exist')
  })

  it('renders the until embargo date when embargo is not active and the file is not released', () => {
    const embargo = FileEmbargoMother.create(new Date('2023-09-15'))
    const status = FilePublishingStatus.RELEASED

    cy.customMount(<FileEmbargoDate embargo={embargo} publishingStatus={status} />)

    cy.findByText(`Was embargoed until Sep 15, 2023`).should('exist')
  })

  it('renders the draft until embargo date when embargo is active and the file is not released', () => {
    const embargo = FileEmbargoMother.create(new Date('2123-09-18'))
    const status = FilePublishingStatus.DRAFT

    cy.customMount(<FileEmbargoDate embargo={embargo} publishingStatus={status} />)

    cy.findByText(`Draft: will be embargoed until Sep 18, 2123`).should('exist')
  })

  it('renders an empty fragment when embargo is undefined', () => {
    const embargo = undefined
    const status = FilePublishingStatus.RELEASED

    cy.customMount(<FileEmbargoDate embargo={embargo} publishingStatus={status} />)

    cy.findByText(/Draft: will be embargoed until/).should('not.exist')
    cy.findByText(/Embargoed until/).should('not.exist')
    cy.findByText(/Was embargoed until/).should('not.exist')
  })
})
