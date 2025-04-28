import { MetadataBlockInfoDisplayFormat } from '@/metadata-block-info/domain/models/MetadataBlockInfo'
import {
  joinSubFields,
  metadataFieldValueToDisplayFormat
} from '../../../../../src/sections/dataset/dataset-metadata/dataset-metadata-fields/DatasetMetadataFieldValueFormatted'

describe('joinSubFields formatting logic', () => {
  const mockTranslateFieldName = (fieldName: string) => fieldName

  const mockDisplayFormatInfo: MetadataBlockInfoDisplayFormat = {
    name: 'mock name',
    fields: {
      series: { displayFormat: ':', type: 'TEXT' },
      software: { displayFormat: ',', type: 'TEXT' },
      dateOfCollection: { displayFormat: ';', type: 'TEXT' },
      otherField: { displayFormat: '\n', type: 'TEXT' }
    }
  }

  it('joins with colon for colunJoinObj like series', () => {
    const seriesObj = {
      seriesName: 'series name1',
      seriesInformation: 'description'
    }

    const result = joinSubFields(seriesObj, mockTranslateFieldName, mockDisplayFormatInfo, 'series')

    expect(result).equal('series name1: description')
  })

  it('joins with comma for commaJoinObj like software', () => {
    const metadataSubField = {
      softwareName: 'software1',
      softwareVersion: '4.0'
    }

    const result = joinSubFields(
      metadataSubField,
      mockTranslateFieldName,
      mockDisplayFormatInfo,
      'software'
    )

    expect(result).equal('software1, 4.0')
  })

  it('joins with semicolon for timePeriodObj like dateOfCollection', () => {
    const metadataSubField = {
      start: '2021-01-01',
      end: '2021-12-31'
    }

    const result = joinSubFields(
      metadataSubField,
      mockTranslateFieldName,
      mockDisplayFormatInfo,
      'dateOfCollection'
    )

    expect(result).equal('2021-01-01; 2021-12-31')
  })

  it('joins with line-break for other fields', () => {
    const metadataSubField = {
      field1: 'value1',
      field2: 'value2'
    }

    const result = joinSubFields(
      metadataSubField,
      mockTranslateFieldName,
      mockDisplayFormatInfo,
      'otherField'
    )

    expect(result).equal('value1\n value2')
  })
})

describe('metadataFieldValueToDisplayFormat formatting logic', () => {
  const dummyTranslate = (field: string) => field

  it('handles simple string', () => {
    expect(metadataFieldValueToDisplayFormat('plainText', dummyTranslate)).equal('plainText')
  })

  it('handles array of strings', () => {
    expect(metadataFieldValueToDisplayFormat(['one', 'two'], dummyTranslate)).equal('one; two')
  })

  it('handles object values', () => {
    expect(metadataFieldValueToDisplayFormat({ key: 'val1', value: 'val2' }, dummyTranslate)).equal(
      'val1;val2'
    )
  })

  it('handles array of objects with newlines', () => {
    const mockSubField = [{ field1: 'A' }, { field1: 'B' }]
    const result = metadataFieldValueToDisplayFormat(mockSubField, dummyTranslate)
    expect(result.includes('\n')).equal(true)
  })
})
