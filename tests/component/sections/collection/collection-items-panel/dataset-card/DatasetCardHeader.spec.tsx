import { DatasetCardHeader } from '@/sections/collection/collection-items-panel/items-list/dataset-card/DatasetCardHeader'
import { PublicationStatus } from '@/shared/core/domain/models/PublicationStatus'
import { DatasetItemTypePreviewMother } from '@tests/component/dataset/domain/models/DatasetItemTypePreviewMother'

describe('DatasetCardHeader', () => {
  it('should render the header', () => {
    const dataset = DatasetItemTypePreviewMother.create()
    cy.customMount(
      <DatasetCardHeader
        persistentId={dataset.persistentId}
        version={dataset.version}
        publicationStatuses={[PublicationStatus.Unpublished]}
      />
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

    cy.findByLabelText('icon-dataset').should('exist')
  })
  it('should render the correct search param for draft version', () => {
    const dataset = DatasetItemTypePreviewMother.createDraft()
    cy.customMount(
      <DatasetCardHeader
        persistentId={dataset.persistentId}
        version={dataset.version}
        publicationStatuses={[PublicationStatus.Draft]}
      />
    )

    cy.findByText(dataset.version.title)
      .should('exist')
      .should('have.attr', 'href', `/datasets?persistentId=${dataset.persistentId}&version=DRAFT`)
  })
})
