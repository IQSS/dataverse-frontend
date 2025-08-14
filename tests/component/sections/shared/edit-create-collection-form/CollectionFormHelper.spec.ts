import { CollectionInputLevel } from '@/collection/domain/models/CollectionInputLevel'
import { CollectionContact } from '@/collection/domain/models/CollectionContact'
import { CollectionInputLevelDTO } from '@/collection/domain/useCases/DTOs/CollectionDTO'
import {
  MetadataBlockInfo,
  MetadataField
} from '@/metadata-block-info/domain/models/MetadataBlockInfo'
import { CollectionFormHelper } from '@/sections/shared/form/EditCreateCollectionForm/CollectionFormHelper'
import {
  CollectionFormContactValue,
  CollectionFormDirtyFields,
  FormattedCollectionInputLevels,
  FormattedCollectionInputLevelsWithoutParentBlockName,
  MetadataFieldWithParentBlockInfo
} from '@/sections/shared/form/EditCreateCollectionForm/types'

const allMetadataBlocksInfoMock: MetadataBlockInfo[] = [
  {
    id: 4,
    name: 'astrophysics',
    displayName: 'Astronomy and Astrophysics Metadata',
    displayOnCreate: true,
    metadataFields: {
      requiredField: {
        name: 'requiredField',
        displayName: 'Spatial Resolution',
        isRequired: true,
        title: '',
        type: 'TEXT',
        typeClass: 'primitive',
        watermark: '',
        description: '',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '',
        displayOnCreate: true,
        displayOrder: 0
      },
      'coverage.Spectral.Wavelength': {
        name: 'coverage.Spectral.Wavelength',
        displayName: 'Wavelength Range',
        isRequired: false,
        displayOnCreate: true,
        title: '',
        type: 'TEXT',
        typeClass: 'primitive',
        watermark: '',
        description: '',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '',
        displayOrder: 0,
        childMetadataFields: {
          'coverage.Spectral.MinimumWavelength': {
            name: 'coverage.Spectral.MinimumWavelength',
            displayName: 'Wavelength Range Minimum (m)',
            isRequired: false,
            title: '',
            type: 'TEXT',
            typeClass: 'primitive',
            watermark: '',
            description: '',
            multiple: false,
            isControlledVocabulary: false,
            displayFormat: '',
            displayOrder: 0,
            displayOnCreate: true
          },
          bar: {
            name: 'bar',
            displayName: 'Bar',
            isRequired: true,
            title: '',
            type: 'TEXT',
            typeClass: 'primitive',
            watermark: '',
            description: '',
            multiple: false,
            isControlledVocabulary: false,
            displayFormat: '',
            displayOnCreate: true,
            displayOrder: 0
          }
        }
      }
    }
  }
]

const expectedBaseInputLevels: FormattedCollectionInputLevels = {
  bar: {
    include: true,
    optionalOrRequired: 'required',
    parentBlockName: 'astrophysics'
  },
  'coverage/Spectral/MinimumWavelength': {
    include: true,
    optionalOrRequired: 'optional',
    parentBlockName: 'astrophysics'
  },
  'coverage/Spectral/Wavelength': {
    include: true,
    optionalOrRequired: 'optional',
    parentBlockName: 'astrophysics'
  },
  requiredField: {
    include: true,
    optionalOrRequired: 'required',
    parentBlockName: 'astrophysics'
  }
}

describe('CollectionFormHelper', () => {
  it('defineBaseInputLevels helper', () => {
    const result = CollectionFormHelper.defineBaseInputLevels(allMetadataBlocksInfoMock)

    expect(result).to.deep.equal(expectedBaseInputLevels)
  })

  it('formatCollectiontInputLevels', () => {
    const collectionInputLevels: CollectionInputLevel[] = [
      {
        datasetFieldName: 'coverage.Spectral.Wavelength',
        include: true,
        required: false
      },
      {
        datasetFieldName: 'bar',
        include: true,
        required: true
      }
    ]

    const result = CollectionFormHelper.formatCollectiontInputLevels(collectionInputLevels)
    const undefinedResult = CollectionFormHelper.formatCollectiontInputLevels(undefined)

    expect(result).to.deep.equal({
      bar: {
        include: true,
        optionalOrRequired: 'required'
      },
      'coverage/Spectral/Wavelength': {
        include: true,
        optionalOrRequired: 'optional'
      }
    })

    expect(undefinedResult).to.deep.equal({})
  })

  it('mergeBaseAndDefaultInputLevels', () => {
    const baseInputLevels: FormattedCollectionInputLevels = {
      'coverage/Spectral/Wavelength': {
        include: true,
        optionalOrRequired: 'optional',
        parentBlockName: 'astrophysics'
      },
      foo: {
        include: true,
        optionalOrRequired: 'optional',
        parentBlockName: 'astrophysics'
      }
    }

    const formattedCollectionInputLevels: FormattedCollectionInputLevelsWithoutParentBlockName = {
      'coverage/Spectral/Wavelength': {
        include: true,
        optionalOrRequired: 'optional'
      },
      foo: {
        include: true,
        optionalOrRequired: 'required'
      }
    }
    const result = CollectionFormHelper.mergeBaseAndDefaultInputLevels(
      baseInputLevels,
      formattedCollectionInputLevels
    )

    expect(result).to.deep.equal({
      'coverage/Spectral/Wavelength': {
        include: true,
        optionalOrRequired: 'optional',
        parentBlockName: 'astrophysics'
      },
      foo: {
        include: true,
        optionalOrRequired: 'required',
        parentBlockName: 'astrophysics'
      }
    })
  })

  it('formatFormMetadataBlockNamesToMetadataBlockNamesDTO', () => {
    const formMetadataBlockNames = {
      citation: true,
      geospatial: false,
      socialscience: true,
      astrophysics: false,
      biomedical: true,
      journal: false,
      codeMeta20: false,
      computationalworkflow: false
    }

    const result =
      CollectionFormHelper.formatFormMetadataBlockNamesToMetadataBlockNamesDTO(
        formMetadataBlockNames
      )

    expect(result).to.deep.equal(['citation', 'socialscience', 'biomedical'])
  })

  it('formatFormInputLevelsToInputLevelsDTO', () => {
    const metadataBlockNamesSelected = ['citation', 'socialscience']
    const formCollectionInputLevels: FormattedCollectionInputLevels = {
      title: {
        include: true,
        optionalOrRequired: 'required',
        parentBlockName: 'citation'
      },
      subtitle: {
        include: true,
        optionalOrRequired: 'optional',
        parentBlockName: 'citation'
      },
      foo: {
        include: true,
        optionalOrRequired: 'required',
        parentBlockName: 'socialscience'
      },
      bar: {
        include: true,
        optionalOrRequired: 'optional',
        parentBlockName: 'socialscience'
      }
    }

    const expectedResult: CollectionInputLevelDTO[] = [
      {
        datasetFieldName: 'title',
        include: true,
        required: true
      },
      {
        datasetFieldName: 'subtitle',
        include: true,
        required: false
      },
      {
        datasetFieldName: 'foo',
        include: true,
        required: true
      },
      {
        datasetFieldName: 'bar',
        include: true,
        required: false
      }
    ]

    const result = CollectionFormHelper.formatFormInputLevelsToInputLevelsDTO(
      metadataBlockNamesSelected,
      formCollectionInputLevels
    )

    expect(result).to.deep.equal(expectedResult)
  })

  it('getChildFieldSiblings', () => {
    const childMetadataFields: Record<string, MetadataField> = {
      'coverage.Spectral.MinimumWavelength': {
        name: 'coverage.Spectral.MinimumWavelength',
        displayName: 'Wavelength Range Minimum (m)',
        isRequired: false,
        title: '',
        type: 'TEXT',
        typeClass: 'primitive',
        watermark: '',
        description: '',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '',
        displayOnCreate: true,
        displayOrder: 0
      },
      bar: {
        name: 'bar',
        displayName: 'Bar',
        isRequired: true,
        title: '',
        type: 'TEXT',
        typeClass: 'primitive',
        watermark: '',
        description: '',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '',
        displayOnCreate: true,
        displayOrder: 0
      },
      foo: {
        name: 'foo',
        displayName: 'Foo',
        isRequired: false,
        title: '',
        type: 'TEXT',
        typeClass: 'primitive',
        watermark: '',
        description: '',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '',
        displayOnCreate: true,
        displayOrder: 0
      }
    }
    const targetChildFieldName = 'bar'

    const result = CollectionFormHelper.getChildFieldSiblings(
      childMetadataFields,
      targetChildFieldName
    )

    expect(result).to.deep.equal({
      'coverage.Spectral.MinimumWavelength': {
        name: 'coverage.Spectral.MinimumWavelength',
        displayName: 'Wavelength Range Minimum (m)',
        isRequired: false,
        title: '',
        type: 'TEXT',
        typeClass: 'primitive',
        watermark: '',
        description: '',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '',
        displayOnCreate: true,
        displayOrder: 0
      },
      foo: {
        name: 'foo',
        displayName: 'Foo',
        isRequired: false,
        title: '',
        type: 'TEXT',
        typeClass: 'primitive',
        watermark: '',
        description: '',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '',
        displayOnCreate: true,
        displayOrder: 0
      }
    })
  })

  it('assignBlockInfoToFacetableMetadataFields', () => {
    const facetableMetadataFields: MetadataField[] = [
      {
        name: 'foo',
        displayName: 'Foo',
        title: 'Foo',
        type: 'TEXT',
        watermark: '',
        description: '',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: false,
        displayOrder: 1,
        typeClass: 'primitive',
        displayOnCreate: false
      },
      {
        name: 'bar',
        displayName: 'Bar',
        title: 'Bar',
        type: 'TEXT',
        watermark: '',
        description: '',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: false,
        displayOrder: 2,
        typeClass: 'primitive',
        displayOnCreate: false
      },
      {
        name: 'doe',
        displayName: 'Doe',
        title: 'Doe',
        type: 'TEXT',
        watermark: '',
        description: '',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: false,
        displayOrder: 3,
        typeClass: 'primitive',
        displayOnCreate: false
      }
    ]

    const allMetadataBlocksInfo: MetadataBlockInfo[] = [
      {
        id: 1,
        name: 'citation',
        displayName: 'Citation Metadata',
        displayOnCreate: true,
        metadataFields: {
          foo: {
            name: 'foo',
            displayName: 'Foo',
            title: 'Foo',
            type: 'TEXT',
            watermark: '',
            description: '',
            multiple: false,
            isControlledVocabulary: false,
            displayFormat: '',
            isRequired: false,
            displayOrder: 1,
            typeClass: 'primitive',
            displayOnCreate: false,
            childMetadataFields: {
              bar: {
                name: 'bar',
                displayName: 'Bar',
                title: 'Bar',
                type: 'TEXT',
                watermark: '',
                description: '',
                multiple: false,
                isControlledVocabulary: false,
                displayFormat: '',
                isRequired: false,
                displayOrder: 2,
                typeClass: 'primitive',
                displayOnCreate: false
              }
            }
          }
        }
      },
      {
        id: 4,
        name: 'astrophysics',
        displayName: 'Astronomy and Astrophysics Metadata',
        displayOnCreate: false,
        metadataFields: {
          doe: {
            name: 'doe',
            displayName: 'Doe',
            title: 'Doe',
            type: 'TEXT',
            watermark: '',
            description: '',
            multiple: false,
            isControlledVocabulary: false,
            displayFormat: '',
            isRequired: false,
            displayOrder: 3,
            typeClass: 'primitive',
            displayOnCreate: false
          }
        }
      }
    ]

    const result = CollectionFormHelper.assignBlockInfoToFacetableMetadataFields(
      facetableMetadataFields,
      allMetadataBlocksInfo
    )

    const expectedResult: MetadataFieldWithParentBlockInfo[] = [
      {
        name: 'foo',
        displayName: 'Foo',
        title: 'Foo',
        type: 'TEXT',
        watermark: '',
        description: '',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: false,
        displayOrder: 1,
        typeClass: 'primitive',
        displayOnCreate: false,
        parentBlockInfo: {
          id: 1,
          name: 'citation',
          displayName: 'Citation Metadata'
        }
      },
      {
        name: 'bar',
        displayName: 'Bar',
        title: 'Bar',
        type: 'TEXT',
        watermark: '',
        description: '',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: false,
        displayOrder: 2,
        typeClass: 'primitive',
        displayOnCreate: false,
        parentBlockInfo: {
          id: 1,
          name: 'citation',
          displayName: 'Citation Metadata'
        }
      },
      {
        name: 'doe',
        displayName: 'Doe',
        title: 'Doe',
        type: 'TEXT',
        watermark: '',
        description: '',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: false,
        displayOrder: 3,
        typeClass: 'primitive',
        displayOnCreate: false,
        parentBlockInfo: {
          id: 4,
          name: 'astrophysics',
          displayName: 'Astronomy and Astrophysics Metadata'
        }
      }
    ]

    expect(result).to.deep.equal(expectedResult)
  })

  it('replaces string with dots with slashes', () => {
    const result = CollectionFormHelper.replaceDotWithSlash('coverage.Spectral.MinimumWavelength')

    expect(result).to.equal('coverage/Spectral/MinimumWavelength')
  })

  it('replaces string with slashes with dots', () => {
    const result = CollectionFormHelper.replaceSlashWithDot('coverage/Spectral/MinimumWavelength')

    expect(result).to.equal('coverage.Spectral.MinimumWavelength')
  })

  it('formats collection contacts to form contacts values', () => {
    const collectionContacts: CollectionContact[] = [
      {
        email: 'test1@mail.com',
        displayOrder: 0
      },
      {
        email: 'test2@mail.com',
        displayOrder: 1
      }
    ]
    const expected: CollectionFormContactValue[] = [
      {
        value: 'test1@mail.com'
      },
      {
        value: 'test2@mail.com'
      }
    ]

    const result = CollectionFormHelper.formatCollectionContactsToFormContacts(collectionContacts)

    expect(result).to.deep.equal(expected)
  })

  it('formats empty collection contacts to empty form contacts values ', () => {
    const collectionContacts: CollectionContact[] = []

    const result = CollectionFormHelper.formatCollectionContactsToFormContacts(collectionContacts)

    expect(result).to.deep.equal([{ value: '' }])
  })

  it('gets the input levels values that were modified only', () => {
    const collectionInputLevelsFormValues: FormattedCollectionInputLevels = {
      title: {
        include: true,
        optionalOrRequired: 'required',
        parentBlockName: 'citation'
      },
      subtitle: {
        include: false,
        optionalOrRequired: 'optional',
        parentBlockName: 'citation'
      },
      foo: {
        include: true,
        optionalOrRequired: 'required',
        parentBlockName: 'socialscience'
      },
      bar: {
        include: false,
        optionalOrRequired: 'optional',
        parentBlockName: 'socialscience'
      }
    }

    // This is what we expect from the form.formState.dirtyFields object from the react-hook-form library
    // Only the input levels fields and their properties that were modified
    const dirtyFields: CollectionFormDirtyFields['inputLevels'] = {
      subtitle: { optionalOrRequired: true },
      foo: { include: true }
    }

    const result = CollectionFormHelper.getModifiedInputLevelValuesOnly(
      dirtyFields,
      collectionInputLevelsFormValues
    )

    expect(result).to.deep.equal({
      subtitle: {
        include: false,
        optionalOrRequired: 'optional',
        parentBlockName: 'citation'
      },
      foo: {
        include: true,
        optionalOrRequired: 'required',
        parentBlockName: 'socialscience'
      }
    })
  })

  describe('defineShouldCheckUseFromParent', () => {
    it('returns false if is on edit mode and is editing the root collection', () => {
      const result = CollectionFormHelper.defineShouldCheckUseFromParent(true, true, true)

      expect(result).to.equal(false)
    })

    it('returns false if is on edit mode and is not editing the root collection and isMetadataBlockOrFacetRoot is true', () => {
      const result = CollectionFormHelper.defineShouldCheckUseFromParent(true, false, true)

      expect(result).to.equal(false)
    })

    it('returns true if is on edit mode and is not editing the root collection and isMetadataBlockOrFacetRoot is false', () => {
      const result = CollectionFormHelper.defineShouldCheckUseFromParent(true, false, false)

      expect(result).to.equal(true)
    })

    it('should return true if is not on edit mode', () => {
      const result = CollectionFormHelper.defineShouldCheckUseFromParent(false, false, true)

      expect(result).to.equal(true)
    })
  })
})
