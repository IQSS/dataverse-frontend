import { type FieldNamesMarkedBoolean } from 'react-hook-form'
import { CollectionStorage } from '@/collection/domain/useCases/DTOs/CollectionDTO'
import {
  MetadataBlockInfo,
  MetadataField
} from '@/metadata-block-info/domain/models/MetadataBlockInfo'
import {
  INPUT_LEVELS_GROUPER,
  METADATA_BLOCKS_NAMES_GROUPER,
  USE_FACETS_FROM_PARENT,
  USE_FIELDS_FROM_PARENT
} from './EditCreateCollectionForm'
import { CollectionType } from '@/collection/domain/models/CollectionType'

export type CollectionFormData = {
  hostCollection: string | null
  name: string
  affiliation: string
  alias: string
  storage: CollectionStorage
  type: CollectionType | ''
  description: string
  contacts: { value: string }[]
  [USE_FIELDS_FROM_PARENT]: boolean
  [METADATA_BLOCKS_NAMES_GROUPER]: CollectionFormMetadataBlocks
  [INPUT_LEVELS_GROUPER]: FormattedCollectionInputLevels
  [USE_FACETS_FROM_PARENT]: boolean
  facetIds: CollectionFormFacet[]
}

export type CollectionFormDirtyFields = FieldNamesMarkedBoolean<CollectionFormData>

export type CollectionFormMetadataBlocks = Record<string, boolean>

export type FormattedCollectionInputLevels = {
  [key: string]: {
    include: boolean
    optionalOrRequired: CollectionFormInputLevelValue
    parentBlockName: string
  }
}

export type FormattedCollectionInputLevelsWithoutParentBlockName = {
  [K in keyof FormattedCollectionInputLevels]: Omit<
    FormattedCollectionInputLevels[K],
    'parentBlockName'
  >
}

export const CollectionFormInputLevelOptions = {
  OPTIONAL: 'optional',
  REQUIRED: 'required'
} as const

export type CollectionFormInputLevelValue =
  (typeof CollectionFormInputLevelOptions)[keyof typeof CollectionFormInputLevelOptions]

export type CollectionFormFacet = {
  value: string
  label: string
  id: string
}

export type MetadataFieldWithParentBlockInfo = MetadataField & {
  parentBlockInfo: Pick<MetadataBlockInfo, 'id' | 'name' | 'displayName'>
}

// On the submit function callback, type is CollectionType as type field is required and wont never be ""
export type CollectionFormValuesOnSubmit = Omit<CollectionFormData, 'type'> & {
  type: CollectionType
}

export interface CollectionFormContactValue {
  value: string
}
