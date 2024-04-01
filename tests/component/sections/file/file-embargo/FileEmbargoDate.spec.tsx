import { FileEmbargoDate } from '../../../../../src/sections/file/file-embargo/FileEmbargoDate'
import { DatasetPublishingStatus } from '../../../../../src/dataset/domain/models/Dataset'
import { FileEmbargoMother } from '../../../files/domain/models/FileMetadataMother'

describe('FileEmbargoDate', () => {
  it('renders the embargo date when embargo exists', () => {
    const embargoDate = new Date('2123-09-18')
    const embargo = FileEmbargoMother.create({ dateAvailable: embargoDate })
    const status = DatasetPublishingStatus.RELEASED
    cy.customMount(<FileEmbargoDate embargo={embargo} datasetPublishingStatus={status} />)
    const dateString = embargoDate.toLocaleDateString(
      Intl.DateTimeFormat().resolvedOptions().locale,
      {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }
    )
    cy.findByText(`Embargoed until ` + dateString).should('exist')
  })

  it('renders the until embargo date when embargo is not active and the file is not released', () => {
    const embargoDate = new Date('2023-09-15')
    const embargo = FileEmbargoMother.create({ dateAvailable: embargoDate })
    const status = DatasetPublishingStatus.RELEASED

    cy.customMount(<FileEmbargoDate embargo={embargo} datasetPublishingStatus={status} />)
    const dateString = embargoDate.toLocaleDateString(
      Intl.DateTimeFormat().resolvedOptions().locale,
      {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }
    )
    cy.findByText(`Was embargoed until ` + dateString).should('exist')
  })

  it('renders the draft until embargo date when embargo is active and the file is not released', () => {
    const embargoDate = new Date('2123-09-18')
    const embargo = FileEmbargoMother.create({ dateAvailable: embargoDate })
    const status = DatasetPublishingStatus.DRAFT

    cy.customMount(<FileEmbargoDate embargo={embargo} datasetPublishingStatus={status} />)
    const dateString = embargoDate.toLocaleDateString(
      Intl.DateTimeFormat().resolvedOptions().locale,
      {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }
    )
    cy.findByText(`Draft: will be embargoed until ` + dateString).should('exist')
  })

  it('renders an empty fragment when embargo is undefined', () => {
    const embargo = undefined
    const status = DatasetPublishingStatus.RELEASED

    cy.customMount(<FileEmbargoDate embargo={embargo} datasetPublishingStatus={status} />)

    cy.findByText(/Draft: will be embargoed until/).should('not.exist')
    cy.findByText(/Embargoed until/).should('not.exist')
    cy.findByText(/Was embargoed until/).should('not.exist')
  })

  it('renders the embargo date in YYYY-MM-DD format', () => {
    const embargoDate = new Date('2123-09-18')
    const embargo = FileEmbargoMother.create({ dateAvailable: embargoDate })
    const status = DatasetPublishingStatus.RELEASED
    cy.customMount(
      <FileEmbargoDate embargo={embargo} datasetPublishingStatus={status} format="YYYY-MM-DD" />
    )
    const dateString = embargoDate.toLocaleDateString(
      Intl.DateTimeFormat().resolvedOptions().locale,
      {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }
    )
    cy.findByText(`Embargoed until ` + dateString).should('exist')
  })
})
