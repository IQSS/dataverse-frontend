import { RequiredFieldsHelper } from '@/sections/shared/form/DatasetMetadataForm/MetadataForm/RequiredFieldsFirstLayout/RequiredFieldsHelper'
import { MetadataFieldsHelper } from '@/sections/shared/form/DatasetMetadataForm/MetadataFieldsHelper'
import { MetadataBlockInfoMother } from '../../../metadata-block-info/domain/models/MetadataBlockInfoMother'

const metadataBlocksInfo = MetadataFieldsHelper.replaceMetadataBlocksInfoDotNamesKeysWithSlash(
  MetadataBlockInfoMother.getByCollectionIdDisplayedOnCreateTrue()
)
const citationBlock = metadataBlocksInfo[0]

// A block whose only field is required, to check that blocks without optional fields are dropped
const blockWithOnlyRequiredFields = {
  ...MetadataBlockInfoMother.getAstrophysicsBlock(),
  metadataFields: {
    objectCount: { ...citationBlock.metadataFields.title, name: 'objectCount', isRequired: true }
  }
}

const findEntry = (fieldName: string) =>
  RequiredFieldsHelper.collectRequiredFields(metadataBlocksInfo).find(
    (entry) => entry.field.name === fieldName
  )

describe('RequiredFieldsHelper', () => {
  it('collects the required top-level fields of every block, with their block names', () => {
    const entries = RequiredFieldsHelper.collectRequiredFields(metadataBlocksInfo)

    expect(entries.map((entry) => entry.field.name)).to.deep.equal([
      'title',
      'author',
      'datasetContact',
      'dsDescription',
      'subject',
      'geographicCoverage'
    ])
    expect(entries.map((entry) => entry.blockName)).to.deep.equal([
      'citation',
      'citation',
      'citation',
      'citation',
      'citation',
      'geospatial'
    ])
    expect(entries[0].blockDisplayName).to.equal('Citation Metadata')
    expect(entries[5].blockDisplayName).to.equal('Geospatial Metadata')
  })

  it('builds the form name of a required field from its block and field names', () => {
    const entry = findEntry('title')

    expect(entry && RequiredFieldsHelper.getFormName(entry)).to.equal('citation.title')
  })

  describe('isFilled', () => {
    it('treats a text field as filled only when it holds text', () => {
      const title = citationBlock.metadataFields.title

      expect(RequiredFieldsHelper.isFilled(title, 'A title')).to.be.true
      expect(RequiredFieldsHelper.isFilled(title, '')).to.be.false
      expect(RequiredFieldsHelper.isFilled(title, '   ')).to.be.false
      expect(RequiredFieldsHelper.isFilled(title, undefined)).to.be.false
    })

    it('treats a multiple vocabulary field as filled when at least one value is chosen', () => {
      const subject = citationBlock.metadataFields.subject

      expect(RequiredFieldsHelper.isFilled(subject, ['Chemistry'])).to.be.true
      expect(RequiredFieldsHelper.isFilled(subject, [])).to.be.false
    })

    it('treats a multiple text field as filled when at least one row holds text', () => {
      const field = { ...citationBlock.metadataFields.title, multiple: true }

      expect(RequiredFieldsHelper.isFilled(field, [{ value: '' }, { value: 'Other' }])).to.be.true
      expect(RequiredFieldsHelper.isFilled(field, [{ value: '' }])).to.be.false
    })

    it('treats a composed field as filled when every row has all its required child fields filled', () => {
      const author = citationBlock.metadataFields.author

      expect(
        RequiredFieldsHelper.isFilled(author, [
          { authorName: 'Potts, James', authorAffiliation: '' }
        ])
      ).to.be.true
      expect(
        RequiredFieldsHelper.isFilled(author, [{ authorName: '', authorAffiliation: 'Harvard' }])
      ).to.be.false
      expect(
        RequiredFieldsHelper.isFilled(author, [
          { authorName: 'Potts, James', authorAffiliation: '' },
          { authorName: '', authorAffiliation: '' }
        ])
      ).to.be.false
      expect(RequiredFieldsHelper.isFilled(author, [])).to.be.false
      expect(RequiredFieldsHelper.isFilled(author, undefined)).to.be.false
    })

    it('treats a composed field without required child fields as filled when any child holds a value', () => {
      const keyword = citationBlock.metadataFields.keyword

      expect(
        RequiredFieldsHelper.isFilled(keyword, [{ keywordValue: 'Soil', keywordVocabulary: '' }])
      ).to.be.true
      expect(RequiredFieldsHelper.isFilled(keyword, [{ keywordValue: '', keywordVocabulary: '' }]))
        .to.be.false
    })
  })

  describe('getFirstEmptyControlName', () => {
    it('returns the field itself for a simple field', () => {
      const entry = findEntry('title')

      expect(entry && RequiredFieldsHelper.getFirstEmptyControlName(entry, '')).to.equal(
        'citation.title'
      )
    })

    it('returns the first empty required child field of a composed multiple field', () => {
      const entry = findEntry('datasetContact')

      expect(
        entry &&
          RequiredFieldsHelper.getFirstEmptyControlName(entry, [
            { datasetContactName: 'Potts, James', datasetContactEmail: 'a@b.edu' },
            { datasetContactName: '', datasetContactEmail: '' }
          ])
      ).to.equal('citation.datasetContact.1.datasetContactEmail')
    })

    it('returns the first required child field of a composed field without rows', () => {
      const entry = findEntry('dsDescription')

      expect(entry && RequiredFieldsHelper.getFirstEmptyControlName(entry, undefined)).to.equal(
        'citation.dsDescription.0.dsDescriptionValue'
      )
    })

    it('returns the first empty row of a multiple text field', () => {
      const entry = findEntry('title')
      const multipleEntry = entry && { ...entry, field: { ...entry.field, multiple: true } }

      expect(
        multipleEntry &&
          RequiredFieldsHelper.getFirstEmptyControlName(multipleEntry, [
            { value: 'One' },
            { value: '' }
          ])
      ).to.equal('citation.title.1.value')
    })
  })

  it('splits the required fields into still needed and completed from the form values', () => {
    const entries = RequiredFieldsHelper.collectRequiredFields(metadataBlocksInfo)
    const values = MetadataFieldsHelper.getFormDefaultValues(metadataBlocksInfo)
    values.citation.author = [{ authorName: 'Potts, James', authorAffiliation: 'Harvard' }]
    values.citation.datasetContact = [
      { datasetContactName: 'Potts, James', datasetContactEmail: 'jamesPotts@g.harvard.edu' }
    ]

    const { stillNeeded, completed } = RequiredFieldsHelper.splitByValues(entries, values)

    expect(stillNeeded.map((entry) => entry.field.name)).to.deep.equal([
      'title',
      'dsDescription',
      'subject',
      'geographicCoverage'
    ])
    expect(completed.map((entry) => entry.field.name)).to.deep.equal(['author', 'datasetContact'])
  })

  it('groups entries by block keeping the block order', () => {
    const entries = RequiredFieldsHelper.collectRequiredFields([
      ...metadataBlocksInfo,
      blockWithOnlyRequiredFields
    ])

    const groups = RequiredFieldsHelper.groupByBlock(entries)

    expect(groups.map((group) => group.blockName)).to.deep.equal([
      'citation',
      'geospatial',
      'astrophysics'
    ])
    expect(groups[0].entries).to.have.length(5)
    expect(groups[1].entries.map((entry) => entry.field.name)).to.deep.equal(['geographicCoverage'])
    expect(groups[2].entries.map((entry) => entry.field.name)).to.deep.equal(['objectCount'])
  })

  it('keeps only the optional fields of each block and drops blocks left without fields', () => {
    const blocks = RequiredFieldsHelper.getOptionalFieldsBlocks([
      ...metadataBlocksInfo,
      blockWithOnlyRequiredFields
    ])

    expect(blocks.map((block) => block.name)).to.deep.equal(['citation', 'geospatial'])
    blocks.forEach((block) => {
      expect(Object.values(block.metadataFields).every((field) => !field.isRequired)).to.be.true
    })
    expect(Object.keys(blocks[0].metadataFields)).to.not.include('title')
    expect(Object.keys(blocks[1].metadataFields)).to.not.include('geographicCoverage')
  })

  it('lists the titles of the fields of the given blocks', () => {
    const titles = RequiredFieldsHelper.getFieldTitles(
      RequiredFieldsHelper.getOptionalFieldsBlocks(metadataBlocksInfo)
    )

    expect(titles).to.not.be.empty
    expect(titles).to.not.include('Title')
  })
})
