import { DataverseApiHelper } from '../DataverseApiHelper'
import { FileLabel, FileLabelType } from '../../../../src/files/domain/models/File'

interface FileResponse {
  id: number
}

export class FileHelper extends DataverseApiHelper {
  static async download(id: number) {
    cy.visit(`/file.xhtml?fileId=${id}`)
      .get('#actionButtonBlock > div:nth-child(1) > div > button')
      .click()
      .get('#fileForm\\:j_idt273')
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
      true
    )
  }
}
