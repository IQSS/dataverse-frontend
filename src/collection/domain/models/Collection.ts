import { UpwardHierarchyNode } from '../../../shared/hierarchy/domain/models/UpwardHierarchyNode'

export interface Collection {
  id: string
  name: string
  hierarchy: UpwardHierarchyNode
  isReleased: boolean
  description?: string
  affiliation?: string
}

export const ROOT_COLLECTION_ALIAS = 'root'
