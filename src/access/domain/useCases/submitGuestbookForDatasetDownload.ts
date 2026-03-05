import { AccessRepository, GuestbookResponseAnswer } from '../repositories/AccessRepository'

export function submitGuestbookForDatasetDownload(
  accessRepository: AccessRepository,
  datasetId: number | string,
  answers: GuestbookResponseAnswer[]
): Promise<string> {
  return accessRepository.submitGuestbookForDatasetDownload(datasetId, answers)
}
