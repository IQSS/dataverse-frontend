import { useCallback, useEffect, useState } from 'react'
import { ReadError } from '@iqss/dataverse-client-javascript'
import { LicenseRepository } from '../../../licenses/domain/repositories/LicenseRepository'
import { License } from '../../../licenses/domain/models/License'
import { getLicenses } from '../../../licenses/domain/useCases/getLicenses'
import { JSDataverseReadErrorHandler } from '@/shared/helpers/JSDataverseReadErrorHandler'

interface UseGetLicensesProps {
  licenseRepository: LicenseRepository
  autoFetch?: boolean
}

export const useGetLicenses = ({ licenseRepository, autoFetch = true }: UseGetLicensesProps) => {
  const [licenses, setLicenses] = useState<License[]>([])
  const [isLoadingLicenses, setIsLoadingLicenses] = useState<boolean>(autoFetch)
  const [errorLicenses, setErrorLicenses] = useState<string | null>(null)

  const fetchLicenses = useCallback(async () => {
    setIsLoadingLicenses(true)
    setErrorLicenses(null)

    try {
      const licensesResponse = await getLicenses(licenseRepository)
      setLicenses(licensesResponse)
    } catch (err) {
      if (err instanceof ReadError) {
        const error = new JSDataverseReadErrorHandler(err)
        const formattedError =
          error.getReasonWithoutStatusCode() ?? /* istanbul ignore next */ error.getErrorMessage()
        setErrorLicenses(formattedError)
      } else {
        setErrorLicenses('Something went wrong getting the licenses. Try again later.')
      }
    } finally {
      setIsLoadingLicenses(false)
    }
  }, [licenseRepository])

  useEffect(() => {
    if (autoFetch) {
      void fetchLicenses()
    }
  }, [autoFetch, fetchLicenses])

  return {
    licenses,
    isLoadingLicenses,
    errorLicenses,
    fetchLicenses
  }
}
