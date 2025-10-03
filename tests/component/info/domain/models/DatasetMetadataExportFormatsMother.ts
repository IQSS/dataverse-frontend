import { DatasetMetadataExportFormats } from '@/info/domain/models/DatasetMetadataExportFormats'

export class DatasetMetadataExportFormatsMother {
  static create(props?: DatasetMetadataExportFormats): DatasetMetadataExportFormats {
    return {
      OAI_ORE: {
        displayName: 'OAI_ORE',
        mediaType: 'application/json',
        isHarvestable: false,
        isVisibleInUserInterface: true
      },
      Datacite: {
        displayName: 'DataCite',
        mediaType: 'application/xml',
        isHarvestable: true,
        isVisibleInUserInterface: true,
        XMLNameSpace: 'http://datacite.org/schema/kernel-4',
        XMLSchemaLocation:
          'http://datacite.org/schema/kernel-4 http://schema.datacite.org/meta/kernel-4.5/metadata.xsd',
        XMLSchemaVersion: '4.5'
      },
      ...props
    }
  }
}
