import { ReactElement } from 'react'
import { AdvancedSearch } from './AdvancedSearch'

export class AdvancedSearchFactory {
  static create(): ReactElement {
    return <AdvancedSearchWithSearchParams />
  }
}

function AdvancedSearchWithSearchParams() {
  return <AdvancedSearch />
}
