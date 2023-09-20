import { ReactElement, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Dataset } from './Dataset'
import { DatasetJSDataverseRepository } from '../../dataset/infrastructure/repositories/DatasetJSDataverseRepository'
import { useAnonymized } from './anonymized/AnonymizedContext'
import { AnonymizedProvider } from './anonymized/AnonymizedProvider'
import { FileJSDataverseRepository } from '../../files/infrastructure/FileJSDataverseRepository'
import { MetadataBlockInfoProvider } from './metadata-block-info/MetadataBlockProvider'
import { MetadataBlockInfoJSDataverseRepository } from '../../metadata-block-info/infrastructure/repositories/MetadataBlockInfoJSDataverseRepository'
import { SettingJSDataverseRepository } from '../../settings/infrastructure/SettingJSDataverseRepository'
import { FilePermissionsProvider } from '../file/file-permissions/FilePermissionsProvider'
import { SettingsProvider } from '../settings/SettingsProvider'

const datasetRepository = new DatasetJSDataverseRepository()
const fileRepository = new FileJSDataverseRepository()
const metadataBlockInfoRepository = new MetadataBlockInfoJSDataverseRepository()
const settingRepository = new SettingJSDataverseRepository()

export class DatasetFactory {
  static create(): ReactElement {
    return (
      <FilePermissionsProvider repository={fileRepository}>
        <SettingsProvider repository={settingRepository}>
          <MetadataBlockInfoProvider repository={metadataBlockInfoRepository}>
            <AnonymizedProvider>
              <DatasetWithSearchParams />
            </AnonymizedProvider>
          </MetadataBlockInfoProvider>
        </SettingsProvider>
      </FilePermissionsProvider>
    )
  }
}

function DatasetWithSearchParams() {
  const { setAnonymizedView } = useAnonymized()
  const [searchParams] = useSearchParams()
  const persistentId = searchParams.get('persistentId') ?? undefined
  const privateUrlToken = searchParams.get('privateUrlToken')
  const version = searchParams.get('version') ?? undefined

  useEffect(() => {
    if (privateUrlToken) setAnonymizedView(true)
  }, [privateUrlToken])

  if (privateUrlToken) {
    return (
      <Dataset
        datasetRepository={datasetRepository}
        fileRepository={fileRepository}
        searchParams={{ privateUrlToken: privateUrlToken }}
      />
    )
  }

  return (
    <Dataset
      datasetRepository={datasetRepository}
      fileRepository={fileRepository}
      searchParams={{ persistentId: persistentId, version: version }}
    />
  )
}
