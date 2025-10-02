import { DatasetMetadataBlocks } from '../../../../../src/dataset/domain/models/Dataset'
import { DatasetDTO } from '../../../../../src/dataset/domain/useCases/DTOs/DatasetDTO'
import {
  MetadataBlockInfo,
  MetadataBlockInfoWithMaybeValues
} from '../../../../../src/metadata-block-info/domain/models/MetadataBlockInfo'
import {
  DatasetMetadataFormValues,
  DateErrorCode,
  DateLikeKind,
  MetadataFieldsHelper
} from '../../../../../src/sections/shared/form/DatasetMetadataForm/MetadataFieldsHelper'
import { defaultLicense } from '../../../../../src/dataset/domain/models/Dataset'

const metadataBlocksInfo: MetadataBlockInfo[] = [
  {
    id: 10,
    name: 'foo',
    displayName: 'Foo Metadata',
    displayOnCreate: true,
    metadataFields: {
      someKeyWithoutDot: {
        name: 'someKeyWithoutDot',
        displayName: 'someKeyWithoutDot',
        title: 'Some key without dout',
        type: 'TEXT',
        typeClass: 'primitive',
        watermark: '',
        description: 'foo',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: true,
        displayOnCreate: true,
        displayOrder: 0,
        isAdvancedSearchFieldType: false
      },
      controlledVocabularyNotMultiple: {
        name: 'controlledVocabularyNotMultiple',
        displayName: 'Foo',
        title: 'Foo',
        type: 'TEXT',
        watermark: '',
        description: 'Something here',
        multiple: false,
        isControlledVocabulary: true,
        controlledVocabularyValues: ['Option1', 'Option2', 'Option3'],
        displayFormat: '- #VALUE:',
        isRequired: false,
        displayOrder: 10,
        typeClass: 'controlledVocabulary',
        displayOnCreate: true,
        isAdvancedSearchFieldType: false
      },
      controlledVocabularyMultiple: {
        name: 'controlledVocabularyMultiple',
        displayName: 'Foo',
        title: 'Foo',
        type: 'TEXT',
        watermark: '',
        description: 'Something here',
        multiple: true,
        isControlledVocabulary: true,
        controlledVocabularyValues: ['Option1', 'Option2', 'Option3'],
        displayFormat: '- #VALUE:',
        isRequired: false,
        displayOrder: 10,
        typeClass: 'controlledVocabulary',
        displayOnCreate: true,
        isAdvancedSearchFieldType: false
      },
      'primitive.text.not.multiple': {
        name: 'primitive.text.not.multiple',
        displayName: 'foo',
        title: 'foo',
        type: 'TEXT',
        typeClass: 'primitive',
        watermark: '',
        description: 'foo',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: true,
        displayOnCreate: true,
        displayOrder: 0,
        isAdvancedSearchFieldType: false
      },
      'primitive.text.multiple': {
        name: 'primitive.text.multiple',
        displayName: 'foo',
        title: 'foo',
        type: 'TEXT',
        typeClass: 'primitive',
        watermark: '',
        description: 'foo',
        multiple: true,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: true,
        displayOnCreate: true,
        displayOrder: 0,
        isAdvancedSearchFieldType: false
      },
      'primitive.textbox.not.multiple': {
        name: 'primitive.textbox.not.multiple',
        displayName: 'foo',
        title: 'foo',
        type: 'TEXTBOX',
        typeClass: 'primitive',
        watermark: '',
        description: 'foo',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: true,
        displayOnCreate: true,
        displayOrder: 0,
        isAdvancedSearchFieldType: false
      },
      'primitive.textbox.multiple': {
        name: 'primitive.textbox.multiple',
        displayName: 'foo',
        title: 'foo',
        type: 'TEXTBOX',
        typeClass: 'primitive',
        watermark: '',
        description: 'foo',
        multiple: true,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: true,
        displayOnCreate: true,
        displayOrder: 0,
        isAdvancedSearchFieldType: false
      },
      'primitive.float.not.multiple': {
        name: 'primitive.float.not.multiple',
        displayName: 'foo',
        title: 'foo',
        type: 'FLOAT',
        watermark: 'Enter a floating-point number.',
        description: 'foo',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: true,
        displayOrder: 22,
        typeClass: 'primitive',
        displayOnCreate: false,
        isAdvancedSearchFieldType: false
      },
      'primitive.float.multiple': {
        name: 'primitive.float.multiple',
        displayName: 'foo',
        title: 'foo',
        type: 'FLOAT',
        watermark: 'Enter a floating-point number.',
        description: 'foo',
        multiple: true,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: true,
        displayOrder: 22,
        typeClass: 'primitive',
        displayOnCreate: false,
        isAdvancedSearchFieldType: false
      },
      'primitive.int.not.multiple': {
        name: 'primitive.int.not.multiple',
        displayName: 'foo',
        title: 'foo',
        type: 'INT',
        watermark: 'Enter an integer.',
        description: 'foo',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: true,
        displayOrder: 18,
        typeClass: 'primitive',
        displayOnCreate: false,
        isAdvancedSearchFieldType: false
      },
      'primitive.int.multiple': {
        name: 'primitive.int.multiple',
        displayName: 'foo',
        title: 'foo',
        type: 'INT',
        watermark: 'Enter an integer.',
        description: 'foo',
        multiple: true,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: true,
        displayOrder: 18,
        typeClass: 'primitive',
        displayOnCreate: false,
        isAdvancedSearchFieldType: false
      },
      'primitive.date.not.multiple': {
        name: 'primitive.date.not.multiple',
        displayName: 'foo',
        title: 'foo',
        type: 'DATE',
        watermark: 'YYYY-MM-DD',
        description:
          'The date when the data were produced (not distributed, published, or archived)',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: false,
        displayOrder: 42,
        typeClass: 'primitive',
        displayOnCreate: false,
        isAdvancedSearchFieldType: false
      },
      'primitive.date.multiple': {
        name: 'primitive.date.multiple',
        displayName: 'foo',
        title: 'foo',
        type: 'DATE',
        watermark: 'YYYY-MM-DD',
        description:
          'The date when the data were produced (not distributed, published, or archived)',
        multiple: true,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: false,
        displayOrder: 42,
        typeClass: 'primitive',
        displayOnCreate: false,
        isAdvancedSearchFieldType: false
      },
      'composed.field.multiple': {
        name: 'composed.field.multiple',
        displayName: 'Foo',
        title: 'Foo',
        type: 'NONE',
        typeClass: 'compound',
        watermark: '',
        description: 'foo',
        multiple: true,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: false,
        displayOnCreate: true,
        displayOrder: 12,
        isAdvancedSearchFieldType: false,
        childMetadataFields: {
          'subfield.1': {
            name: 'subfield.1',
            displayName: 'bar',
            title: 'Start',
            type: 'DATE',
            typeClass: 'primitive',
            watermark: 'YYYY-MM-DD',
            description: 'bar',
            multiple: false,
            isControlledVocabulary: false,
            displayFormat: '',
            isRequired: false,
            displayOnCreate: true,
            displayOrder: 13,
            isAdvancedSearchFieldType: false
          },
          'subfield.2': {
            name: 'subfield.2',
            displayName: 'bar',
            title: 'End',
            type: 'DATE',
            typeClass: 'primitive',
            watermark: 'YYYY-MM-DD',
            description: 'bar',
            multiple: false,
            isControlledVocabulary: false,
            displayFormat: '',
            isRequired: false,
            displayOnCreate: true,
            displayOrder: 14,
            isAdvancedSearchFieldType: false
          },
          someNestedKeyWithoutDot: {
            name: 'someNestedKeyWithoutDot',
            displayName: 'someNestedKeyWithoutDot',
            title: 'Some nested key without dout',
            type: 'TEXT',
            typeClass: 'primitive',
            watermark: '',
            description: 'foo',
            multiple: false,
            isControlledVocabulary: false,
            displayFormat: '',
            isRequired: true,
            displayOnCreate: true,
            displayOrder: 0,
            isAdvancedSearchFieldType: false
          },
          controlledVocabularyNotMultiple: {
            name: 'controlledVocabularyNotMultiple',
            displayName: 'Foo',
            title: 'Foo',
            type: 'TEXT',
            watermark: '',
            description: 'Something here',
            multiple: false,
            isControlledVocabulary: true,
            controlledVocabularyValues: ['Option1', 'Option2', 'Option3'],
            displayFormat: '- #VALUE:',
            isRequired: false,
            displayOrder: 10,
            typeClass: 'controlledVocabulary',
            displayOnCreate: true,
            isAdvancedSearchFieldType: false
          }
        }
      },
      'composed.field.not.multiple': {
        name: 'composed.field.not.multiple',
        displayName: 'Foo',
        title: 'Foo',
        type: 'NONE',
        typeClass: 'compound',
        watermark: '',
        description: 'foo',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: false,
        displayOnCreate: true,
        displayOrder: 12,
        isAdvancedSearchFieldType: false,
        childMetadataFields: {
          'subfield.1': {
            name: 'subfield.1',
            displayName: 'bar',
            title: 'Start',
            type: 'DATE',
            typeClass: 'primitive',
            watermark: 'YYYY-MM-DD',
            description: 'bar',
            multiple: false,
            isControlledVocabulary: false,
            displayFormat: '',
            isRequired: false,
            displayOnCreate: true,
            displayOrder: 13,
            isAdvancedSearchFieldType: false
          },
          'subfield.2': {
            name: 'subfield.2',
            displayName: 'bar',
            title: 'End',
            type: 'DATE',
            typeClass: 'primitive',
            watermark: 'YYYY-MM-DD',
            description: 'bar',
            multiple: false,
            isControlledVocabulary: false,
            displayFormat: '',
            isRequired: false,
            displayOnCreate: true,
            displayOrder: 14,
            isAdvancedSearchFieldType: false
          },
          someNestedKeyWithoutDot: {
            name: 'someNestedKeyWithoutDot',
            displayName: 'someNestedKeyWithoutDot',
            title: 'Some nested key without dout',
            type: 'TEXT',
            typeClass: 'primitive',
            watermark: '',
            description: 'foo',
            multiple: false,
            isControlledVocabulary: false,
            displayFormat: '',
            isRequired: true,
            displayOnCreate: true,
            displayOrder: 0,
            isAdvancedSearchFieldType: false
          }
        }
      }
    }
  }
]

const normalizedMetadataBlocksInfo: MetadataBlockInfo[] = [
  {
    id: 10,
    name: 'foo',
    displayName: 'Foo Metadata',
    displayOnCreate: true,
    metadataFields: {
      someKeyWithoutDot: {
        name: 'someKeyWithoutDot',
        displayName: 'someKeyWithoutDot',
        title: 'Some key without dout',
        type: 'TEXT',
        typeClass: 'primitive',
        watermark: '',
        description: 'foo',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: true,
        displayOnCreate: true,
        displayOrder: 0,
        isAdvancedSearchFieldType: false
      },
      controlledVocabularyNotMultiple: {
        name: 'controlledVocabularyNotMultiple',
        displayName: 'Foo',
        title: 'Foo',
        type: 'TEXT',
        watermark: '',
        description: 'Something here',
        multiple: false,
        isControlledVocabulary: true,
        controlledVocabularyValues: ['Option1', 'Option2', 'Option3'],
        displayFormat: '- #VALUE:',
        isRequired: false,
        displayOrder: 10,
        typeClass: 'controlledVocabulary',
        displayOnCreate: true,
        isAdvancedSearchFieldType: false
      },
      controlledVocabularyMultiple: {
        name: 'controlledVocabularyMultiple',
        displayName: 'Foo',
        title: 'Foo',
        type: 'TEXT',
        watermark: '',
        description: 'Something here',
        multiple: true,
        isControlledVocabulary: true,
        controlledVocabularyValues: ['Option1', 'Option2', 'Option3'],
        displayFormat: '- #VALUE:',
        isRequired: false,
        displayOrder: 10,
        typeClass: 'controlledVocabulary',
        displayOnCreate: true,
        isAdvancedSearchFieldType: false
      },
      'primitive/text/not/multiple': {
        name: 'primitive/text/not/multiple',
        displayName: 'foo',
        title: 'foo',
        type: 'TEXT',
        typeClass: 'primitive',
        watermark: '',
        description: 'foo',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: true,
        displayOnCreate: true,
        displayOrder: 0,
        isAdvancedSearchFieldType: false
      },
      'primitive/text/multiple': {
        name: 'primitive/text/multiple',
        displayName: 'foo',
        title: 'foo',
        type: 'TEXT',
        typeClass: 'primitive',
        watermark: '',
        description: 'foo',
        multiple: true,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: true,
        displayOnCreate: true,
        displayOrder: 0,
        isAdvancedSearchFieldType: false
      },
      'primitive/textbox/not/multiple': {
        name: 'primitive/textbox/not/multiple',
        displayName: 'foo',
        title: 'foo',
        type: 'TEXTBOX',
        typeClass: 'primitive',
        watermark: '',
        description: 'foo',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: true,
        displayOnCreate: true,
        displayOrder: 0,
        isAdvancedSearchFieldType: false
      },
      'primitive/textbox/multiple': {
        name: 'primitive/textbox/multiple',
        displayName: 'foo',
        title: 'foo',
        type: 'TEXTBOX',
        typeClass: 'primitive',
        watermark: '',
        description: 'foo',
        multiple: true,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: true,
        displayOnCreate: true,
        displayOrder: 0,
        isAdvancedSearchFieldType: false
      },
      'primitive/float/not/multiple': {
        name: 'primitive/float/not/multiple',
        displayName: 'foo',
        title: 'foo',
        type: 'FLOAT',
        watermark: 'Enter a floating-point number.',
        description: 'foo',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: true,
        displayOrder: 22,
        typeClass: 'primitive',
        displayOnCreate: false,
        isAdvancedSearchFieldType: false
      },
      'primitive/float/multiple': {
        name: 'primitive/float/multiple',
        displayName: 'foo',
        title: 'foo',
        type: 'FLOAT',
        watermark: 'Enter a floating-point number.',
        description: 'foo',
        multiple: true,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: true,
        displayOrder: 22,
        typeClass: 'primitive',
        displayOnCreate: false,
        isAdvancedSearchFieldType: false
      },
      'primitive/int/not/multiple': {
        name: 'primitive/int/not/multiple',
        displayName: 'foo',
        title: 'foo',
        type: 'INT',
        watermark: 'Enter an integer.',
        description: 'foo',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: true,
        displayOrder: 18,
        typeClass: 'primitive',
        displayOnCreate: false,
        isAdvancedSearchFieldType: false
      },
      'primitive/int/multiple': {
        name: 'primitive/int/multiple',
        displayName: 'foo',
        title: 'foo',
        type: 'INT',
        watermark: 'Enter an integer.',
        description: 'foo',
        multiple: true,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: true,
        displayOrder: 18,
        typeClass: 'primitive',
        displayOnCreate: false,
        isAdvancedSearchFieldType: false
      },
      'primitive/date/not/multiple': {
        name: 'primitive/date/not/multiple',
        displayName: 'foo',
        title: 'foo',
        type: 'DATE',
        watermark: 'YYYY-MM-DD',
        description:
          'The date when the data were produced (not distributed, published, or archived)',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: false,
        displayOrder: 42,
        typeClass: 'primitive',
        displayOnCreate: false,
        isAdvancedSearchFieldType: false
      },
      'primitive/date/multiple': {
        name: 'primitive/date/multiple',
        displayName: 'foo',
        title: 'foo',
        type: 'DATE',
        watermark: 'YYYY-MM-DD',
        description:
          'The date when the data were produced (not distributed, published, or archived)',
        multiple: true,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: false,
        displayOrder: 42,
        typeClass: 'primitive',
        displayOnCreate: false,
        isAdvancedSearchFieldType: false
      },
      'composed/field/multiple': {
        name: 'composed/field/multiple',
        displayName: 'Foo',
        title: 'Foo',
        type: 'NONE',
        typeClass: 'compound',
        watermark: '',
        description: 'foo',
        multiple: true,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: false,
        displayOnCreate: true,
        displayOrder: 12,
        isAdvancedSearchFieldType: false,
        childMetadataFields: {
          'subfield/1': {
            name: 'subfield/1',
            displayName: 'bar',
            title: 'Start',
            type: 'DATE',
            typeClass: 'primitive',
            watermark: 'YYYY-MM-DD',
            description: 'bar',
            multiple: false,
            isControlledVocabulary: false,
            displayFormat: '',
            isRequired: false,
            displayOnCreate: true,
            displayOrder: 13,
            isAdvancedSearchFieldType: false
          },
          'subfield/2': {
            name: 'subfield/2',
            displayName: 'bar',
            title: 'End',
            type: 'DATE',
            typeClass: 'primitive',
            watermark: 'YYYY-MM-DD',
            description: 'bar',
            multiple: false,
            isControlledVocabulary: false,
            displayFormat: '',
            isRequired: false,
            displayOnCreate: true,
            displayOrder: 14,
            isAdvancedSearchFieldType: false
          },
          someNestedKeyWithoutDot: {
            name: 'someNestedKeyWithoutDot',
            displayName: 'someNestedKeyWithoutDot',
            title: 'Some nested key without dout',
            type: 'TEXT',
            typeClass: 'primitive',
            watermark: '',
            description: 'foo',
            multiple: false,
            isControlledVocabulary: false,
            displayFormat: '',
            isRequired: true,
            displayOnCreate: true,
            displayOrder: 0,
            isAdvancedSearchFieldType: false
          },
          controlledVocabularyNotMultiple: {
            name: 'controlledVocabularyNotMultiple',
            displayName: 'Foo',
            title: 'Foo',
            type: 'TEXT',
            watermark: '',
            description: 'Something here',
            multiple: false,
            isControlledVocabulary: true,
            controlledVocabularyValues: ['Option1', 'Option2', 'Option3'],
            displayFormat: '- #VALUE:',
            isRequired: false,
            displayOrder: 10,
            typeClass: 'controlledVocabulary',
            displayOnCreate: true,
            isAdvancedSearchFieldType: false
          }
        }
      },
      'composed/field/not/multiple': {
        name: 'composed/field/not/multiple',
        displayName: 'Foo',
        title: 'Foo',
        type: 'NONE',
        typeClass: 'compound',
        watermark: '',
        description: 'foo',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: false,
        displayOnCreate: true,
        displayOrder: 12,
        isAdvancedSearchFieldType: false,
        childMetadataFields: {
          'subfield/1': {
            name: 'subfield/1',
            displayName: 'bar',
            title: 'Start',
            type: 'DATE',
            typeClass: 'primitive',
            watermark: 'YYYY-MM-DD',
            description: 'bar',
            multiple: false,
            isControlledVocabulary: false,
            displayFormat: '',
            isRequired: false,
            displayOnCreate: true,
            displayOrder: 13,
            isAdvancedSearchFieldType: false
          },
          'subfield/2': {
            name: 'subfield/2',
            displayName: 'bar',
            title: 'End',
            type: 'DATE',
            typeClass: 'primitive',
            watermark: 'YYYY-MM-DD',
            description: 'bar',
            multiple: false,
            isControlledVocabulary: false,
            displayFormat: '',
            isRequired: false,
            displayOnCreate: true,
            displayOrder: 14,
            isAdvancedSearchFieldType: false
          },
          someNestedKeyWithoutDot: {
            name: 'someNestedKeyWithoutDot',
            displayName: 'someNestedKeyWithoutDot',
            title: 'Some nested key without dout',
            type: 'TEXT',
            typeClass: 'primitive',
            watermark: '',
            description: 'foo',
            multiple: false,
            isControlledVocabulary: false,
            displayFormat: '',
            isRequired: true,
            displayOnCreate: true,
            displayOrder: 0,
            isAdvancedSearchFieldType: false
          }
        }
      }
    }
  }
]

const normalizedMetadataBlocksInfoWithValues: MetadataBlockInfoWithMaybeValues[] = [
  {
    id: 10,
    name: 'foo',
    displayName: 'Foo Metadata',
    displayOnCreate: true,
    metadataFields: {
      someKeyWithoutDot: {
        name: 'someKeyWithoutDot',
        displayName: 'someKeyWithoutDot',
        title: 'Some key without dout',
        type: 'TEXT',
        typeClass: 'primitive',
        watermark: '',
        description: 'foo',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: true,
        displayOnCreate: true,
        displayOrder: 0,
        value: 'bar',
        isAdvancedSearchFieldType: false
      },
      controlledVocabularyNotMultiple: {
        name: 'controlledVocabularyNotMultiple',
        displayName: 'Foo',
        title: 'Foo',
        type: 'TEXT',
        watermark: '',
        description: 'Something here',
        multiple: false,
        isControlledVocabulary: true,
        controlledVocabularyValues: ['Option1', 'Option2', 'Option3'],
        displayFormat: '- #VALUE:',
        isRequired: false,
        displayOrder: 10,
        typeClass: 'controlledVocabulary',
        displayOnCreate: true,
        value: 'Option2',
        isAdvancedSearchFieldType: false
      },
      controlledVocabularyMultiple: {
        name: 'controlledVocabularyMultiple',
        displayName: 'Foo',
        title: 'Foo',
        type: 'TEXT',
        watermark: '',
        description: 'Something here',
        multiple: true,
        isControlledVocabulary: true,
        controlledVocabularyValues: ['Option1', 'Option2', 'Option3'],
        displayFormat: '- #VALUE:',
        isRequired: false,
        displayOrder: 10,
        typeClass: 'controlledVocabulary',
        displayOnCreate: true,
        value: ['Option1'],
        isAdvancedSearchFieldType: false
      },
      'primitive/text/not/multiple': {
        name: 'primitive/text/not/multiple',
        displayName: 'foo',
        title: 'foo',
        type: 'TEXT',
        typeClass: 'primitive',
        watermark: '',
        description: 'foo',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: true,
        displayOnCreate: true,
        displayOrder: 0,
        value: 'foo',
        isAdvancedSearchFieldType: false
      },
      'primitive/text/multiple': {
        name: 'primitive/text/multiple',
        displayName: 'foo',
        title: 'foo',
        type: 'TEXT',
        typeClass: 'primitive',
        watermark: '',
        description: 'foo',
        multiple: true,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: true,
        displayOnCreate: true,
        displayOrder: 0,
        value: ['foo', 'bar'],
        isAdvancedSearchFieldType: false
      },
      'primitive/textbox/not/multiple': {
        name: 'primitive/textbox/not/multiple',
        displayName: 'foo',
        title: 'foo',
        type: 'TEXTBOX',
        typeClass: 'primitive',
        watermark: '',
        description: 'foo',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: true,
        displayOnCreate: true,
        displayOrder: 0,
        value: '',
        isAdvancedSearchFieldType: false
      },
      'primitive/textbox/multiple': {
        name: 'primitive/textbox/multiple',
        displayName: 'foo',
        title: 'foo',
        type: 'TEXTBOX',
        typeClass: 'primitive',
        watermark: '',
        description: 'foo',
        multiple: true,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: true,
        displayOnCreate: true,
        displayOrder: 0,
        value: [],
        isAdvancedSearchFieldType: false
      },
      'primitive/float/not/multiple': {
        name: 'primitive/float/not/multiple',
        displayName: 'foo',
        title: 'foo',
        type: 'FLOAT',
        watermark: 'Enter a floating-point number.',
        description: 'foo',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: true,
        displayOrder: 22,
        typeClass: 'primitive',
        displayOnCreate: false,
        value: '23.55',
        isAdvancedSearchFieldType: false
      },
      'primitive/float/multiple': {
        name: 'primitive/float/multiple',
        displayName: 'foo',
        title: 'foo',
        type: 'FLOAT',
        watermark: 'Enter a floating-point number.',
        description: 'foo',
        multiple: true,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: true,
        displayOrder: 22,
        typeClass: 'primitive',
        displayOnCreate: false,
        value: ['23.55', '45.55'],
        isAdvancedSearchFieldType: false
      },
      'primitive/int/not/multiple': {
        name: 'primitive/int/not/multiple',
        displayName: 'foo',
        title: 'foo',
        type: 'INT',
        watermark: 'Enter an integer.',
        description: 'foo',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: true,
        displayOrder: 18,
        typeClass: 'primitive',
        displayOnCreate: false,
        value: '23',
        isAdvancedSearchFieldType: false
      },
      'primitive/int/multiple': {
        name: 'primitive/int/multiple',
        displayName: 'foo',
        title: 'foo',
        type: 'INT',
        watermark: 'Enter an integer.',
        description: 'foo',
        multiple: true,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: true,
        displayOrder: 18,
        typeClass: 'primitive',
        displayOnCreate: false,
        value: ['23', '45'],
        isAdvancedSearchFieldType: false
      },
      'primitive/date/not/multiple': {
        name: 'primitive/date/not/multiple',
        displayName: 'foo',
        title: 'foo',
        type: 'DATE',
        watermark: 'YYYY-MM-DD',
        description:
          'The date when the data were produced (not distributed, published, or archived)',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: false,
        displayOrder: 42,
        typeClass: 'primitive',
        displayOnCreate: false,
        value: '2022-01-01',
        isAdvancedSearchFieldType: false
      },
      'primitive/date/multiple': {
        name: 'primitive/date/multiple',
        displayName: 'foo',
        title: 'foo',
        type: 'DATE',
        watermark: 'YYYY-MM-DD',
        description:
          'The date when the data were produced (not distributed, published, or archived)',
        multiple: true,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: false,
        displayOrder: 42,
        typeClass: 'primitive',
        displayOnCreate: false,
        value: ['2022-01-01', '2022-12-31'],
        isAdvancedSearchFieldType: false
      },
      'composed/field/multiple': {
        name: 'composed/field/multiple',
        displayName: 'Foo',
        title: 'Foo',
        type: 'NONE',
        typeClass: 'compound',
        watermark: '',
        description: 'foo',
        multiple: true,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: false,
        displayOnCreate: true,
        displayOrder: 12,
        isAdvancedSearchFieldType: false,
        childMetadataFields: {
          'subfield/1': {
            name: 'subfield/1',
            displayName: 'bar',
            title: 'Start',
            type: 'DATE',
            typeClass: 'primitive',
            watermark: 'YYYY-MM-DD',
            description: 'bar',
            multiple: false,
            isControlledVocabulary: false,
            displayFormat: '',
            isRequired: false,
            displayOnCreate: true,
            displayOrder: 13,
            isAdvancedSearchFieldType: false
          },
          'subfield/2': {
            name: 'subfield/2',
            displayName: 'bar',
            title: 'End',
            type: 'DATE',
            typeClass: 'primitive',
            watermark: 'YYYY-MM-DD',
            description: 'bar',
            multiple: false,
            isControlledVocabulary: false,
            displayFormat: '',
            isRequired: false,
            displayOnCreate: true,
            displayOrder: 14,
            isAdvancedSearchFieldType: false
          },
          someNestedKeyWithoutDot: {
            name: 'someNestedKeyWithoutDot',
            displayName: 'someNestedKeyWithoutDot',
            title: 'Some nested key without dout',
            type: 'TEXT',
            typeClass: 'primitive',
            watermark: '',
            description: 'foo',
            multiple: false,
            isControlledVocabulary: false,
            displayFormat: '',
            isRequired: true,
            displayOnCreate: true,
            displayOrder: 0,
            isAdvancedSearchFieldType: false
          },
          controlledVocabularyNotMultiple: {
            name: 'controlledVocabularyNotMultiple',
            displayName: 'Foo',
            title: 'Foo',
            type: 'TEXT',
            watermark: '',
            description: 'Something here',
            multiple: false,
            isControlledVocabulary: true,
            controlledVocabularyValues: ['Option1', 'Option2', 'Option3'],
            displayFormat: '- #VALUE:',
            isRequired: false,
            displayOrder: 10,
            typeClass: 'controlledVocabulary',
            displayOnCreate: true,
            isAdvancedSearchFieldType: false
          }
        },
        value: [
          {
            'subfield/1': 'foo',
            'subfield/2': 'bar',
            someNestedKeyWithoutDot: 'bar',
            controlledVocabularyNotMultiple: ''
          }
        ]
      },
      'composed/field/not/multiple': {
        name: 'composed/field/not/multiple',
        displayName: 'Foo',
        title: 'Foo',
        type: 'NONE',
        typeClass: 'compound',
        watermark: '',
        description: 'foo',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: false,
        displayOnCreate: true,
        displayOrder: 12,
        isAdvancedSearchFieldType: false,
        childMetadataFields: {
          'subfield/1': {
            name: 'subfield/1',
            displayName: 'bar',
            title: 'Start',
            type: 'DATE',
            typeClass: 'primitive',
            watermark: 'YYYY-MM-DD',
            description: 'bar',
            multiple: false,
            isControlledVocabulary: false,
            displayFormat: '',
            isRequired: false,
            displayOnCreate: true,
            displayOrder: 13,
            isAdvancedSearchFieldType: false
          },
          'subfield/2': {
            name: 'subfield/2',
            displayName: 'bar',
            title: 'End',
            type: 'DATE',
            typeClass: 'primitive',
            watermark: 'YYYY-MM-DD',
            description: 'bar',
            multiple: false,
            isControlledVocabulary: false,
            displayFormat: '',
            isRequired: false,
            displayOnCreate: true,
            displayOrder: 14,
            isAdvancedSearchFieldType: false
          },
          someNestedKeyWithoutDot: {
            name: 'someNestedKeyWithoutDot',
            displayName: 'someNestedKeyWithoutDot',
            title: 'Some nested key without dout',
            type: 'TEXT',
            typeClass: 'primitive',
            watermark: '',
            description: 'foo',
            multiple: false,
            isControlledVocabulary: false,
            displayFormat: '',
            isRequired: true,
            displayOnCreate: true,
            displayOrder: 0,
            isAdvancedSearchFieldType: false
          }
        },
        value: {
          'subfield/1': 'foo',
          'subfield/2': 'bar',
          someNestedKeyWithoutDot: 'bar'
        }
      }
    }
  }
]

const datasetMetadaBlocksCurrentValues: DatasetMetadataBlocks = [
  {
    name: 'foo',
    fields: {
      someKeyWithoutDot: 'bar',
      controlledVocabularyNotMultiple: 'Option2',
      controlledVocabularyMultiple: ['Option1'],
      'primitive.text.not.multiple': 'foo',
      'primitive.text.multiple': ['foo', 'bar'],
      'primitive.textbox.not.multiple': '',
      'primitive.textbox.multiple': [],
      'primitive.float.not.multiple': '23.55',
      'primitive.float.multiple': ['23.55', '45.55'],
      'primitive.int.not.multiple': '23',
      'primitive.int.multiple': ['23', '45'],
      'primitive.date.not.multiple': '2022-01-01',
      'primitive.date.multiple': ['2022-01-01', '2022-12-31'],
      'composed.field.multiple': [
        {
          'subfield.1': 'foo',
          'subfield.2': 'bar',
          someNestedKeyWithoutDot: 'bar',
          controlledVocabularyNotMultiple: ''
        }
      ],
      'composed.field.not.multiple': {
        'subfield.1': 'foo',
        'subfield.2': 'bar',
        someNestedKeyWithoutDot: 'bar'
      }
    }
  }
] as unknown as DatasetMetadataBlocks

const normalizedDatasetMetadataBlocksCurrentValues: DatasetMetadataBlocks = [
  {
    name: 'foo',
    fields: {
      someKeyWithoutDot: 'bar',
      controlledVocabularyNotMultiple: 'Option2',
      controlledVocabularyMultiple: ['Option1'],
      'primitive/text/not/multiple': 'foo',
      'primitive/text/multiple': ['foo', 'bar'],
      'primitive/textbox/not/multiple': '',
      'primitive/textbox/multiple': [],
      'primitive/float/not/multiple': '23.55',
      'primitive/float/multiple': ['23.55', '45.55'],
      'primitive/int/not/multiple': '23',
      'primitive/int/multiple': ['23', '45'],
      'primitive/date/not/multiple': '2022-01-01',
      'primitive/date/multiple': ['2022-01-01', '2022-12-31'],
      'composed/field/multiple': [
        {
          'subfield/1': 'foo',
          'subfield/2': 'bar',
          someNestedKeyWithoutDot: 'bar',
          controlledVocabularyNotMultiple: ''
        }
      ],
      'composed/field/not/multiple': {
        'subfield/1': 'foo',
        'subfield/2': 'bar',
        someNestedKeyWithoutDot: 'bar'
      }
    }
  }
] as unknown as DatasetMetadataBlocks

const formValuesWithValues: DatasetMetadataFormValues = {
  foo: {
    someKeyWithoutDot: 'bar',
    controlledVocabularyNotMultiple: 'Option2',
    controlledVocabularyMultiple: ['Option1'],
    'primitive/text/not/multiple': 'foo',
    'primitive/text/multiple': [{ value: 'foo' }, { value: 'bar' }],
    'primitive/textbox/not/multiple': '',
    'primitive/textbox/multiple': [],
    'primitive/float/not/multiple': '23.55',
    'primitive/float/multiple': [{ value: '23.55' }, { value: '45.55' }],
    'primitive/int/not/multiple': '23',
    'primitive/int/multiple': [{ value: '23' }, { value: '45' }],
    'primitive/date/not/multiple': '2022-01-01',
    'primitive/date/multiple': [{ value: '2022-01-01' }, { value: '2022-12-31' }],
    'composed/field/multiple': [
      {
        'subfield/1': 'foo',
        'subfield/2': 'bar',
        someNestedKeyWithoutDot: 'bar',
        controlledVocabularyNotMultiple: ''
      }
    ],
    'composed/field/not/multiple': {
      'subfield/1': 'foo',
      'subfield/2': 'bar',
      someNestedKeyWithoutDot: 'bar'
    }
  }
}

const formValuesEmptyValues: DatasetMetadataFormValues = {
  foo: {
    someKeyWithoutDot: '',
    controlledVocabularyNotMultiple: '',
    controlledVocabularyMultiple: [],
    'primitive/text/not/multiple': '',
    'primitive/text/multiple': [{ value: '' }],
    'primitive/textbox/not/multiple': '',
    'primitive/textbox/multiple': [{ value: '' }],
    'primitive/float/not/multiple': '',
    'primitive/float/multiple': [{ value: '' }],
    'primitive/int/not/multiple': '',
    'primitive/int/multiple': [{ value: '' }],
    'primitive/date/not/multiple': '',
    'primitive/date/multiple': [{ value: '' }],
    'composed/field/multiple': [
      {
        'subfield/1': '',
        'subfield/2': '',
        someNestedKeyWithoutDot: '',
        controlledVocabularyNotMultiple: ''
      }
    ],
    'composed/field/not/multiple': {
      'subfield/1': '',
      'subfield/2': '',
      someNestedKeyWithoutDot: ''
    }
  }
}

const formValuesWithValuesBackToDotKeys: DatasetMetadataFormValues = {
  foo: {
    someKeyWithoutDot: 'bar',
    controlledVocabularyNotMultiple: 'Option2',
    controlledVocabularyMultiple: ['Option1'],
    'primitive.text.not.multiple': 'foo',
    'primitive.text.multiple': [{ value: 'foo' }, { value: 'bar' }],
    'primitive.textbox.not.multiple': '',
    'primitive.textbox.multiple': [],
    'primitive.float.not.multiple': '23.55',
    'primitive.float.multiple': [{ value: '23.55' }, { value: '45.55' }],
    'primitive.int.not.multiple': '23',
    'primitive.int.multiple': [{ value: '23' }, { value: '45' }],
    'primitive.date.not.multiple': '2022-01-01',
    'primitive.date.multiple': [{ value: '2022-01-01' }, { value: '2022-12-31' }],
    'composed.field.multiple': [
      {
        'subfield.1': 'foo',
        'subfield.2': 'bar',
        someNestedKeyWithoutDot: 'bar',
        controlledVocabularyNotMultiple: ''
      }
    ],
    'composed.field.not.multiple': {
      'subfield.1': 'foo',
      'subfield.2': 'bar',
      someNestedKeyWithoutDot: 'bar'
    }
  }
}

const expectedDatasetDTOInCreateMode: DatasetDTO = {
  licence: defaultLicense,
  metadataBlocks: [
    {
      name: 'foo',
      fields: {
        someKeyWithoutDot: 'bar',
        controlledVocabularyNotMultiple: 'Option2',
        controlledVocabularyMultiple: ['Option1'],
        'primitive.text.not.multiple': 'foo',
        'primitive.text.multiple': ['foo', 'bar'],
        'primitive.float.not.multiple': '23.55',
        'primitive.float.multiple': ['23.55', '45.55'],
        'primitive.int.not.multiple': '23',
        'primitive.int.multiple': ['23', '45'],
        'primitive.date.not.multiple': '2022-01-01',
        'primitive.date.multiple': ['2022-01-01', '2022-12-31'],
        'composed.field.multiple': [
          {
            'subfield.1': 'foo',
            'subfield.2': 'bar',
            someNestedKeyWithoutDot: 'bar'
          }
        ],
        'composed.field.not.multiple': {
          'subfield.1': 'foo',
          'subfield.2': 'bar',
          someNestedKeyWithoutDot: 'bar'
        }
      }
    }
  ]
}

const expectedDatasetDTOInEditMode: DatasetDTO = {
  licence: defaultLicense,
  metadataBlocks: [
    {
      name: 'foo',
      fields: {
        someKeyWithoutDot: 'bar',
        controlledVocabularyNotMultiple: 'Option2',
        controlledVocabularyMultiple: ['Option1'],
        'primitive.text.not.multiple': 'foo',
        'primitive.text.multiple': ['foo', 'bar'],
        'primitive.textbox.not.multiple': '',
        'primitive.textbox.multiple': [],
        'primitive.float.not.multiple': '23.55',
        'primitive.float.multiple': ['23.55', '45.55'],
        'primitive.int.not.multiple': '23',
        'primitive.int.multiple': ['23', '45'],
        'primitive.date.not.multiple': '2022-01-01',
        'primitive.date.multiple': ['2022-01-01', '2022-12-31'],
        'composed.field.multiple': [
          {
            'subfield.1': 'foo',
            'subfield.2': 'bar',
            someNestedKeyWithoutDot: 'bar',
            controlledVocabularyNotMultiple: ''
          }
        ],
        'composed.field.not.multiple': {
          'subfield.1': 'foo',
          'subfield.2': 'bar',
          someNestedKeyWithoutDot: 'bar'
        }
      }
    }
  ]
}

describe('MetadataFieldsHelper', () => {
  it('should replace names keys with dots with slashes from a metadata block info', () => {
    const result =
      MetadataFieldsHelper.replaceMetadataBlocksInfoDotNamesKeysWithSlash(metadataBlocksInfo)
    expect(result).to.deep.equal(normalizedMetadataBlocksInfo)
  })
  it('should replace dot keys with slashes from a Dataset current metadata blocks values ', () => {
    const result = MetadataFieldsHelper.replaceDatasetMetadataBlocksDotKeysWithSlash(
      datasetMetadaBlocksCurrentValues
    )

    expect(result).to.deep.equal(normalizedDatasetMetadataBlocksCurrentValues)
  })

  it('should add field values to metadata blocks info', () => {
    const result = MetadataFieldsHelper.addFieldValuesToMetadataBlocksInfo(
      normalizedMetadataBlocksInfo,
      normalizedDatasetMetadataBlocksCurrentValues
    )

    expect(result).to.deep.equal(normalizedMetadataBlocksInfoWithValues)
  })

  it('gets form default values from metadata blocks info with values', () => {
    const result = MetadataFieldsHelper.getFormDefaultValues(normalizedMetadataBlocksInfoWithValues)

    expect(result).to.deep.equal(formValuesWithValues)
  })

  it('gets form default values from metadata blocks info without values', () => {
    const result = MetadataFieldsHelper.getFormDefaultValues(normalizedMetadataBlocksInfo)

    expect(result).to.deep.equal(formValuesEmptyValues)
  })

  it('should replace form values keys with slash back to dots', () => {
    const result = MetadataFieldsHelper.replaceSlashKeysWithDot(formValuesWithValues)

    expect(result).to.deep.equal(formValuesWithValuesBackToDotKeys)
  })

  describe('should format form values to dataset DTO', () => {
    it('In create mode, removing empty values', () => {
      const result = MetadataFieldsHelper.formatFormValuesToDatasetDTO(
        formValuesWithValuesBackToDotKeys,
        'create'
      )

      expect(result).to.deep.equal(expectedDatasetDTOInCreateMode)
    })

    it('In edit mode, keeping empty values', () => {
      const result = MetadataFieldsHelper.formatFormValuesToDatasetDTO(
        formValuesWithValuesBackToDotKeys,
        'edit'
      )

      expect(result).to.deep.equal(expectedDatasetDTOInEditMode)
    })
  })

  it('works all together, simulates a use in an edit mode form', () => {
    // First we need to normalize the metadata blocks info, removing field names with dots and replacing them with slashes
    const inTestNormalizedMetadataBlocksInfo =
      MetadataFieldsHelper.replaceMetadataBlocksInfoDotNamesKeysWithSlash(metadataBlocksInfo)

    const inTestNormalizedDatasetMetadaBlocksCurrentValues =
      MetadataFieldsHelper.replaceDatasetMetadataBlocksDotKeysWithSlash(
        datasetMetadaBlocksCurrentValues
      )

    const inTestNormalizedMetadataBlocksInfoWithValues =
      MetadataFieldsHelper.addFieldValuesToMetadataBlocksInfo(
        inTestNormalizedMetadataBlocksInfo,
        inTestNormalizedDatasetMetadaBlocksCurrentValues
      )

    const inTestFormDefaultValues = MetadataFieldsHelper.getFormDefaultValues(
      inTestNormalizedMetadataBlocksInfoWithValues
    )
    const inTestFormDefaultValuesBackToDotKeys =
      MetadataFieldsHelper.replaceSlashKeysWithDot(inTestFormDefaultValues)

    const inTestDatasetDTO = MetadataFieldsHelper.formatFormValuesToDatasetDTO(
      formValuesWithValuesBackToDotKeys,
      'edit'
    )

    expect(inTestNormalizedMetadataBlocksInfo).to.deep.equal(normalizedMetadataBlocksInfo)
    expect(inTestNormalizedDatasetMetadaBlocksCurrentValues).to.deep.equal(
      normalizedDatasetMetadataBlocksCurrentValues
    )
    expect(inTestNormalizedMetadataBlocksInfoWithValues).to.deep.equal(
      normalizedMetadataBlocksInfoWithValues
    )
    expect(inTestFormDefaultValues).to.deep.equal(formValuesWithValues)

    expect(inTestFormDefaultValuesBackToDotKeys).to.deep.equal(formValuesWithValuesBackToDotKeys)

    expect(inTestDatasetDTO).to.deep.equal(expectedDatasetDTOInEditMode)
  })

  describe('defineFieldName', () => {
    const metadataBlockName = 'foo'
    const fieldName = 'bar'
    const compoundParentName = 'composed'
    const fieldsArrayIndex = 0

    it('defines basic field name correctly', () => {
      const result = MetadataFieldsHelper.defineFieldName(fieldName, metadataBlockName)

      expect(result).to.equal(`${metadataBlockName}.${fieldName}`)
    })

    it('defines compound field name correctly', () => {
      const result = MetadataFieldsHelper.defineFieldName(
        fieldName,
        metadataBlockName,
        compoundParentName
      )

      expect(result).to.equal(`${metadataBlockName}.${compoundParentName}.${fieldName}`)
    })

    it('defines field array name correctly', () => {
      const result = MetadataFieldsHelper.defineFieldName(
        fieldName,
        metadataBlockName,
        undefined,
        0
      )

      expect(result).to.equal(`${metadataBlockName}.${fieldName}.${fieldsArrayIndex}.value`)
    })

    it('defines compound field array name correctly', () => {
      const result = MetadataFieldsHelper.defineFieldName(
        fieldName,
        metadataBlockName,
        compoundParentName,
        0
      )

      expect(result).to.equal(
        `${metadataBlockName}.${compoundParentName}.${fieldsArrayIndex}.${fieldName}`
      )
    })
  })

  describe('isValidDateFormat', () => {
    const validCases: { input: string; kind: DateLikeKind }[] = [
      { input: '20', kind: 'Y' },
      { input: '2023', kind: 'Y' },
      { input: '2023-11', kind: 'YM' },
      { input: '2023-11-30', kind: 'YMD' },
      { input: '2020-02-29', kind: 'YMD' }, // leap day
      { input: '2023 AD', kind: 'AD' },
      { input: '2023AD', kind: 'AD' },
      { input: '2023 BC', kind: 'BC' },
      { input: '2023BC', kind: 'BC' },
      { input: '123456 BC', kind: 'BC' },
      { input: '[2023?]', kind: 'BRACKET' },
      { input: '[2023 BC?]', kind: 'BRACKET' },
      { input: '2023-11-30T23:59:59', kind: 'TIMESTAMP' },
      { input: '2023-11-30T23:59:59.123', kind: 'TIMESTAMP' },
      { input: '2023-11-30 23:59:59', kind: 'TIMESTAMP' },
      // whitespace trimming
      { input: ' 2023-11-30 ', kind: 'YMD' }
    ]

    const invalidCases: { input: string; code: DateErrorCode }[] = [
      { input: ' ', code: 'E_UNRECOGNIZED' },
      { input: '', code: 'E_EMPTY' },
      { input: '10000', code: 'E_AD_RANGE' },
      { input: '2023-13', code: 'E_INVALID_MONTH' },
      { input: '2023-00', code: 'E_INVALID_MONTH' },
      { input: '2023-11-31', code: 'E_INVALID_DAY' },
      { input: '2019-02-29', code: 'E_INVALID_DAY' }, // not leap year
      { input: '2023-11-30T25:00:00', code: 'E_INVALID_TIME' },
      { input: '2023-11-30T23:59:60', code: 'E_INVALID_TIME' },
      { input: '[-2023?]', code: 'E_BRACKET_NEGATIVE' },
      { input: '[2023-11?]', code: 'E_BRACKET_NOT_NUM' },
      { input: '[foo BC?]', code: 'E_BRACKET_NOT_NUM' },
      { input: '[99230 AD?]', code: 'E_BRACKET_RANGE' },
      { input: '[10000?]', code: 'E_BRACKET_RANGE' },
      { input: '[20a3?]', code: 'E_BRACKET_NOT_NUM' },
      { input: 'abcd AD', code: 'E_AD_DIGITS' },
      { input: '20a AD', code: 'E_AD_DIGITS' },
      { input: '12345 AD', code: 'E_AD_RANGE' },
      { input: '12x BC', code: 'E_BC_NOT_NUM' },
      { input: '2023-11-30foo', code: 'E_UNRECOGNIZED' }
    ]

    it('accepts all valid inputs and returns the right kind', () => {
      validCases.forEach(({ input, kind }) => {
        const res = MetadataFieldsHelper.isValidDateFormat(input)
        expect(res.valid, `expected valid for "${input}"`).to.eq(true)

        if (res.valid) {
          expect(res.kind, `kind for "${input}"`).to.eq(kind)
        }
      })
    })

    it('rejects invalid inputs and returns correct error code', () => {
      invalidCases.forEach(({ input, code }) => {
        const res = MetadataFieldsHelper.isValidDateFormat(input)
        expect(res.valid, `expected invalid for "${input}"`).to.eq(false)

        if (!res.valid) {
          expect(res.errorCode, `code for "${input}"`).to.eq(code)
        }
      })
    })
  })
})
