import { useSearchParams } from 'react-router-dom'
import { EditDatasetTerms } from './EditDatasetTerms'
import { EditDatasetTermsHelper } from './EditDatasetTermsHelper'

export class EditDatasetTermsFactory {
  static create() {
    return <EditDatasetTermsWithSearchParams />
  }
}

function EditDatasetTermsWithSearchParams() {
  const [searchParams] = useSearchParams()
  const defaultActiveTabKey = EditDatasetTermsHelper.defineSelectedTabKey(searchParams)

  return <EditDatasetTerms defaultActiveTabKey={defaultActiveTabKey} />
}
