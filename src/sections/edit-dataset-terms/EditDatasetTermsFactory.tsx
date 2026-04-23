import { useSearchParams } from 'react-router-dom'
import { EditDatasetTerms } from './EditDatasetTerms'
import { EditDatasetTermsHelper } from './EditDatasetTermsHelper'
import { LicenseJSDataverseRepository } from '../../licenses/infrastructure/repositories/LicenseJSDataverseRepository'
import { DatasetJSDataverseRepository } from '@/dataset/infrastructure/repositories/DatasetJSDataverseRepository'
import { DatasetProvider } from '../dataset/DatasetProvider'
import { ReactElement } from 'react'
import { DatasetNonNumericVersion } from '@/dataset/domain/models/Dataset'
import { GuestbookJSDataverseRepository } from '@/guestbooks/infrastructure/repositories/GuestbookJSDataverseRepository'
import { CollectionJSDataverseRepository } from '@/collection/infrastructure/repositories/CollectionJSDataverseRepository'
import { RepositoriesProvider } from '@/shared/contexts/repositories/RepositoriesProvider'

const licenseRepository = new LicenseJSDataverseRepository()
const datasetRepository = new DatasetJSDataverseRepository()
const guestbookRepository = new GuestbookJSDataverseRepository()
const collectionRepository = new CollectionJSDataverseRepository()

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
    <RepositoriesProvider
      collectionRepository={collectionRepository}
      datasetRepository={datasetRepository}>
      <DatasetProvider
        repository={datasetRepository}
        searchParams={{ persistentId: persistentId, version: version }}>
        <EditDatasetTerms
          defaultActiveTabKey={defaultActiveTabKey}
          licenseRepository={licenseRepository}
          guestbookRepository={guestbookRepository}
        />
      </DatasetProvider>
    </RepositoriesProvider>
  )
}
