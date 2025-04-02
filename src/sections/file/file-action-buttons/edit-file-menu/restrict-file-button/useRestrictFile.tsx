import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { restrictFile } from '@/files/domain/useCases/restrictFile'
import { JSDataverseWriteErrorHandler } from '@/shared/helpers/JSDataverseWriteErrorHandler'
import { RestrictDTO } from '@/files/domain/useCases/restrictFileDTO'

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
    enableAccessRequest: boolean | undefined,
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
    enableAccessRequest: boolean | undefined,
    terms?: string
  ) => {
    setIsRestrictingFile(true)

    const restrictDTO: RestrictDTO = {
      restrict: !isRestricted
    }

    if (isRestricted == false) {
      restrictDTO.enableAccessRequest = enableAccessRequest
      restrictDTO.termsOfAccess = terms
    }

    try {
      console
      await restrictFile(fileRepository, fileId, restrictDTO)
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
