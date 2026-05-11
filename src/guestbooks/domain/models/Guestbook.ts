export type GuestbookQuestionType = 'text' | 'textarea' | 'options'

export interface GuestbookOption {
  value: string
  displayOrder: number
}

export interface GuestbookCustomQuestion {
  id?: number | string
  question: string
  required: boolean
  displayOrder: number
  type: GuestbookQuestionType
  hidden: boolean
  optionValues?: GuestbookOption[]
}

export interface Guestbook {
  id: number
  name: string
  enabled: boolean
  emailRequired: boolean
  nameRequired: boolean
  institutionRequired: boolean
  positionRequired: boolean
  customQuestions: GuestbookCustomQuestion[]
  createTime: string
  dataverseId: number
}
