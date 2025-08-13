import { ReactElement } from 'react'
import { DataverseInfoJSDataverseRepository } from '../../../info/infrastructure/repositories/DataverseInfoJSDataverseRepository'
import { Footer } from './Footer'

const dataverseInfoRepository = new DataverseInfoJSDataverseRepository()

export class FooterFactory {
  static create(): ReactElement {
    return <Footer dataverseInfoRepository={dataverseInfoRepository} />
  }
}
