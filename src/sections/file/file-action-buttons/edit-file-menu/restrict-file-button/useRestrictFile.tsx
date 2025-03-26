import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { restrictFile } from '@/files/domain/useCases/restrictFile'
import { JSDataverseWriteErrorHandler } from '@/shared/helpers/JSDataverseWriteErrorHandler'

interface UseRestrictFile {
  fileRepository: FileRepository
  isRestricted: boolean
  onSuccessfulRestrict: () => void
}

interface UseRestrictFileReturn {
  isRestrictingFile: boolean
  errorRestrictingFile: string | null
  handleRestrictFile: (fileId: number) => Promise<void>
  isRestricted: boolean
}

export const useRestrictFile = ({
  isRestricted,
  fileRepository,
  onSuccessfulRestrict
}: UseRestrictFile): UseRestrictFileReturn => {
  const { t } = useTranslation('file')
  const [isRestrictingFile, setIsRestrictingFile] = useState<boolean>(false)
  const [errorRestrictingFile, seterrorRestrictingFile] = useState<string | null>(null)

  const handleRestrictFile = async (fileId: number) => {
    setIsRestrictingFile(true)

    try {
      await restrictFile(fileRepository, fileId, !isRestricted)
      onSuccessfulRestrict()
    } catch (err: WriteError | unknown) {
      if (err instanceof WriteError) {
        const error = new JSDataverseWriteErrorHandler(err)
        const formattedError =
          error.getReasonWithoutStatusCode() ?? /* istanbul ignore next */ error.getErrorMessage()
        seterrorRestrictingFile(formattedError)
      } else {
        isRestricted
          ? seterrorRestrictingFile(t('restriction.defaultFileUnrestrictError'))
          : seterrorRestrictingFile(t('restriction.defaultFileRestrictError'))
      }
    } finally {
      setIsRestrictingFile(false)
    }
  }

  return {
    isRestrictingFile,
    errorRestrictingFile,
    handleRestrictFile,
    isRestricted
  }
}
