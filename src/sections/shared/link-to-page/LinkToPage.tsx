import { Link } from 'react-router-dom'
import { PropsWithChildren } from 'react'
import { Route } from '../../Route.enum'

interface LinkToPageProps {
  page: Route
  searchParams?: Record<string, string>
}

export function LinkToPage({ children, page, searchParams }: PropsWithChildren<LinkToPageProps>) {
  const searchParamsString: string = searchParams ? '?' + encodeSearchParamsToURI(searchParams) : ''

  return <Link to={`${page}${searchParamsString}`}>{children}</Link>
}

const encodeSearchParamsToURI = (searchParams: Record<string, string>) => {
  return Object.entries(searchParams)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
}
