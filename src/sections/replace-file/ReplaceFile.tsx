import { FileRepository } from '@/files/domain/repositories/FileRepository'

interface ReplaceFileProps {
  fileRepository: FileRepository
  fileIdFromParams: number
  datasetPidFromParams: string
  referrer: ReferrerType
}

export type ReferrerType = 'FILE' | 'DATASET'

export const ReplaceFile = ({
  fileRepository,
  fileIdFromParams,
  datasetPidFromParams,
  referrer
}: ReplaceFileProps) => {
  console.log({
    fileRepository,
    fileIdFromParams,
    datasetPidFromParams,
    referrer
  })

  return (
    <div>
      <h1>Replace File Page</h1>
    </div>
  )
}
