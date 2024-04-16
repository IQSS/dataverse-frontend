import { ReactElement } from 'react'
import { EditDatasetFiles } from './EditDatasetFiles'

export class EditDatasetFilesFactory {
  static create(): ReactElement {
    return <EditDatasetFiles />
  }
}
