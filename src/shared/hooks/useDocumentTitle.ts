import { useEffect } from 'react'

export const DEFAULT_DOCUMENT_TITLE = 'Dataverse'

export interface UseDocumentTitleOptions {
  parentTitle?: string
  restoreOnUnmount?: boolean
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
  return DEFAULT_DOCUMENT_TITLE
}

export const useDocumentTitle = (title?: string, options?: UseDocumentTitleOptions): void => {
  useEffect(() => {
    if (!title && !options?.parentTitle) {
      return
    }

    const previousTitle = document.title
    document.title = formatDocumentTitle(title, options?.parentTitle)

    return () => {
      if (options?.restoreOnUnmount) {
        document.title = previousTitle
      }
    }
  }, [title, options?.parentTitle, options?.restoreOnUnmount])
}
