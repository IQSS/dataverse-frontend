export type DatasetMetadataExportFormats = Record<string, DatasetMetadataExportFormat>

type DatasetMetadataExportFormat = DatasetMetadataExportFormatBase | XmlDatasetMetadataExportFormat

interface DatasetMetadataExportFormatBase {
  displayName: string
  mediaType: string
  isHarvestable: boolean
  isVisibleInUserInterface: boolean
}

interface XmlDatasetMetadataExportFormat extends DatasetMetadataExportFormatBase {
  XMLNameSpace: string
  XMLSchemaLocation: string
  XMLSchemaVersion: string
}
