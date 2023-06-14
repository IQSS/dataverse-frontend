import { MetadataBlockInfo } from '../../../../../src/metadata-block-info/domain/models/MetadataBlockInfo'
import { MetadataBlockName } from '../../../../../src/dataset/domain/models/Dataset'

export class MetadataBlockInfoMother {
  static create(props?: Partial<MetadataBlockInfo>): MetadataBlockInfo {
    return {
      name: MetadataBlockName.CITATION,
      fields: {
        alternativePersistentId: { displayFormat: '' },
        publicationDate: { displayFormat: '' },
        citationDate: { displayFormat: '' },
        title: { displayFormat: '' },
        subject: { displayFormat: ';' },
        author: { displayFormat: '' },
        authorName: { displayFormat: '#VALUE' },
        authorAffiliation: { displayFormat: '(#VALUE)' },
        authorIdentifierScheme: { displayFormat: '- #VALUE:' },
        authorIdentifier: { displayFormat: '#VALUE' },
        datasetContact: { displayFormat: '#VALUE' },
        datasetContactName: { displayFormat: '#VALUE' },
        datasetContactAffiliation: { displayFormat: '(#VALUE)' },
        datasetContactEmail: { displayFormat: '(#VALUE)' },
        dsDescription: { displayFormat: '' },
        dsDescriptionValue: { displayFormat: '#VALUE' }
      },
      ...props
    }
  }
}
