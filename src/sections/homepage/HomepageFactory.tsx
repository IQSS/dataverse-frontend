import { ReactElement } from 'react'
import Homepage from './Homepage'

export class HomepageFactory {
  static create(): ReactElement {
    return <Homepage />
  }
}
