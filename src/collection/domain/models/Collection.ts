import { UpwardHierarchyNode } from '../../../shared/hierarchy/domain/models/UpwardHierarchyNode'

export interface Collection {
  id: string
  name: string
  hierarchy: UpwardHierarchyNode
  description?: string
  affiliation?: string
}
