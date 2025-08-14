import { MetadataBlockInfo } from '@/metadata-block-info/domain/models/MetadataBlockInfo'
import { SearchFields } from '@/search/domain/models/SearchFields'
import { AdvancedSearchFormData } from '@/sections/advanced-search/advanced-search-form/AdvancedSearchForm'
import { AdvancedSearchHelper } from '@/sections/advanced-search/AdvancedSearchHelper'

const testMetadataBlocks: MetadataBlockInfo[] = [
  {
    id: 1,
    name: 'block1',
    displayName: 'Block 1',
    displayOnCreate: true,
    metadataFields: {
      title: {
        name: 'title',
        displayName: 'Title',
        title: 'Title',
        type: 'TEXT',
        watermark: '',
        description: 'The main title of the Dataset',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: true,
        displayOrder: 0,
        typeClass: 'primitive',
        displayOnCreate: true,
        isAdvancedSearchFieldType: true
      },
      author: {
        name: 'author',
        displayName: 'Author',
        title: 'Author',
        type: 'NONE',
        watermark: '',
        description: 'The entity, e.g. a person or organization, that created the Dataset',
        multiple: true,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: true,
        displayOrder: 7,
        typeClass: 'compound',
        displayOnCreate: true,
        isAdvancedSearchFieldType: false,
        childMetadataFields: {
          authorName: {
            name: 'authorName',
            displayName: 'Author Name',
            title: 'Name',
            type: 'TEXT',
            watermark: '1) Family Name, Given Name or 2) Organization XYZ',
            description:
              "The name of the author, such as the person's name or the name of an organization",
            multiple: false,
            isControlledVocabulary: false,
            displayFormat: '#VALUE',
            isRequired: true,
            displayOrder: 8,
            typeClass: 'primitive',
            displayOnCreate: true,
            isAdvancedSearchFieldType: true
          },
          authorAffiliation: {
            name: 'authorAffiliation',
            displayName: 'Author Affiliation',
            title: 'Affiliation',
            type: 'TEXT',
            watermark: 'Organization XYZ',
            description:
              "The name of the entity affiliated with the author, e.g. an organization's name",
            multiple: false,
            isControlledVocabulary: false,
            displayFormat: '(#VALUE)',
            isRequired: false,
            displayOrder: 9,
            typeClass: 'primitive',
            displayOnCreate: true,
            isAdvancedSearchFieldType: false
          }
        }
      },
      subject: {
        name: 'subject',
        displayName: 'Subject',
        title: 'Subject',
        type: 'TEXT',
        watermark: '',
        description: 'The area of study relevant to the Dataset',
        multiple: true,
        isControlledVocabulary: true,
        controlledVocabularyValues: [
          'Agricultural Sciences',
          'Arts and Humanities',
          'Astronomy and Astrophysics',
          'Business and Management',
          'Chemistry',
          'Computer and Information Science',
          'Earth and Environmental Sciences',
          'Engineering',
          'Law',
          'Mathematical Sciences',
          'Medicine, Health and Life Sciences',
          'Physics',
          'Social Sciences',
          'Other'
        ],
        displayFormat: '',
        isRequired: true,
        displayOrder: 19,
        typeClass: 'controlledVocabulary',
        displayOnCreate: true,
        isAdvancedSearchFieldType: true
      }
    }
  }
]

describe('AdvancedSearchHelper', () => {
  describe('filterSearchableMetadataBlockFields', () => {
    it('should return only metadata fields with searchable fields', () => {
      const result = AdvancedSearchHelper.filterSearchableMetadataBlockFields(testMetadataBlocks)

      expect(result[0].metadataFields).to.have.property('title')
      expect(result[0].metadataFields).to.have.property('authorName')
      expect(result[0].metadataFields).to.have.property('subject')
      expect(result[0].metadataFields).to.not.have.property('author')
      expect(result[0].metadataFields).to.not.have.property('authorAffiliation')
    })
  })

  describe('getFormDefaultValues', () => {
    it('should return correct form default values', () => {
      const result = AdvancedSearchHelper.getFormDefaultValues(testMetadataBlocks, null)
      console.log(result)
      expect(result).to.have.property('collections')
      expect(result).to.have.property('datasets')
      expect(result).to.have.property('files')
      expect(result.collections).to.have.property(SearchFields.DATAVERSE_NAME)
      expect(result.collections).to.have.property(SearchFields.DATAVERSE_ALIAS)
      expect(result.collections).to.have.property(SearchFields.DATAVERSE_AFFILIATION)
      expect(result.collections).to.have.property(SearchFields.DATAVERSE_DESCRIPTION)
      expect(result.collections).to.have.property(SearchFields.DATAVERSE_SUBJECT)
      expect(result.datasets).to.have.property('title')
      expect(result.datasets.title).to.equal('')
      expect(result.datasets).to.have.property('authorName')
      expect(result.datasets.authorName).to.equal('')
      expect(result.datasets).to.have.property('subject')
      expect(result.datasets.subject).to.deep.equal([])
      expect(result.files).to.have.property(SearchFields.FILE_NAME)
      expect(result.files).to.have.property(SearchFields.FILE_DESCRIPTION)
      expect(result.files).to.have.property(SearchFields.FILE_TYPE_SEARCHABLE)
      expect(result.files).to.have.property(SearchFields.FILE_PERSISTENT_ID)
      expect(result.files).to.have.property(SearchFields.VARIABLE_NAME)
      expect(result.files).to.have.property(SearchFields.VARIABLE_LABEL)
      expect(result.files).to.have.property(SearchFields.FILE_TAG_SEARCHABLE)
    })

    it('should return correct form default values with existing search data', () => {
      const existingSearchData = {
        collections: {
          [SearchFields.DATAVERSE_NAME]: 'Existing Dataverse Name',
          [SearchFields.DATAVERSE_ALIAS]: 'Existing Dataverse Alias',
          [SearchFields.DATAVERSE_AFFILIATION]: 'Existing Affiliation',
          [SearchFields.DATAVERSE_DESCRIPTION]: 'Existing Description',
          [SearchFields.DATAVERSE_SUBJECT]: ['Chemistry']
        },
        datasets: {
          title: 'Existing Dataset Title',
          authorName: '',
          subject: []
        },
        files: {
          [SearchFields.FILE_NAME]: 'Existing File Name',
          [SearchFields.FILE_DESCRIPTION]: 'Existing File Description',
          [SearchFields.FILE_TYPE_SEARCHABLE]: 'PDF',
          [SearchFields.FILE_PERSISTENT_ID]: 'pid123',
          [SearchFields.VARIABLE_NAME]: 'Variable1',
          [SearchFields.VARIABLE_LABEL]: 'Variable Label 1',
          [SearchFields.FILE_TAG_SEARCHABLE]: 'Tag1'
        }
      }

      const result = AdvancedSearchHelper.getFormDefaultValues(
        testMetadataBlocks,
        existingSearchData
      )

      expect(result.collections[SearchFields.DATAVERSE_NAME]).to.equal('Existing Dataverse Name')
      expect(result.collections[SearchFields.DATAVERSE_ALIAS]).to.equal('Existing Dataverse Alias')
      expect(result.collections[SearchFields.DATAVERSE_AFFILIATION]).to.equal(
        'Existing Affiliation'
      )
      expect(result.collections[SearchFields.DATAVERSE_DESCRIPTION]).to.equal(
        'Existing Description'
      )
      expect(result.collections[SearchFields.DATAVERSE_SUBJECT]).to.deep.equal(['Chemistry'])
      expect(result.datasets.title).to.equal('Existing Dataset Title')
      expect(result.datasets.authorName).to.equal('')
      expect(result.datasets.subject).to.deep.equal([])
      expect(result.files[SearchFields.FILE_NAME]).to.equal('Existing File Name')
      expect(result.files[SearchFields.FILE_DESCRIPTION]).to.equal('Existing File Description')
      expect(result.files[SearchFields.FILE_TYPE_SEARCHABLE]).to.equal('PDF')
      expect(result.files[SearchFields.FILE_PERSISTENT_ID]).to.equal('pid123')
      expect(result.files[SearchFields.VARIABLE_NAME]).to.equal('Variable1')
      expect(result.files[SearchFields.VARIABLE_LABEL]).to.equal('Variable Label 1')
      expect(result.files[SearchFields.FILE_TAG_SEARCHABLE]).to.equal('Tag1')
    })
  })

  describe('constructSearchQuery', () => {
    it('should construct a search query from form data', () => {
      const formData: AdvancedSearchFormData = {
        collections: {
          [SearchFields.DATAVERSE_NAME]: 'Test Dataverse',
          [SearchFields.DATAVERSE_ALIAS]: 'test-dataverse',
          [SearchFields.DATAVERSE_AFFILIATION]: 'Test Affiliation',
          [SearchFields.DATAVERSE_DESCRIPTION]: 'Test Description',
          [SearchFields.DATAVERSE_SUBJECT]: ['Chemistry', 'Law']
        },
        datasets: {
          title: 'Foo',
          authorName: 'Bar',
          subject: ['Physics', 'Engineering']
        },
        files: {
          [SearchFields.FILE_NAME]: 'Test File Name',
          [SearchFields.FILE_DESCRIPTION]: 'Test File Description',
          [SearchFields.FILE_TYPE_SEARCHABLE]: ' ',
          [SearchFields.FILE_PERSISTENT_ID]: 'pid123',
          [SearchFields.VARIABLE_NAME]: 'Variable1',
          [SearchFields.VARIABLE_LABEL]: 'Variable Label 1',
          [SearchFields.FILE_TAG_SEARCHABLE]: 'Tag1'
        }
      }

      const query = AdvancedSearchHelper.constructSearchQuery(formData)
      // Collections fields
      expect(query).to.include(
        `(${SearchFields.DATAVERSE_NAME}:Test ${SearchFields.DATAVERSE_NAME}:Dataverse)`
      )
      expect(query).to.include(`${SearchFields.DATAVERSE_ALIAS}:test-dataverse`)
      expect(query).to.include(
        `(${SearchFields.DATAVERSE_AFFILIATION}:Test ${SearchFields.DATAVERSE_AFFILIATION}:Affiliation)`
      )
      expect(query).to.include(
        `(${SearchFields.DATAVERSE_DESCRIPTION}:Test ${SearchFields.DATAVERSE_DESCRIPTION}:Description)`
      )
      expect(query).to.include(
        `(${SearchFields.DATAVERSE_SUBJECT}:"Chemistry" OR ${SearchFields.DATAVERSE_SUBJECT}:"Law")`
      )

      // Datasets fields
      expect(query).to.include('title:Foo')
      expect(query).to.include('authorName:Bar')
      expect(query).to.include(`(subject:"Physics" OR subject:"Engineering")`)

      // Files fields
      expect(query).to.include(
        `(${SearchFields.FILE_NAME}:Test ${SearchFields.FILE_NAME}:File ${SearchFields.FILE_NAME}:Name)`
      )
      expect(query).to.include(
        `(${SearchFields.FILE_DESCRIPTION}:Test ${SearchFields.FILE_DESCRIPTION}:File ${SearchFields.FILE_DESCRIPTION}:Description)`
      )
      expect(query).not.to.include(`${SearchFields.FILE_TYPE_SEARCHABLE}`)
      expect(query).to.include(`${SearchFields.FILE_PERSISTENT_ID}:pid123`)
      expect(query).to.include(`${SearchFields.VARIABLE_NAME}:Variable1`)
      expect(query).to.include(
        `(${SearchFields.VARIABLE_LABEL}:Variable ${SearchFields.VARIABLE_LABEL}:Label ${SearchFields.VARIABLE_LABEL}:1)`
      )
      expect(query).to.include(`${SearchFields.FILE_TAG_SEARCHABLE}:Tag1`)
    })
  })
})
