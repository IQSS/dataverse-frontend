export interface GuestbookResponse {
  id: number
  dataset: string
  datasetPid: string
  date: string
  type: EventType
  email?: string
  fileId?: number
  fileName?: string
  filePid?: string
  institution?: string
  position?: string
  userName: string
  customQuestions?: GuestbookResponseCustomQuestion[]
}

export interface GuestbookResponseCustomQuestion {
  question: string
  response: string
}

export interface GuestbookResponseSubset {
  guestbookResponses: GuestbookResponse[]
  totalGuestbookResponseCount: number
}

export enum EventType {
  ACCESS_REQUEST = 'AccessRequest',
  DOWNLOAD = 'Download',
  SUBSET = 'Subset',
  EXPLORE = 'Explore'
}
