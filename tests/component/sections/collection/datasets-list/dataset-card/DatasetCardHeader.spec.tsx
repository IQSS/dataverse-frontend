import { DatasetCardHeader } from '../../../../../../src/sections/collection/datasets-list/dataset-card/DatasetCardHeader'
import { DatasetPreviewMother } from '../../../../dataset/domain/models/DatasetPreviewMother'

describe('DatasetCardHeader', () => {
  it('should render the header', () => {
    const dataset = DatasetPreviewMother.create()
    cy.customMount(
      <DatasetCardHeader persistentId={dataset.persistentId} version={dataset.version} />
    )

    cy.findByText(dataset.version.title)
      .should('exist')
      .should('have.attr', 'href', `/datasets?persistentId=${dataset.persistentId}`)
    dataset.version.labels.forEach((label) => {
      cy.findByText(label.value).should('exist')
    })
    cy.findByLabelText('icon-dataset').should('exist')
  })
  it('should render the correct search param for draft version', () => {
    const dataset = DatasetPreviewMother.createDraft()
    cy.customMount(
      <DatasetCardHeader persistentId={dataset.persistentId} version={dataset.version} />
    )

    cy.findByText(dataset.version.title)
      .should('exist')
      .should('have.attr', 'href', `/datasets?persistentId=${dataset.persistentId}&version=DRAFT`)
  })
})
