import { AccessRepository, GuestbookResponseDTO } from '../repositories/AccessRepository'

export function submitGuestbookForDatasetDownload(
  accessRepository: AccessRepository,
  datasetId: number | string,
  answers: GuestbookResponseDTO,
  format?: string
): Promise<string> {
  return accessRepository.submitGuestbookForDatasetDownload(datasetId, answers, format)
}
