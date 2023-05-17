import { ReactElement } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Dataset } from './Dataset'
import { DatasetJSDataverseRepository } from '../../dataset/infrastructure/repositories/DatasetJSDataverseRepository'
import { DatasetTemplateProvider } from './dataset-template/DatasetTemplateProvider'
import { DatasetTemplateJSDataverseRepository } from '../../dataset/infrastructure/repositories/DatasetTemplateJSDataverseRepository'

const datasetRepository = new DatasetJSDataverseRepository()
const datasetTemplateRepository = new DatasetTemplateJSDataverseRepository()

export class DatasetFactory {
  static create(): ReactElement {
    return <DatasetWithRouteId />
  }
}

function DatasetWithRouteId() {
  const { id } = useParams()
  const navigate = useNavigate()

  if (id === undefined) {
    navigate('/')
    return <></>
  }

  return (
    <DatasetTemplateProvider repository={datasetTemplateRepository}>
      <Dataset repository={datasetRepository} id={id} />
    </DatasetTemplateProvider>
  )
}
