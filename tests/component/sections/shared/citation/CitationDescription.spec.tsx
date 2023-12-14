import { CitationDescription } from '../../../../../src/sections/shared/citation/CitationDescription'
import { DatasetMother } from '../../../dataset/domain/models/DatasetMother'
import {
  DatasetPublishingStatus,
  DatasetVersion
} from '../../../../../src/dataset/domain/models/Dataset'

describe('CitationDescription', () => {
  it('renders the citation', () => {
    const citation = 'This is a citation'
    cy.customMount(
      <CitationDescription citation={citation} version={DatasetMother.create().version} />
    )

    cy.findByText(citation).should('exist')
  })

  it('renders the citation with a tooltip when the version is not released', () => {
    const citation = 'This is a citation'
    const dataset = DatasetMother.create({
      version: new DatasetVersion(
        1,
        DatasetPublishingStatus.DRAFT,
        true,
        false,
        DatasetPublishingStatus.DRAFT
      )
    })
    cy.customMount(<CitationDescription citation={citation} version={dataset.version} />)

    cy.findByText(citation).should('exist')
    cy.findByRole('img', { name: 'tooltip icon' }).should('exist').trigger('mouseover')
    cy.findByText(
      /DRAFT VERSION will be replaced in the citation with the selected version once the dataset has been published./
    ).should('exist')
  })

  it('does not render the tooltip when the version is released', () => {
    const citation = 'This is a citation'
    const dataset = DatasetMother.create()
    cy.customMount(<CitationDescription citation={citation} version={dataset.version} />)

    cy.findByText(citation).should('exist')
    cy.findByRole('img', { name: 'tooltip icon' }).should('not.exist')
  })
})
