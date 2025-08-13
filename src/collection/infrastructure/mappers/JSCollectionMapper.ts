import {
  Collection as JSCollection,
  DvObjectOwnerNode as JSUpwardHierarchyNode
} from '@iqss/dataverse-client-javascript'
import { Collection } from '../../domain/models/Collection'
import {
  DvObjectType,
  UpwardHierarchyNode
} from '../../../shared/hierarchy/domain/models/UpwardHierarchyNode'
import { JSUpwardHierarchyNodeMapper } from '../../../shared/hierarchy/infrastructure/mappers/JSUpwardHierarchyNodeMapper'

export class JSCollectionMapper {
  static toCollection(jsCollection: JSCollection): Collection {
    return {
      id: jsCollection.alias,
      name: jsCollection.name,
      isReleased: jsCollection.isReleased,
      description: jsCollection.description,
      affiliation: jsCollection.affiliation,
      hierarchy: JSCollectionMapper.toHierarchy(
        jsCollection.name,
        jsCollection.alias,
        jsCollection.isPartOf
      ),
      inputLevels: jsCollection.inputLevels,
      type: jsCollection.type,
      contacts: jsCollection.contacts ?? [],
      isMetadataBlockRoot: jsCollection.isMetadataBlockRoot,
      isFacetRoot: jsCollection.isFacetRoot,
      childCount: jsCollection.childCount
    }
  }

  static toHierarchy(
    name: string,
    id: string,
    jsUpwardHierarchyNode: JSUpwardHierarchyNode
  ): UpwardHierarchyNode {
    return new UpwardHierarchyNode(
      name,
      DvObjectType.COLLECTION,
      id,
      undefined,
      undefined,
      undefined,
      JSUpwardHierarchyNodeMapper.toUpwardHierarchyNode(jsUpwardHierarchyNode)
    )
  }
}
