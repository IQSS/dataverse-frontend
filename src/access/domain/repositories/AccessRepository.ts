export type GuestbookResponseAnswer = { id: number | string; value: string | string[] }

export interface AccessRepository {
  submitGuestbookForDatasetDownload: (
    datasetId: number | string,
    answers: GuestbookResponseAnswer[]
  ) => Promise<string>
  submitGuestbookForDatafileDownload: (
    fileId: number | string,
    answers: GuestbookResponseAnswer[]
  ) => Promise<string>
  submitGuestbookForDatafilesDownload: (
    fileIds: Array<number | string>,
    answers: GuestbookResponseAnswer[]
  ) => Promise<string>
}
