import {
  MetadataBlock as JSMetadataBlockInfo,
  MetadataFieldInfo as JSMetadataFieldInfo
} from '@iqss/dataverse-client-javascript'
import {
  MetadataBlockInfoDisplayFormat,
  MetadataBlockInfoDisplayFormatFields
} from '../../domain/models/MetadataBlockInfo'

export class JSMetadataBlockInfoMapper {
  static toMetadataBlockInfo(
    jsMetadataBlockInfo: JSMetadataBlockInfo
  ): MetadataBlockInfoDisplayFormat {
    return {
      name: jsMetadataBlockInfo.name,
      fields: this.toFields(jsMetadataBlockInfo.metadataFields)
    }
  }

  static toFields(
    jsMetadataBlockInfoFields: Record<string, JSMetadataFieldInfo>
  ): MetadataBlockInfoDisplayFormatFields {
    const fields: MetadataBlockInfoDisplayFormatFields = {}

    Object.entries(jsMetadataBlockInfoFields).forEach(([key, value]) => {
      fields[key] = { displayFormat: this.toDisplayFormat(value.displayFormat) }

      if (value.typeClass === 'compound' && value.childMetadataFields) {
        this.processCompoundFields(value.childMetadataFields, fields)
      }
    })

    return fields
  }

  static processCompoundFields(
    jsFields: Record<string, JSMetadataFieldInfo>,
    result: MetadataBlockInfoDisplayFormatFields
  ): void {
    Object.entries(jsFields).forEach(([key, value]) => {
      result[key] = { displayFormat: this.toDisplayFormat(value.displayFormat) }
    })
  }

  static toDisplayFormat(jsDisplayFormat: string): string {
    const link = 'href="#VALUE"'
    if (jsDisplayFormat.includes(link)) {
      return '[#VALUE](#VALUE)'
    }

    const linkWithUrl = /<a\s+href='([^']*)\/#VALUE'[^>]*>#VALUE<\/a>/
    const match = jsDisplayFormat.match(linkWithUrl)
    if (match) {
      return `[#VALUE](${match[1]}/#VALUE)`
    }

    const emailFormat = '#EMAIL'
    if (jsDisplayFormat === emailFormat) {
      return '[#VALUE](mailto:#VALUE)'
    }

    const imageFormat = '<img src="#VALUE" alt="#NAME" class="metadata-logo"/><br/>'
    if (jsDisplayFormat === imageFormat) {
      return '![#NAME](#VALUE)'
    }

    return jsDisplayFormat
  }
}
