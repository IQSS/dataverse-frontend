import { UpwardHierarchyNode } from '../../../shared/hierarchy/domain/models/UpwardHierarchyNode'

export interface Collection {
  id: string
  name: string
  hierarchy: UpwardHierarchyNode
  isReleased: boolean
  description?: string
  affiliation?: string
  inputLevels?: CollectionInputLevel[]
}

export interface CollectionInputLevel {
  datasetFieldName: string
  include: boolean
  required: boolean
}
