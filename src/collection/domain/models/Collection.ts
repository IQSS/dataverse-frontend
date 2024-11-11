import { UpwardHierarchyNode } from '../../../shared/hierarchy/domain/models/UpwardHierarchyNode'
import { CollectionContact } from './CollectionContact'
import { CollectionType } from './CollectionType'

export interface Collection {
  id: string
  name: string
  hierarchy: UpwardHierarchyNode
  isReleased: boolean
  description?: string
  affiliation?: string
  inputLevels?: CollectionInputLevel[]
  type: CollectionType
  contacts: CollectionContact[]
  usesMetadataFieldsFromParent: boolean
  usesBrowseSearchFacetsFromParent: boolean
}

export interface CollectionInputLevel {
  datasetFieldName: string
  include: boolean
  required: boolean
}
