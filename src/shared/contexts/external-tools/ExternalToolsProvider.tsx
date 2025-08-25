import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ExternalTool, ToolScope, ToolType } from '@/externalTools/domain/models/ExternalTool'
import { ExternalToolsRepository } from '@/externalTools/domain/repositories/ExternalToolsRepository'
import { getExternalTools } from '@/externalTools/domain/useCases/GetExternalTools'
import { ReadError } from '@iqss/dataverse-client-javascript'
import { JSDataverseReadErrorHandler } from '@/shared/helpers/JSDataverseReadErrorHandler'

type ExternalToolsContextValue = {
  externalTools: ExternalTool[]
  loading: boolean
  error: unknown
  refreshExternalTools: () => Promise<void>
  datasetExploreTools: ExternalTool[]
  fileExploreTools: ExternalTool[]
  filePreviewTools: ExternalTool[]
}

const ExternalToolsContext = createContext<ExternalToolsContextValue | undefined>(undefined)

type ExternalToolsProviderProps = {
  externalToolsRepository: ExternalToolsRepository
  children: React.ReactNode
}

export function ExternalToolsProvider({
  externalToolsRepository,
  children
}: ExternalToolsProviderProps) {
  const [externalTools, setExternalTools] = useState<ExternalTool[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<unknown>(undefined)

  const fetchExternalTools = useCallback(async () => {
    setLoading(true)
    setError(undefined)

    try {
      const data = await getExternalTools(externalToolsRepository)
      setExternalTools(data)
    } catch (err: ReadError | unknown) {
      if (err instanceof ReadError) {
        const error = new JSDataverseReadErrorHandler(err)
        const formattedError =
          error.getReasonWithoutStatusCode() ?? /* istanbul ignore next */ error.getErrorMessage()

        setError(formattedError)
      } else {
        setError('An unexpected error occurred while fetching external tools.')
      }
    } finally {
      setLoading(false)
    }
  }, [externalToolsRepository])

  useEffect(() => {
    void fetchExternalTools()
  }, [fetchExternalTools])

  const datasetExploreTools = useMemo(() => {
    return externalTools.filter(
      (tool) => tool.scope === ToolScope.Dataset && tool.types.includes(ToolType.Explore)
    )
  }, [externalTools])

  const fileExploreTools = useMemo(() => {
    return externalTools.filter(
      (tool) => tool.scope === ToolScope.File && tool.types.includes(ToolType.Explore)
    )
  }, [externalTools])

  const filePreviewTools = useMemo(() => {
    return externalTools.filter(
      (tool) => tool.scope === ToolScope.File && tool.types.includes(ToolType.Preview)
    )
  }, [externalTools])

  const value = useMemo<ExternalToolsContextValue>(
    () => ({
      externalTools,
      loading,
      error,
      datasetExploreTools,
      fileExploreTools,
      filePreviewTools,
      refreshExternalTools: fetchExternalTools
    }),
    [
      externalTools,
      loading,
      error,
      datasetExploreTools,
      fileExploreTools,
      filePreviewTools,
      fetchExternalTools
    ]
  )

  return <ExternalToolsContext.Provider value={value}>{children}</ExternalToolsContext.Provider>
}

export function useExternalTools() {
  const ctx = useContext(ExternalToolsContext)
  if (!ctx) {
    throw new Error('useExternalTools must be used within a ExternalToolsProvider')
  }
  return ctx
}
