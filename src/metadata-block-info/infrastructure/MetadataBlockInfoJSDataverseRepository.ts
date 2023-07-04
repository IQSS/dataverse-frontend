import { MetadataBlockInfoRepository } from '../domain/repositories/MetadataBlockInfoRepository'
import { MetadataBlockInfo } from '../domain/models/MetadataBlockInfo'
import { MetadataBlockName } from '../../dataset/domain/models/Dataset'

export class MetadataBlockInfoJSDataverseRepository implements MetadataBlockInfoRepository {
  // eslint-disable-next-line unused-imports/no-unused-vars
  getByName(name: string): Promise<MetadataBlockInfo | undefined> {
    // TODO implement using js-dataverse
    return Promise.resolve({
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
        datasetContactEmail: { displayFormat: '[#VALUE](mailto:#VALUE)' },
        dsDescription: { displayFormat: '' },
        dsDescriptionValue: { displayFormat: '#VALUE' }
      }
    })
  }
}
