import { DatasetDownloadCount } from '@/dataset/domain/models/DatasetDownloadCount'

export class DatasetDownloadCountMother {
  static createWithoutMDCStartDate(props?: Partial<DatasetDownloadCount>): DatasetDownloadCount {
    return {
      id: 1,
      downloadCount: 15,
      ...props
    }
  }

  static createWithMDCStartDate(props?: Partial<DatasetDownloadCount>): DatasetDownloadCount {
    return {
      id: 1,
      downloadCount: 10,
      MDCStartDate: '2019-10-01',
      ...props
    }
  }
}
