import { ReactElement } from 'react'
import { useLocation } from 'react-router-dom'
import { NotFoundPage } from './NotFoundPage'

export class NotFoundPageFactory {
  static create(): ReactElement {
    return <NotFoundPageWithParams />
  }
}

function NotFoundPageWithParams() {
  const location = useLocation()
  const locationState = location.state as { foo: boolean } | undefined

  console.log(locationState)

  return <NotFoundPage />
}
