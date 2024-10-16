import {
  DvObjectOwnerNode as JSUpwardHierarchyNode,
  DvObjectType as JSDvObjectType
} from '@iqss/dataverse-client-javascript'
import { DvObjectType, UpwardHierarchyNode } from '../../domain/models/UpwardHierarchyNode'

export class JSUpwardHierarchyNodeMapper {
  public static toUpwardHierarchyNode(
    jsUpwardHierarchyNode: JSUpwardHierarchyNode | undefined
  ): UpwardHierarchyNode | undefined {
    if (!jsUpwardHierarchyNode) {
      return undefined
    }
    return new UpwardHierarchyNode(
      jsUpwardHierarchyNode.displayName,
      JSUpwardHierarchyNodeMapper.toDvObjectType(jsUpwardHierarchyNode.type),
      jsUpwardHierarchyNode.identifier,
      jsUpwardHierarchyNode.persistentIdentifier,
      jsUpwardHierarchyNode.version,
      jsUpwardHierarchyNode.isReleased as boolean,
      JSUpwardHierarchyNodeMapper.toUpwardHierarchyNode(jsUpwardHierarchyNode.isPartOf)
    )
  }

  private static toDvObjectType(type: JSDvObjectType): DvObjectType {
    switch (type) {
      case JSDvObjectType.DATAVERSE:
        return DvObjectType.COLLECTION
      case JSDvObjectType.DATASET:
        return DvObjectType.DATASET
      case JSDvObjectType.FILE:
        return DvObjectType.FILE
    }
  }
}
