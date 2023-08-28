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
  }

  static async addLabel(id: number, labels: FileLabel[]) {
    const newMetadata: { description: string; tags?: string[]; categories?: string[] } = {
      description: 'Test description'
    }

    labels.forEach((label, index) => {
      if (label.type === FileLabelType.CATEGORY) {
        newMetadata.categories = newMetadata.categories || []
        newMetadata.categories.push(label.value)
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
