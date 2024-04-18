export interface DatasetDTO {
  metadataBlocks: DatasetMetadataBlockValuesDTO[]
}

export interface DatasetMetadataBlockValuesDTO {
  name: string
  fields: DatasetMetadataFieldsDTO
}

type DatasetMetadataFieldsDTO = Record<string, DatasetMetadataFieldValueDTO>

type DatasetMetadataFieldValueDTO =
  | string
  | string[]
  | DatasetMetadataChildFieldValueDTO
  | DatasetMetadataChildFieldValueDTO[]

export type DatasetMetadataChildFieldValueDTO = Record<string, string>
