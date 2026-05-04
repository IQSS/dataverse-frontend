import { useSearchParams } from 'react-router-dom'
import { EditDatasetTerms } from './EditDatasetTerms'
import { EditDatasetTermsHelper } from './EditDatasetTermsHelper'
import { LicenseJSDataverseRepository } from '../../licenses/infrastructure/repositories/LicenseJSDataverseRepository'
import { DatasetJSDataverseRepository } from '@/dataset/infrastructure/repositories/DatasetJSDataverseRepository'
import { DatasetProvider } from '../dataset/DatasetProvider'
import { ReactElement } from 'react'
import { DatasetNonNumericVersion } from '@/dataset/domain/models/Dataset'
import { GuestbookJSDataverseRepository } from '@/guestbooks/infrastructure/repositories/GuestbookJSDataverseRepository'

const licenseRepository = new LicenseJSDataverseRepository()
const datasetRepository = new DatasetJSDataverseRepository()
const guestbookRepository = new GuestbookJSDataverseRepository()

export class EditDatasetTermsFactory {
  static create(): ReactElement {
    return <EditDatasetTermsWithSearchParams />
  }
}

function EditDatasetTermsWithSearchParams() {
  const [searchParams] = useSearchParams()
  const defaultActiveTabKey = EditDatasetTermsHelper.defineSelectedTabKey(searchParams)
  const persistentId = searchParams.get('persistentId') ?? undefined
  // Always load the latest version (draft if exists, otherwise latest published)
  const version = DatasetNonNumericVersion.LATEST

  return (
    <DatasetProvider
      repository={datasetRepository}
      searchParams={{ persistentId: persistentId, version: version }}>
      <EditDatasetTerms
        defaultActiveTabKey={defaultActiveTabKey}
        licenseRepository={licenseRepository}
        datasetRepository={datasetRepository}
        guestbookRepository={guestbookRepository}
      />
    </DatasetProvider>
  )
}
