import { CollectionType } from '../../models/CollectionType'

export interface CollectionDTO {
  alias: string
  name: string
  contacts: string[]
  type: CollectionType
  affiliation?: string
  description?: string
  metadataBlockNames?: string[]
  facetIds?: string[]
  inputLevels?: CollectionInputLevelDTO[]
}

export interface CollectionInputLevelDTO {
  datasetFieldName: string
  include: boolean
  required: boolean
}

export const collectionTypeOptions = {
  RESEARCHERS: {
    label: 'Researchers',
    value: CollectionType.RESEARCHERS
  },
  RESEARCH_PROJECTS: {
    label: 'Research Projects',
    value: CollectionType.RESEARCH_PROJECTS
  },
  JOURNALS: {
    label: 'Journals',
    value: CollectionType.JOURNALS
  },
  ORGANIZATIONS_INSTITUTIONS: {
    label: 'Organizations/Institutions',
    value: CollectionType.ORGANIZATIONS_INSTITUTIONS
  },
  TEACHING_COURSES: {
    label: 'Teaching Courses',
    value: CollectionType.TEACHING_COURSES
  },
  UNCATEGORIZED: {
    label: 'Uncategorized',
    value: CollectionType.UNCATEGORIZED
  },
  LABORATORY: {
    label: 'Laboratory',
    value: CollectionType.LABORATORY
  },
  RESEARCH_GROUP: {
    label: 'Research Group',
    value: CollectionType.RESEARCH_GROUP
  },
  DEPARTMENT: {
    label: 'Department',
    value: CollectionType.DEPARTMENT
  }
} as const
// 👇 To be defined, at the moment the SPA only supports file uploading through direct upload (S3), so we are disabling the storage selector
export const collectionStorageOptions = {
  S3: 'S3'
} as const

export type CollectionStorage =
  (typeof collectionStorageOptions)[keyof typeof collectionStorageOptions]
