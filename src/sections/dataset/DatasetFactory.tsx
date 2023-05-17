import { ReactElement } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Dataset } from './Dataset'
import { DatasetJSDataverseRepository } from '../../dataset/infrastructure/repositories/DatasetJSDataverseRepository'

const datasetRepository = new DatasetJSDataverseRepository()

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

  return <Dataset repository={datasetRepository} id={id} />
}
