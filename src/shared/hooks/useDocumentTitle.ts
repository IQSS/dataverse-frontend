import { useEffect } from 'react'

export const DEFAULT_DOCUMENT_TITLE = 'Dataverse'

let defaultInstallationName = DEFAULT_DOCUMENT_TITLE

export const setDefaultInstallationName = (name?: string): void => {
  if (name && name.trim().length > 0) {
    defaultInstallationName = name.trim()
  }
}

export const getDefaultInstallationName = (): string => defaultInstallationName

export const resetDefaultInstallationName = (): void => {
  defaultInstallationName = DEFAULT_DOCUMENT_TITLE
}

export interface UseDocumentTitleOptions {
  parentTitle?: string
  restoreOnUnmount?: boolean
  defaultTitle?: string
  enabled?: boolean
}

export const formatDocumentTitle = (title?: string, parentTitle?: string): string => {
  if (title && parentTitle) {
    return `${title} - ${parentTitle}`
  }
  if (title) {
    return title
  }
  if (parentTitle) {
    return parentTitle
  }
  return getDefaultInstallationName()
}

export const useDocumentTitle = (title?: string, options?: UseDocumentTitleOptions): void => {
  const enabled = options?.enabled ?? true

  useEffect(() => {
    if (!enabled || (!title && !options?.parentTitle)) {
      return
    }

    const previousTitle = document.title
    document.title = formatDocumentTitle(title, options?.parentTitle)

    return () => {
      if (options?.restoreOnUnmount) {
        document.title = previousTitle
      } else {
        document.title = options?.defaultTitle || getDefaultInstallationName()
      }
    }
  }, [title, options?.parentTitle, options?.restoreOnUnmount, options?.defaultTitle, enabled])
}
