import { useCallback, useEffect, useState } from 'react'
import { ReadError } from '@iqss/dataverse-client-javascript'
import { SearchRepository } from '../repositories/SearchRepository'
import { SearchService } from '../models/SearchService'
import { getSearchServices } from '../useCases/getSearchServices'
import { JSDataverseReadErrorHandler } from '@/shared/helpers/JSDataverseReadErrorHandler'

interface useGetSearchServicesProps {
  searchRepository: SearchRepository
  autoFetch?: boolean
}

export const useGetSearchServices = ({
  searchRepository,
  autoFetch = true
}: useGetSearchServicesProps) => {
  const [searchServices, setSearchServices] = useState<SearchService[]>([])
  const [isLoadingSearchServices, setIsLoadingSearchServices] = useState<boolean>(autoFetch)
  const [errorSearchServices, setErrorSearchServices] = useState<string | null>(null)

  const fetchSearchServices = useCallback(async () => {
    setIsLoadingSearchServices(true)
    setErrorSearchServices(null)

    try {
      const searchServicesResponse = await getSearchServices(searchRepository)

      setSearchServices(searchServicesResponse)
    } catch (err) {
      if (err instanceof ReadError) {
        const error = new JSDataverseReadErrorHandler(err)
        const formattedError =
          error.getReasonWithoutStatusCode() ?? /* istanbul ignore next */ error.getErrorMessage()

        setErrorSearchServices(formattedError)
      } else {
        setErrorSearchServices('Something went wrong getting the search services. Try again later.')
      }
    } finally {
      setIsLoadingSearchServices(false)
    }
  }, [searchRepository])

  useEffect(() => {
    if (autoFetch) {
      void fetchSearchServices()
    }
  }, [autoFetch, fetchSearchServices])

  return {
    searchServices,
    isLoadingSearchServices,
    errorSearchServices,
    fetchSearchServices
  }
}
