import { MetadataBlockInfoDisplayFormat } from '@/metadata-block-info/domain/models/MetadataBlockInfo'
import {
  joinSubFields,
  metadataFieldValueToDisplayFormat
} from '../../../../../src/sections/dataset/dataset-metadata/dataset-metadata-fields/DatasetMetadataFieldValueFormatted'
import type { DatasetMetadataSubField } from '@/dataset/domain/models/Dataset'

describe('joinSubFields formatting logic', () => {
  const mockDisplayFormatInfo: MetadataBlockInfoDisplayFormat = {
    name: 'mock name',
    displayName: 'Mock Metadata',
    fields: {
      series: {
        displayFormat: ':',
        type: 'TEXT',
        title: 'Series',
        description: 'Series description'
      },
      software: {
        displayFormat: ',',
        type: 'TEXT',
        title: 'Software',
        description: 'Software description'
      },
      dateOfCollection: {
        displayFormat: ';',
        type: 'TEXT',
        title: 'Date of Collection',
        description: 'Date of Collection description'
      },
      otherField: {
        displayFormat: '\n',
        type: 'TEXT',
        title: 'Other Field',
        description: 'Other Field description'
      }
    }
  }

  it('joins with colon for colunJoinObj like series', () => {
    const seriesObj = {
      seriesName: 'series name1',
      seriesInformation: 'description'
    }

    const result = joinSubFields(seriesObj, mockDisplayFormatInfo, 'series')

    expect(result).equal('series name1: description')
  })

  it('joins with comma for commaJoinObj like software', () => {
    const metadataSubField = {
      softwareName: 'software1',
      softwareVersion: '4.0'
    }

    const result = joinSubFields(metadataSubField, mockDisplayFormatInfo, 'software')

    expect(result).equal('software1, 4.0')
  })

  it('joins with semicolon for timePeriodObj like dateOfCollection', () => {
    const metadataSubField = {
      start: '2021-01-01',
      end: '2021-12-31'
    }

    const result = joinSubFields(metadataSubField, mockDisplayFormatInfo, 'dateOfCollection')

    expect(result).equal('2021-01-01; 2021-12-31')
  })

  it('joins with line-break for other fields', () => {
    const metadataSubField = {
      field1: 'value1',
      field2: 'value2'
    }

    const result = joinSubFields(metadataSubField, mockDisplayFormatInfo, 'otherField')

    expect(result).equal('value1\n value2')
  })
})

describe('metadataFieldValueToDisplayFormat', () => {
  const mockDisplayFormatInfo: MetadataBlockInfoDisplayFormat = {
    name: 'mock name',
    displayName: 'Mock Metadata',
    fields: {
      testField: {
        displayFormat: ':',
        type: 'TEXT',
        title: 'Test Field',
        description: 'Test Field description'
      },
      series: {
        displayFormat: ':',
        type: 'TEXT',
        title: 'Series',
        description: 'Series description'
      },
      software: {
        displayFormat: ',',
        type: 'TEXT',
        title: 'Software',
        description: 'Software description'
      }
    }
  }

  describe('when metadataFieldValue is an array of objects', () => {
    it('should format array of objects using joinSubFields and join with double line breaks', () => {
      const metadataFieldValue: DatasetMetadataSubField[] = [
        { seriesName: 'Series 1', seriesInformation: 'Info 1' },
        { seriesName: 'Series 2', seriesInformation: 'Info 2' }
      ]

      const result = metadataFieldValueToDisplayFormat(
        metadataFieldValue,
        mockDisplayFormatInfo,
        'series'
      )

      expect(result).equal('Series 1: Info 1 \n \nSeries 2: Info 2')
    })

    it('should handle empty array of objects', () => {
      const metadataFieldValue: DatasetMetadataSubField[] = []

      const result = metadataFieldValueToDisplayFormat(
        metadataFieldValue,
        mockDisplayFormatInfo,
        'series'
      )

      expect(result).equal('')
    })

    it('should handle single object in array', () => {
      const metadataFieldValue: DatasetMetadataSubField[] = [
        { softwareName: 'Software 1', softwareVersion: '1.0' }
      ]

      const result = metadataFieldValueToDisplayFormat(
        metadataFieldValue,
        mockDisplayFormatInfo,
        'software'
      )

      expect(result).equal('Software 1, 1.0')
    })
  })

  describe('when metadataFieldValue is a simple array', () => {
    it('should join array elements with semicolon separator', () => {
      const metadataFieldValue = ['value1', 'value2', 'value3']

      const result = metadataFieldValueToDisplayFormat(
        metadataFieldValue,
        mockDisplayFormatInfo,
        'testField'
      )

      expect(result).equal('value1; value2; value3')
    })

    it('should handle empty array', () => {
      const metadataFieldValue: string[] = []

      const result = metadataFieldValueToDisplayFormat(
        metadataFieldValue,
        mockDisplayFormatInfo,
        'testField'
      )

      expect(result).equal('')
    })

    it('should handle single element array', () => {
      const metadataFieldValue = ['single value']

      const result = metadataFieldValueToDisplayFormat(
        metadataFieldValue,
        mockDisplayFormatInfo,
        'testField'
      )

      expect(result).equal('single value')
    })
  })

  describe('when metadataFieldValue is a single object', () => {
    it('should join object values with semicolon separator', () => {
      const metadataFieldValue = {
        field1: 'value1',
        field2: 'value2',
        field3: 'value3'
      }

      const result = metadataFieldValueToDisplayFormat(
        metadataFieldValue,
        mockDisplayFormatInfo,
        'testField'
      )

      expect(result).equal('value1;value2;value3')
    })

    it('should handle empty object', () => {
      const metadataFieldValue = {}

      const result = metadataFieldValueToDisplayFormat(
        metadataFieldValue,
        mockDisplayFormatInfo,
        'testField'
      )

      expect(result).equal('')
    })

    it('should handle object with single property', () => {
      const metadataFieldValue = { singleField: 'single value' }

      const result = metadataFieldValueToDisplayFormat(
        metadataFieldValue,
        mockDisplayFormatInfo,
        'testField'
      )

      expect(result).equal('single value')
    })
  })

  describe('when metadataFieldValue is a string', () => {
    it('should return the string value as-is', () => {
      const metadataFieldValue = 'simple string value'

      const result = metadataFieldValueToDisplayFormat(
        metadataFieldValue,
        mockDisplayFormatInfo,
        'testField'
      )

      expect(result).equal('simple string value')
    })

    it('should handle empty string', () => {
      const metadataFieldValue = ''

      const result = metadataFieldValueToDisplayFormat(
        metadataFieldValue,
        mockDisplayFormatInfo,
        'testField'
      )

      expect(result).equal('')
    })
  })

  describe('when metadataFieldName is not provided', () => {
    it('should work with array of objects without parent field name', () => {
      const metadataFieldValue: DatasetMetadataSubField[] = [{ field1: 'value1', field2: 'value2' }]

      const result = metadataFieldValueToDisplayFormat(metadataFieldValue, mockDisplayFormatInfo)

      // Should still work but without parent display format
      expect(result).equal('value1 value2')
    })

    it('should work with other types without parent field name', () => {
      const metadataFieldValue = ['value1', 'value2']

      const result = metadataFieldValueToDisplayFormat(metadataFieldValue, mockDisplayFormatInfo)

      expect(result).equal('value1; value2')
    })
  })
})
