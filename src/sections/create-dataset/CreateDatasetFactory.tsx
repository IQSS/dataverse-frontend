import { ReactElement } from 'react'
import { DatasetCreateMaster } from './CreateDatasetContext'

export class CreateDatasetFactory {
  static create(): ReactElement {
    return <DatasetCreateMaster />
  }
}
