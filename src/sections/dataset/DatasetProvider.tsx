import { useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { AuthContext } from 'react-oauth2-code-pkce'
import { encodeReturnToPathInStateQueryParam } from '@/sections/auth-callback/AuthCallback'
import { useSession } from '@/sections/session/SessionContext'
import { PropsWithChildren, useEffect, useState, useCallback } from 'react'
import { useDeepCompareCallback } from 'use-deep-compare'
import { DatasetContext } from './DatasetContext'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { Dataset } from '../../dataset/domain/models/Dataset'
import { getDatasetByPersistentId } from '../../dataset/domain/useCases/getDatasetByPersistentId'
import { getDatasetByPrivateUrlToken } from '../../dataset/domain/useCases/getDatasetByPrivateUrlToken'

import { AlertMessageKey } from '@/alert/domain/models/Alert'

interface DatasetProviderProps {
  repository: DatasetRepository
  searchParams: {
    persistentId?: string
    privateUrlToken?: string
    version?: string
  }
  isPublishing?: boolean
}

function useOptionalLocation() {
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useLocation()
  } catch {
    return { pathname: '/', search: '' }
  }
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
  const location = useOptionalLocation()
  const pathname = location?.pathname ?? '/'
  const search = location?.search ?? ''
  const authContext = useContext(AuthContext)
  const token = authContext?.token
  const oidcLoginInProgress = authContext?.loginInProgress
  const oidcLogin = authContext?.logIn
  const { user, isLoadingUser } = useSession()

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

    getDataset()
      .then((dataset: Dataset | undefined) => {
        const isDraft =
          searchParams.version === ':draft' || searchParams.version?.toUpperCase() === 'DRAFT'

        if (
          isDraft &&
          dataset?.alerts.some((a) => a.messageKey === AlertMessageKey.NOT_AUTHORIZED)
        ) {
          if (!token && !user && !oidcLoginInProgress) {
            const state = encodeReturnToPathInStateQueryParam(`${pathname}${search}`)
            oidcLogin?.(state)
            return
          }
        }

        setDataset(dataset)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('There was an error getting the dataset', error)
        const isDraft =
          searchParams.version === ':draft' || searchParams.version?.toUpperCase() === 'DRAFT'
        if (isDraft && !token && !user && !oidcLoginInProgress) {
          const state = encodeReturnToPathInStateQueryParam(`${pathname}${search}`)
          oidcLogin?.(state)
          return
        }
        if (isDraft) {
          setIsNotAuthorized(true)
        }
        setIsLoading(false)
      })
  }, [
    getDataset,
    isPublishing,
    token,
    user,
    oidcLoginInProgress,
    isLoadingUser,
    pathname,
    search,
    oidcLogin,
    searchParams.version
  ])

  useEffect(() => {
    fetchDataset()
  }, [fetchDataset])

  return (
    <DatasetContext.Provider
      value={{
        dataset,
        isLoading,
        refreshDataset: fetchDataset,
        isNotAuthorized
      }}>
      {children}
    </DatasetContext.Provider>
  )
}
