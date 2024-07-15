import { DatasetMetadataBlocks } from '../../../../../src/dataset/domain/models/Dataset'
import { DatasetDTO } from '../../../../../src/dataset/domain/useCases/DTOs/DatasetDTO'
import {
  MetadataBlockInfo,
  MetadataBlockInfoWithMaybeValues
} from '../../../../../src/metadata-block-info/domain/models/MetadataBlockInfo'
import {
  DatasetMetadataFormValues,
  MetadataFieldsHelper
} from '../../../../../src/sections/shared/form/DatasetMetadataForm/MetadataFieldsHelper'

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
        displayOrder: 0
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
        displayOnCreate: true
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
        displayOnCreate: true
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
        displayOrder: 0
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
        displayOrder: 0
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
        displayOrder: 0
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
        displayOrder: 0
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
        displayOnCreate: false
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
        displayOnCreate: false
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
        displayOnCreate: false
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
        displayOnCreate: false
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
        displayOnCreate: false
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
        displayOnCreate: false
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
            displayOrder: 13
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
            displayOrder: 14
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
            displayOrder: 0
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
            displayOnCreate: true
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
            displayOrder: 13
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
            displayOrder: 14
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
            displayOrder: 0
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
        displayOrder: 0
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
        displayOnCreate: true
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
        displayOnCreate: true
      },
      'primitive.text.not.multiple': {
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
        displayOrder: 0
      },
      'primitive.text.multiple': {
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
        displayOrder: 0
      },
      'primitive.textbox.not.multiple': {
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
        displayOrder: 0
      },
      'primitive.textbox.multiple': {
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
        displayOrder: 0
      },
      'primitive.float.not.multiple': {
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
        displayOnCreate: false
      },
      'primitive.float.multiple': {
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
        displayOnCreate: false
      },
      'primitive.int.not.multiple': {
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
        displayOnCreate: false
      },
      'primitive.int.multiple': {
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
        displayOnCreate: false
      },
      'primitive.date.not.multiple': {
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
        displayOnCreate: false
      },
      'primitive.date.multiple': {
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
        displayOnCreate: false
      },
      'composed.field.multiple': {
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
        childMetadataFields: {
          'subfield.1': {
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
            displayOrder: 13
          },
          'subfield.2': {
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
            displayOrder: 14
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
            displayOrder: 0
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
            displayOnCreate: true
          }
        }
      },
      'composed.field.not.multiple': {
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
        childMetadataFields: {
          'subfield.1': {
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
            displayOrder: 13
          },
          'subfield.2': {
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
            displayOrder: 14
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
            displayOrder: 0
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
        value: 'bar'
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
        value: 'Option2'
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
        value: ['Option1']
      },
      'primitive.text.not.multiple': {
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
        value: 'foo'
      },
      'primitive.text.multiple': {
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
        value: ['foo', 'bar']
      },
      'primitive.textbox.not.multiple': {
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
        value: ''
      },
      'primitive.textbox.multiple': {
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
        value: []
      },
      'primitive.float.not.multiple': {
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
        value: '23.55'
      },
      'primitive.float.multiple': {
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
        value: ['23.55', '45.55']
      },
      'primitive.int.not.multiple': {
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
        value: '23'
      },
      'primitive.int.multiple': {
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
        value: ['23', '45']
      },
      'primitive.date.not.multiple': {
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
        value: '2022-01-01'
      },
      'primitive.date.multiple': {
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
        value: ['2022-01-01', '2022-12-31']
      },
      'composed.field.multiple': {
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
        childMetadataFields: {
          'subfield.1': {
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
            displayOrder: 13
          },
          'subfield.2': {
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
            displayOrder: 14
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
            displayOrder: 0
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
            displayOnCreate: true
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
      'composed.field.not.multiple': {
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
        childMetadataFields: {
          'subfield.1': {
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
            displayOrder: 13
          },
          'subfield.2': {
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
            displayOrder: 14
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
            displayOrder: 0
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

const expectedDatasetDTO: DatasetDTO = {
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

describe('MetadataFieldsHelper', () => {
  it('should replace names keys with dots with slashes from a metadata block info', () => {
    const result =
      MetadataFieldsHelper.replaceMetadataBlocksInfoDotNamesKeysWithSlash(metadataBlocksInfo)
    expect(result).to.deep.equal(normalizedMetadataBlocksInfo)
  })
  it('should replace dot keys with slashes from a Dataset current metadata blocks values ', () => {
    const result = MetadataFieldsHelper.replaceDatasetMetadataBlocksCurrentValuesDotKeysWithSlash(
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

  it('should get dataset DTO from form values', () => {
    const result = MetadataFieldsHelper.formatFormValuesToDatasetDTO(
      formValuesWithValuesBackToDotKeys
    )

    expect(result).to.deep.equal(expectedDatasetDTO)
  })

  it('works all together, simulates a use in an edit mode form', () => {
    // First we need to normalize the metadata blocks info, removing field names with dots and replacing them with slashes
    const inTestNormalizedMetadataBlocksInfo =
      MetadataFieldsHelper.replaceMetadataBlocksInfoDotNamesKeysWithSlash(metadataBlocksInfo)

    const inTestNormalizedDatasetMetadaBlocksCurrentValues =
      MetadataFieldsHelper.replaceDatasetMetadataBlocksCurrentValuesDotKeysWithSlash(
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
      formValuesWithValuesBackToDotKeys
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

    expect(inTestDatasetDTO).to.deep.equal(expectedDatasetDTO)
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
})
