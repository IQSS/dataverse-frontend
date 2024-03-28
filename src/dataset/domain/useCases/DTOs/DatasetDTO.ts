import { DatasetMetadataBlock, MetadataBlockName } from '../../models/Dataset'

export interface DatasetDTO {
  metadataBlocks: DatasetMetadataBlock[]
}

export const initialDatasetDTO: DatasetDTO = {
  metadataBlocks: [
    {
      name: MetadataBlockName.CITATION,
      fields: {
        title: '',
        subject: [''],
        author: [
          {
            authorName: ''
          }
        ],
        dsDescription: [
          {
            dsDescriptionValue: ''
          }
        ],
        datasetContact: [
          {
            datasetContactEmail: ''
          }
        ]
      }
    }
  ]
}
