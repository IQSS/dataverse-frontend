import { DataverseApiHelper } from '../DataverseApiHelper'
import { FileLabel, FileLabelType } from '../../../../src/files/domain/models/FileMetadata'
import { faker } from '@faker-js/faker'

interface FileResponse {
  id: number
}

export interface FileData {
  file: Blob
  jsonData: string
}

interface FileMetadata {
  description: string
  restrict?: string
  categories?: string[]
  tabIngest?: string
}

export class FileHelper extends DataverseApiHelper {
  static createManyRestricted(
    count: number,
    type: 'csv' | 'txt' = 'txt',
    fileMetadata: FileMetadata = { description: 'This is an example file' }
  ): FileData[] {
    const files = []
    for (let i = 0; i < count; i++) {
      files.push(this.create(type, { ...fileMetadata, restrict: 'true' }))
    }
    return files
  }

  static createMany(
    count: number,
    type: 'csv' | 'txt' | 'img' = 'txt',
    fileMetadata: FileMetadata = { description: 'This is an example file' }
  ): FileData[] {
    const files = []
    for (let i = 0; i < count; i++) {
      files.push(this.create(type, fileMetadata))
    }
    return files
  }

  static create(
    type: 'csv' | 'txt' | 'img' = 'txt',
    fileMetadata: FileMetadata = { description: 'This is an example file' }
  ): FileData {
    let fileBinary = new Blob([this.generateTxtData()], { type: 'text/plain' })

    if (type === 'csv') {
      fileBinary = new Blob([this.generateCsvData()], { type: 'text/csv' })
    }

    return {
      file: fileBinary,
      jsonData: JSON.stringify(fileMetadata)
    }
  }

  static async createImage(): Promise<FileData> {
    const fileBinary = await this.generateImgData()
    if (!fileBinary) {
      throw new Error('File could not be fetched')
    }
    return {
      file: fileBinary,
      jsonData: JSON.stringify({ description: 'This is an example file' })
    }
  }

  static generateCsvData(): string {
    const headers = 'Name,Email,Phone,Address,City,State,Zip'
    const numRows = 10
    let csvData = headers

    for (let i = 0; i < numRows; i++) {
      const name = faker.name.firstName()
      const email = faker.internet.email()
      const phone = faker.phone.number()
      const address = faker.address.streetAddress()
      const city = faker.address.city()
      const state = faker.address.stateAbbr()
      const zip = faker.address.zipCode()

      csvData += `\n${name},${email},${phone},${address},${city},${state},${zip}`
    }

    return csvData
  }

  static generateTxtData(): string {
    return faker.lorem.sentence()
  }

  static async generateImgData(): Promise<Blob | void> {
    return await fetch(faker.image.imageUrl())
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.blob()
      })
      .catch(() => {
        throw new Error('Files could not be fetched')
      })
  }

  static async download(id: number) {
    cy.visit(`/file.xhtml?fileId=${id}`)
      .get('#actionButtonBlock > div:nth-child(1) > div > button')
      .click()
      .get('#fileForm\\:j_idt274')
      .click()
    return Promise.resolve()
  }

  static async addLabel(id: number, labels: FileLabel[]) {
    const newMetadata: { description: string; dataFileTags?: string[]; categories?: string[] } = {
      description: 'Test description'
    }

    labels.forEach((label) => {
      if (label.type === FileLabelType.CATEGORY) {
        newMetadata.categories = newMetadata.categories || []
        newMetadata.categories.push(label.value)
      }
      if (label.type === FileLabelType.TAG) {
        newMetadata.dataFileTags = newMetadata.dataFileTags || []
        newMetadata.dataFileTags.push(label.value)
      }
    })

    return this.request<FileResponse>(
      `/files/${id}/metadata`,
      'POST',
      { jsonData: JSON.stringify(newMetadata) },
      'multipart/form-data'
    )
  }

  static async restrict(id: number) {
    const newMetadata: { description: string; restrict: string } = {
      description: 'Test description',
      restrict: 'true'
    }
    return this.request<FileResponse>(
      `/files/${id}/metadata`,
      'POST',
      { jsonData: JSON.stringify(newMetadata) },
      'multipart/form-data'
    )
  }

  static async delete(id: number) {
    return this.request<FileResponse>(`/files/${id}`, 'DELETE')
  }

  static createSinglePartFileBlob(): File {
    try {
      return FileHelper.createFileBlobWithSize(1000, 'singlepart-file')
    } catch (error) {
      throw new Error(`Error while creating test singlepart file`)
    }
  }

  static createMultipartFileBlob(): File {
    try {
      return FileHelper.createFileBlobWithSize(1273741824, 'multipart-file')
    } catch (error) {
      throw new Error(`Error while creating test multipart file`)
    }
  }

  private static createFileBlobWithSize(fileSizeInBytes: number, fileName: string): File {
    const blob = FileHelper.createBlobWithSize(fileSizeInBytes)
    return new File([blob], fileName, { type: 'text/plain' })
  }

  private static createBlobWithSize(size: number): Blob {
    const arrayBuffer = new ArrayBuffer(size)
    return new Blob([arrayBuffer])
  }
}
