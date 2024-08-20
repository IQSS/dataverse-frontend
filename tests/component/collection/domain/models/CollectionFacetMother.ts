import { CollectionFacet } from '../../../../../src/collection/domain/models/CollectionFacet'

export class CollectionFacetMother {
  static createFacets(): CollectionFacet[] {
    return [
      {
        id: 3,
        name: 'authorName',
        displayName: 'Author Name'
      },
      {
        id: 1,
        name: 'subject',
        displayName: 'Subject'
      },
      {
        id: 2,
        name: 'keywordValue',
        displayName: 'Keyword Term'
      },
      {
        id: 4,
        name: 'dateOfDeposit',
        displayName: 'Deposit Date'
      }
    ]
  }
}
