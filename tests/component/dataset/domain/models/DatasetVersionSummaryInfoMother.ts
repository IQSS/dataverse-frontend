import { faker } from '@faker-js/faker'
import { DatasetVersionSummaryInfo } from '../../../../../src/dataset/domain/models/DatasetVersionSummaryInfo'
import { DatasetVersionSummaryStringValues } from '@iqss/dataverse-client-javascript'

export class DatasetVersionSummaryInfoMother {
  static create(props?: Partial<DatasetVersionSummaryInfo>): DatasetVersionSummaryInfo {
    const datasetVersionSummaryInfo = {
      id: faker.datatype.number(),
      versionNumber: faker.datatype.number({ min: 1, max: 10 }).toString(),
      releaseDate: faker.date.past().toISOString(),
      publishedOn: faker.date.past().toISOString(),
      summary: DatasetVersionSummaryStringValues.firstPublished,
      contributors: faker.name.fullName(),
      ...props
    }
    return datasetVersionSummaryInfo
  }
  static createList(
    size: number,
    props?: Partial<DatasetVersionSummaryInfo>
  ): DatasetVersionSummaryInfo[] {
    return Array.from({ length: size }, () => this.create(props))
  }
}
