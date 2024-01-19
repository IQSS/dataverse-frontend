import { DatasetPreviewMother } from '../../../../dataset/domain/models/DatasetPreviewMother'
import { DatasetCardThumbnail } from '../../../../../../src/sections/home/datasets-list/dataset-card/DatasetCardThumbnail'

describe('DatasetCardThumbnail', () => {
  it('should render the thumbnail', () => {
    const dataset = DatasetPreviewMother.createWithThumbnail()
    cy.customMount(
      <DatasetCardThumbnail
        persistentId={dataset.persistentId}
        version={dataset.version}
        thumbnail={dataset.thumbnail}
      />
    )

    cy.findByRole('img', { name: dataset.version.title })
      .should('exist')
      .parent('a')
      .should('have.attr', 'href', `/datasets?persistentId=${dataset.persistentId}`)
  })

  it('should render the placeholder if the dataset has no thumbnail', () => {
    const dataset = DatasetPreviewMother.createWithNoThumbnail()
    cy.customMount(
      <DatasetCardThumbnail
        persistentId={dataset.persistentId}
        version={dataset.version}
        thumbnail={dataset.thumbnail}
      />
    )

    cy.findByRole('img', { name: 'icon-dataset' })
      .should('exist')
      .parent()
      .parent('a')
      .should('have.attr', 'href', `/datasets?persistentId=${dataset.persistentId}`)
  })
})
