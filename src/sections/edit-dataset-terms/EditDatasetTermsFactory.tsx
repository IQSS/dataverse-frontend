import { useSearchParams } from 'react-router-dom'
import { EditDatasetTerms } from './EditDatasetTerms'
import { EditDatasetTermsHelper } from './EditDatasetTermsHelper'
import { LicenseJSDataverseRepository } from '../../licenses/infrastructure/repositories/LicenseJSDataverseRepository'
import { DatasetJSDataverseRepository } from '@/dataset/infrastructure/repositories/DatasetJSDataverseRepository'
import { DatasetProvider } from '../dataset/DatasetProvider'
import { searchParamVersionToDomainVersion } from '../../router'
import { ReactElement } from 'react'

const licenseRepository = new LicenseJSDataverseRepository()
const datasetRepository = new DatasetJSDataverseRepository()

export class EditDatasetTermsFactory {
  static create(): ReactElement {
    return <EditDatasetTermsWithSearchParams />
  }
}

function EditDatasetTermsWithSearchParams() {
  const [searchParams] = useSearchParams()
  const defaultActiveTabKey = EditDatasetTermsHelper.defineSelectedTabKey(searchParams)
  const persistentId = searchParams.get('persistentId') ?? undefined
  const searchParamVersion = searchParams.get('version') ?? undefined
  const version = searchParamVersionToDomainVersion(searchParamVersion)

  return (
    <DatasetProvider
      repository={datasetRepository}
      searchParams={{ persistentId: persistentId, version: version }}>
      <EditDatasetTerms
        defaultActiveTabKey={defaultActiveTabKey}
        licenseRepository={licenseRepository}
        datasetRepository={datasetRepository}
      />
    </DatasetProvider>
  )
}
