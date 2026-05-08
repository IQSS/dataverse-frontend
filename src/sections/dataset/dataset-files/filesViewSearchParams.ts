import { FilesViewMode } from './files-view-toggle/FilesViewToggle'

export const VIEW_PARAM = 'view'
export const PATH_PARAM = 'path'

/**
 * Compute the next URLSearchParams when the user toggles between table
 * and tree view. Switching to tree adds `?view=tree`; switching back to
 * table removes both `view` and `path` so the URL doesn't keep a stale
 * tree-only path query.
 */
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

/**
 * Compute the next URLSearchParams as the tree's currently-expanded
 * path changes. Empty / falsy paths drop the `path` param entirely so
 * the URL stays clean while at the root.
 */
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
