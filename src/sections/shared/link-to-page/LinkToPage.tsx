import { Link } from 'react-router-dom'
import { PropsWithChildren } from 'react'
import { Route, RouteWithParams } from '../../Route.enum'
import { DvObjectType } from '../../../shared/hierarchy/domain/models/UpwardHierarchyNode'

interface LinkToPageProps {
  page: Route
  searchParams?: Record<string, string>
  type: DvObjectType
}

export function LinkToPage({
  children,
  page,
  searchParams,
  type
}: PropsWithChildren<LinkToPageProps>) {
  const searchParamsString: string = searchParams ? '?' + encodeSearchParamsToURI(searchParams) : ''

  if (type === DvObjectType.COLLECTION && searchParams && 'id' in searchParams) {
    return <Link to={RouteWithParams.COLLECTIONS(searchParams.id)}>{children}</Link>
  }

  return <Link to={`${page}${searchParamsString}`}>{children}</Link>
}

const encodeSearchParamsToURI = (searchParams: Record<string, string>) => {
  return Object.entries(searchParams)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
}
