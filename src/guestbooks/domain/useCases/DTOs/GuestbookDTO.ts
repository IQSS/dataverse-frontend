import { GuestbookQuestionType } from '../../models/Guestbook'

export interface GuestbookDTO {
  name: string
  enabled: boolean
  emailRequired: boolean
  nameRequired: boolean
  institutionRequired: boolean
  positionRequired: boolean
  createTime?: string
  customQuestions?: GuestbookCustomQuestionDTO[]
}

export interface GuestbookCustomQuestionDTO {
  id?: number
  question: string
  required: boolean
  displayOrder: number
  type: GuestbookQuestionType
  hidden: boolean
  optionValues?: GuestbookOptionDTO[]
}

export interface GuestbookOptionDTO {
  id?: number
  value: string
  displayOrder: number
}
