export interface CollectionDTO {
  alias: string
  name: string
  contacts: string[]
  type: CollectionType
}

export const collectionTypeOptions = {
  RESEARCHERS: 'Researchers',
  RESEARCH_PROJECTS: 'Research Projects',
  JOURNALS: 'Journals',
  ORGANIZATIONS_INSTITUTIONS: 'Organizations/Institutions',
  TEACHING_COURSES: 'Teaching Courses',
  UNCATEGORIZED: 'Uncategorized',
  LABORATORY: 'Laboratory',
  RESEARCH_GROUP: 'Research Group',
  DEPARTMENT: 'Department'
} as const

export type CollectionType = (typeof collectionTypeOptions)[keyof typeof collectionTypeOptions]

export const collectionStorageOptions = {
  LOCAL_DEFAULT: 'Local (Default)',
  LOCAL: 'Local'
} as const

export type CollectionStorage =
  (typeof collectionStorageOptions)[keyof typeof collectionStorageOptions]
