import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { restrictFile } from '@/files/domain/useCases/restrictFile'
import { JSDataverseWriteErrorHandler } from '@/shared/helpers/JSDataverseWriteErrorHandler'
import { RestrictFileDTO } from '@/files/domain/useCases/restrictFileDTO'

interface UseRestrictFile {
  fileRepository: FileRepository
  isRestricted: boolean
  onSuccessfulRestrict: () => void
}

interface UseRestrictFileReturn {
  isRestrictingFile: boolean
  errorRestrictingFile: string | null
  handleRestrictFile: (
    fileId: number,
    enableAccessRequest: boolean,
    terms: string | undefined
  ) => Promise<void>
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

  const handleRestrictFile = async (
    fileId: number,
    enableAccessRequest: boolean,
    terms?: string
  ) => {
    setIsRestrictingFile(true)

    const restrictFileDTO: RestrictFileDTO = {
      restrict: !isRestricted
    }

    if (isRestricted === false) {
      restrictFileDTO.enableAccessRequest = enableAccessRequest
      restrictFileDTO.termsOfAccess = terms
    }

    try {
      await restrictFile(fileRepository, fileId, restrictFileDTO)
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
