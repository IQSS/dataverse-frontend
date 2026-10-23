import { FilesViewMode } from './files-view-toggle/FilesViewToggle'

export const VIEW_PARAM = 'view'
export const PATH_PARAM = 'path'

export function nextSearchParamsForView(
  current: URLSearchParams,
  next: FilesViewMode
): URLSearchParams {
  const updated = new URLSearchParams(current)
  if (next === 'tree') {
    updated.set(VIEW_PARAM, 'tree')
  } else {
    updated.delete(VIEW_PARAM)
    updated.delete(PATH_PARAM)
  }
  return updated
}

export function nextSearchParamsForTreePath(
  current: URLSearchParams,
  next: string
): URLSearchParams {
  const updated = new URLSearchParams(current)
  if (next) {
    updated.set(PATH_PARAM, next)
  } else {
    updated.delete(PATH_PARAM)
  }
  return updated
}
