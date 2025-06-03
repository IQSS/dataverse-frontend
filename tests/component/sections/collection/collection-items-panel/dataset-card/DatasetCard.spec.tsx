import { DatasetCard } from '@/sections/collection/collection-items-panel/items-list/dataset-card/DatasetCard'
import { DatasetItemTypePreviewMother } from '@tests/component/dataset/domain/models/DatasetItemTypePreviewMother'
import { DateHelper } from '@/shared/helpers/DateHelper'
import styles from '@/sections/collection/collection-items-panel/items-list/dataset-card/DatasetCard.module.scss'
import { Route } from '@/sections/Route.enum'

describe('DatasetCard', () => {
  it('should render the card', () => {
    const dataset = DatasetItemTypePreviewMother.createWithThumbnail()

    cy.customMount(<DatasetCard datasetPreview={dataset} />)

    cy.findByText(dataset.version.title).should('exist')

    cy.findByRole('img', { name: dataset.version.title }).should('exist')
    cy.findByText(DateHelper.toDisplayFormat(dataset.releaseOrCreateDate)).should('exist')
    cy.findByText(/Admin, Dataverse, 2023, "Dataset Title",/).should('exist')
  })

  it('should render the card with user roles', () => {
    const userRoles = ['Admin', 'Contributor']
    const dataset = DatasetItemTypePreviewMother.create({ userRoles: userRoles })

    cy.customMount(<DatasetCard datasetPreview={dataset} />)

    cy.findByText(dataset.version.title).should('exist')

    cy.findByText(DateHelper.toDisplayFormat(dataset.releaseOrCreateDate)).should('exist')
    cy.findByText(/Admin, Dataverse, 2023, "Dataset Title",/).should('exist')

    userRoles.forEach((role) => {
      cy.findByText(role).should('exist')
    })
  })

  it('should render the dataset info correctly', () => {
    const dataset = DatasetItemTypePreviewMother.createDraft()
    cy.customMount(<DatasetCard datasetPreview={dataset} />)

    cy.findByText(DateHelper.toDisplayFormat(dataset.releaseOrCreateDate)).should('exist')
    cy.findByText(/Admin, Dataverse, 2023, "Dataset Title",/)
      .should('exist')
      .parent()
      .parent()
      .should('have.class', styles['citation-box'])
    cy.findByText(dataset.description).should('exist')
  })

  it('should render the citation with the deaccessioned background if the dataset is deaccessioned', () => {
    const dataset = DatasetItemTypePreviewMother.createDeaccessioned()
    cy.customMount(<DatasetCard datasetPreview={dataset} />)

    cy.findByText(/Admin, Dataverse, 2023, "Dataset Title",/)
      .should('exist')
      .parent()
      .parent()
      .should('have.class', styles['deaccesioned'])
  })

  describe('Parent Collection Link', () => {
    it('should render it if parentCollectionAlias is not the one where the dataset card is being shown', () => {
      const dataset = DatasetItemTypePreviewMother.create({
        parentCollectionAlias: 'parent-collection-alias',
        parentCollectionName: 'Parent Collection Name'
      })
      cy.customMount(
        <DatasetCard datasetPreview={dataset} parentCollectionAlias="another-collection-alias" />
      )

      cy.findByText('Parent Collection Name')
        .should('exist')
        .should('have.attr', 'href', `${Route.COLLECTIONS_BASE}/parent-collection-alias`)
    })

    it('should not render it if parentCollectionAlias is the same as the one where the dataset card is being shown', () => {
      const dataset = DatasetItemTypePreviewMother.create({
        parentCollectionAlias: 'parent-collection-alias',
        parentCollectionName: 'Parent Collection Name'
      })
      cy.customMount(
        <DatasetCard datasetPreview={dataset} parentCollectionAlias="parent-collection-alias" />
      )

      cy.findByText('Parent Collection Name').should('not.exist')
    })
  })
})
