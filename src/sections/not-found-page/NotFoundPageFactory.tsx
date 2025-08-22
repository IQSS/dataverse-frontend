import { ReactElement } from 'react'
import { NotFoundPage } from './NotFoundPage'

export class NotFoundPageFactory {
  static create(): ReactElement {
    return <NotFoundPageWithParams />
  }
}

function NotFoundPageWithParams() {
  return <NotFoundPage />
}
