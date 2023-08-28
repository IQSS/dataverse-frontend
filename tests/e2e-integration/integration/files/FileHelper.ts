import { DataverseApiHelper } from '../DataverseApiHelper'

export class FileHelper extends DataverseApiHelper {
  static async download(id: number) {
    cy.visit(`/file.xhtml?fileId=${id}`)
      .get('#actionButtonBlock > div:nth-child(1) > div > button')
      .click()
      .get('#fileForm\\:j_idt273')
      .click()
  }
}
