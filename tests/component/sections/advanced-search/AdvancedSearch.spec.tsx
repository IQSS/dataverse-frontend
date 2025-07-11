import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { MetadataBlockInfoRepository } from '@/metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { SearchFields } from '@/search/domain/models/SearchFields'
import { AdvancedSearchFormData } from '@/sections/advanced-search/advanced-search-form/AdvancedSearchForm'
import { AdvancedSearch } from '@/sections/advanced-search/AdvancedSearch'
import { AdvancedSearchHelper } from '@/sections/advanced-search/AdvancedSearchHelper'
import { CollectionMother } from '@tests/component/collection/domain/models/CollectionMother'
import { MetadataBlockInfoMother } from '@tests/component/metadata-block-info/domain/models/MetadataBlockInfoMother'

const collectionRepository = {} as CollectionRepository
const metadataBlockInfoRepository = {} as MetadataBlockInfoRepository

const testCollection = CollectionMother.create({ id: 'test-collection', name: 'Test Collection' })
const testCitationMetadataBlock = MetadataBlockInfoMother.getCitationBlock()

describe('AdvancedSearch', () => {
  beforeEach(() => {
    cy.viewport('macbook-15')
    collectionRepository.getById = cy.stub().resolves(testCollection)
    metadataBlockInfoRepository.getByCollectionId = cy.stub().resolves([testCitationMetadataBlock])
  })

  it('should render Datasets Citation Metadata Block fields correctly', () => {
    cy.customMount(
      <AdvancedSearch
        collectionId={testCollection.id}
        collectionRepository={collectionRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
      />
    )

    cy.findByTestId('advanced-search-metadata-block-citation')
      .should('be.visible')
      .within(() => {
        // Asserting that this metadata block has the expected fields (fields with isAdvancedSearchFieldType === true)
        cy.findByLabelText('Title').should('be.visible')
        cy.findByLabelText('Subject').should('be.visible')
      })
  })

  it('should prefill the form with previous search data if it exists and it belongs to current collection', () => {
    // Simulating a previous search data in local storage
    const previousSearchData: AdvancedSearchFormData = {
      collections: {
        [SearchFields.DATAVERSE_NAME]: 'Some Dataverse Name',
        [SearchFields.DATAVERSE_ALIAS]: 'Some Dataverse Alias',
        [SearchFields.DATAVERSE_AFFILIATION]: '',
        [SearchFields.DATAVERSE_DESCRIPTION]: '',
        [SearchFields.DATAVERSE_SUBJECT]: ['Chemistry']
      },
      datasets: {
        title: 'Some Dataset Title',
        subject: []
      },
      files: {
        [SearchFields.FILE_NAME]: 'Some File Name',
        [SearchFields.FILE_DESCRIPTION]: '',
        [SearchFields.FILE_TYPE_SEARCHABLE]: '',
        [SearchFields.FILE_PERSISTENT_ID]: '',
        [SearchFields.VARIABLE_NAME]: '',
        [SearchFields.VARIABLE_LABEL]: '',
        [SearchFields.FILE_TAG_SEARCHABLE]: ''
      }
    }
    AdvancedSearchHelper.saveAdvancedSearchQueryToLocalStorage(
      testCollection.id,
      previousSearchData
    )

    cy.customMount(
      <AdvancedSearch
        collectionId={testCollection.id}
        collectionRepository={collectionRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
      />
    )

    cy.findByTestId('advanced-search-collections').within(() => {
      cy.findByLabelText('Name').should('be.visible').should('have.value', 'Some Dataverse Name')

      cy.findByLabelText('Identifier')
        .should('be.visible')
        .should('have.value', 'Some Dataverse Alias')

      cy.get('[id="collections.subject"]').click()
      cy.findAllByRole('checkbox', { name: 'Chemistry' })
        .should('be.checked')
        .should('have.value', 'Chemistry')
    })

    cy.findByTestId('advanced-search-metadata-block-citation')
      .should('be.visible')
      .within(() => {
        cy.findByLabelText('Title').should('be.visible').should('have.value', 'Some Dataset Title')
      })

    cy.findByTestId('advanced-search-files').within(() => {
      cy.findByLabelText('Name').should('be.visible').should('have.value', 'Some File Name')
    })

    // Clear the form test
    cy.findByRole('button', { name: 'Clear Form' }).click()

    cy.findByTestId('advanced-search-collections').within(() => {
      cy.findByLabelText('Name').should('be.visible').should('have.value', '')

      cy.findByLabelText('Identifier').should('be.visible').should('have.value', '')

      cy.get('[id="collections.subject"]').click()
      cy.findAllByRole('checkbox', { name: 'Chemistry' }).should('not.be.checked')
    })

    cy.findByTestId('advanced-search-metadata-block-citation')
      .should('be.visible')
      .within(() => {
        cy.findByLabelText('Title').should('be.visible').should('have.value', '')
      })

    cy.findByTestId('advanced-search-files').within(() => {
      cy.findByLabelText('Name').should('be.visible').should('have.value', '')
    })
  })

  it('should show not found page if collection does not exist', () => {
    collectionRepository.getById = cy.stub().resolves(null)

    cy.customMount(
      <AdvancedSearch
        collectionId="non-existing-collection"
        collectionRepository={collectionRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
      />
    )

    cy.findByTestId('not-found-page').should('be.visible')
  })

  it('should show error alert if there is an error fetching metadata blocks', () => {
    const errorMessage = 'Error fetching metadata blocks'
    metadataBlockInfoRepository.getByCollectionId = cy.stub().rejects(new Error(errorMessage))

    cy.customMount(
      <AdvancedSearch
        collectionId={testCollection.id}
        collectionRepository={collectionRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
      />
    )

    cy.findByRole('alert').should('be.visible').and('contain.text', errorMessage)
  })
})
