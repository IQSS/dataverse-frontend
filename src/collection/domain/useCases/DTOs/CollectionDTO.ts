export interface CollectionDTO {
  alias: string
  name: string
  contacts: string[]
  type: CollectionType
}

export enum CollectionType {
  RESEARCHERS = 'RESEARCHERS',
  RESEARCH_PROJECTS = 'RESEARCH_PROJECTS',
  JOURNALS = 'JOURNALS',
  ORGANIZATIONS_INSTITUTIONS = 'ORGANIZATIONS_INSTITUTIONS',
  TEACHING_COURSES = 'TEACHING_COURSES',
  UNCATEGORIZED = 'UNCATEGORIZED',
  LABORATORY = 'LABORATORY',
  RESEARCH_GROUP = 'RESEARCH_GROUP',
  DEPARTMENT = 'DEPARTMENT'
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

export const collectionStorageOptions = {
  LOCAL_DEFAULT: 'Local (Default)',
  LOCAL: 'Local'
} as const

export type CollectionStorage =
  (typeof collectionStorageOptions)[keyof typeof collectionStorageOptions]
