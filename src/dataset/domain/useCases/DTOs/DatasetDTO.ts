import { DatasetMetadataBlock, MetadataBlockName } from '../../models/Dataset'

export interface DatasetDTO {
  title: string
  metadataBlocks: DatasetMetadataBlock[]
}

export const initialDatasetDTO: DatasetDTO = {
  title: '',
  metadataBlocks: [
    {
      name: MetadataBlockName.CITATION,
      fields: {
        title: '',
        subject: [],
        author: [],
        datasetContact: [],
        dsDescription: [
          {
            dsDescriptionValue: ''
          }
        ]
      }
    }
  ]
}
