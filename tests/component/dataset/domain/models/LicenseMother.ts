import { DatasetLicense } from '../../../../../src/dataset/domain/models/Dataset'
export class LicenseMother {
  static create(props?: Partial<DatasetLicense>): DatasetLicense {
    const defaultLicense: DatasetLicense = {
      name: 'CC0 1.0',
      uri: 'https://creativecommons.org/publicdomain/zero/1.0/',
      iconUri: 'https://licensebuttons.net/p/zero/1.0/88x31.png'
    }

    return { ...defaultLicense, ...props }
  }
}
