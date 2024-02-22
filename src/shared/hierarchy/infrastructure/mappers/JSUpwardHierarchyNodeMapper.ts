import { DvObjectOwnerNode as JSUpwardHierarchyNode } from '@iqss/dataverse-client-javascript'
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
      undefined, // TODO: get from JSUpwardHierarchyNode once it's implemented
      JSUpwardHierarchyNodeMapper.toUpwardHierarchyNode(jsUpwardHierarchyNode.isPartOf)
    )
  }

  private static toDvObjectType(type: string): DvObjectType {
    switch (type) {
      case 'DATAVERSE':
        return DvObjectType.COLLECTION
      case 'DATASET':
        return DvObjectType.DATASET
      case 'FILE':
        return DvObjectType.FILE
      default:
        throw new Error(`Unknown DvObjectType: ${type}`)
    }
  }
}
