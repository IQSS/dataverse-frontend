import { PropsWithChildren, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AuthContext } from 'react-oauth2-code-pkce'
import { useDeepCompareCallback } from 'use-deep-compare'
import { DatasetContext } from './DatasetContext'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { Dataset, DatasetNonNumericVersion } from '../../dataset/domain/models/Dataset'
import { getDatasetByPersistentId } from '../../dataset/domain/useCases/getDatasetByPersistentId'
import { getDatasetByPrivateUrlToken } from '../../dataset/domain/useCases/getDatasetByPrivateUrlToken'
import { encodeReturnToPathInStateQueryParam } from '@/sections/auth-callback/AuthCallback'
import { isPermissionError } from '@/shared/helpers/JSDataverseReadErrorHandler'

interface DatasetProviderProps {
  repository: DatasetRepository
  searchParams: {
    persistentId?: string
    privateUrlToken?: string
    version?: string
  }
  isPublishing?: boolean
}

export function DatasetProvider({
  repository,
  searchParams,
  isPublishing,
  children
}: PropsWithChildren<DatasetProviderProps>) {
  const [dataset, setDataset] = useState<Dataset>()
  const [isLoading, setIsLoading] = useState(true)
  const [isNotAuthorized, setIsNotAuthorized] = useState(false)
  const { pathname, search } = useLocation()
  const { token, loginInProgress, logIn } = useContext(AuthContext)
  const isDraftRequest = searchParams.version === DatasetNonNumericVersion.DRAFT

  const redirectToLoginIfAnonymousRef = useRef<() => boolean>(() => false)
  useEffect(() => {
    redirectToLoginIfAnonymousRef.current = () => {
      if (token) return false
      if (!loginInProgress) logIn(encodeReturnToPathInStateQueryParam(`${pathname}${search}`))
      return true
    }
  }, [token, loginInProgress, logIn, pathname, search])

  const getDataset = useDeepCompareCallback(() => {
    if (searchParams.persistentId) {
      return getDatasetByPersistentId(
        repository,
        searchParams.persistentId,
        searchParams.version,
        undefined,
        true
      )
    }
    if (searchParams.privateUrlToken) {
      return getDatasetByPrivateUrlToken(repository, searchParams.privateUrlToken)
    }
    return Promise.resolve(undefined)
  }, [repository, searchParams])

  const fetchDataset = useCallback(() => {
    if (isPublishing) return
    setIsLoading(true)
    setIsNotAuthorized(false)

    getDataset()
      .then((dataset: Dataset | undefined) => {
        setDataset(dataset)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('There was an error getting the dataset', error)
        if (isDraftRequest && isPermissionError(error)) {
          if (redirectToLoginIfAnonymousRef.current()) return
          setIsNotAuthorized(true)
        }
        setIsLoading(false)
      })
  }, [getDataset, isPublishing, isDraftRequest])

  useEffect(() => {
    fetchDataset()
  }, [fetchDataset])

  return (
    <DatasetContext.Provider
      value={{ dataset, isLoading, refreshDataset: fetchDataset, isNotAuthorized }}>
      {children}
    </DatasetContext.Provider>
  )
}
