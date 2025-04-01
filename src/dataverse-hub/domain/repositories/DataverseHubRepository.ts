export class DataverseHubRepository {
  getVersion(): Promise<string> {
    return Promise.resolve('v. 4.99.99')
  }
}
