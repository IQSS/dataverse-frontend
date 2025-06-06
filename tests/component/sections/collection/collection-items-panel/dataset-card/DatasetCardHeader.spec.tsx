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

  it('should sort the publication statuses by name', () => {
    const dataset = DatasetItemTypePreviewMother.create({
      publicationStatuses: [
        PublicationStatus.Unpublished,
        PublicationStatus.Draft,
        PublicationStatus.InReview
      ]
    })
    cy.customMount(
      <DatasetCardHeader
        persistentId={dataset.persistentId}
        version={dataset.version}
        publicationStatuses={dataset.publicationStatuses}
      />
    )

    cy.findAllByText(PublicationStatus.Draft).should('exist')
    cy.findAllByText(PublicationStatus.InReview).should('exist')
    cy.findAllByText(PublicationStatus.Unpublished).should('exist')

    cy.get('.badge').then((badges) => {
      expect(badges[0].textContent).to.equal(PublicationStatus.Draft)
      expect(badges[1].textContent).to.equal(PublicationStatus.InReview)
      expect(badges[2].textContent).to.equal(PublicationStatus.Unpublished)
    })
  })

  it('should filter out and dont render the Published status badge', () => {
    const dataset = DatasetItemTypePreviewMother.create()
    cy.customMount(
      <DatasetCardHeader
        persistentId={dataset.persistentId}
        version={dataset.version}
        publicationStatuses={[PublicationStatus.Published]}
      />
    )

    cy.findByText(PublicationStatus.Published).should('not.exist')
  })
})
