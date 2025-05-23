import { DatasetCardHeader } from '@/sections/collection/collection-items-panel/items-list/dataset-card/DatasetCardHeader'
import { DatasetItemTypePreviewMother } from '@tests/component/dataset/domain/models/DatasetItemTypePreviewMother'

describe('DatasetCardHeader', () => {
  it('should render the header', () => {
    const dataset = DatasetItemTypePreviewMother.create()
    cy.customMount(
      <DatasetCardHeader persistentId={dataset.persistentId} version={dataset.version} />
    )

    cy.findByText(dataset.version.title)
      .should('exist')
      .should(
        'have.attr',
        'href',
        `/datasets?persistentId=${
          dataset.persistentId
        }&version=${dataset.version.number.toString()}`
      )

    dataset.version.labels.forEach((label) => {
      cy.findByText(label.value).should('exist')
    })
    cy.findByLabelText('icon-dataset').should('exist')
  })
  it('should render the correct search param for draft version', () => {
    const dataset = DatasetItemTypePreviewMother.createDraft()
    cy.customMount(
      <DatasetCardHeader persistentId={dataset.persistentId} version={dataset.version} />
    )

    cy.findByText(dataset.version.title)
      .should('exist')
      .should('have.attr', 'href', `/datasets?persistentId=${dataset.persistentId}&version=DRAFT`)
  })
})
