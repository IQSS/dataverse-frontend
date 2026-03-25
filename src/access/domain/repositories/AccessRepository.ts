export type GuestbookAnswerDTO = {
  id: number | string
  value: string | string[]
}

export type GuestbookResponseDTO = {
  guestbookResponse: {
    name?: string
    email?: string
    institution?: string
    position?: string
    answers?: GuestbookAnswerDTO[]
  }
}
export interface AccessRepository {
  submitGuestbookForDatasetDownload: (
    datasetId: number | string,
    answers: GuestbookResponseDTO,
    format?: string
  ) => Promise<string>
  submitGuestbookForDatafileDownload: (
    fileId: number | string,
    answers: GuestbookResponseDTO,
    format?: string
  ) => Promise<string>
  submitGuestbookForDatafilesDownload: (
    fileIds: Array<number>,
    answers: GuestbookResponseDTO,
    format?: string
  ) => Promise<string>
}
