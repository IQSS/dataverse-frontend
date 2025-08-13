import { FileDate } from '../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-info/file-info-cell/file-info-data/FileDate'
import { FileDateType } from '../../../../../../../../../src/files/domain/models/FileMetadata'

describe('FileDate', () => {
  it('renders the date', () => {
    const fileDate = '2023-09-18'
    const date = { type: FileDateType.PUBLISHED, date: fileDate }
    cy.customMount(<FileDate date={date} />)
    cy.findByText(`Published`).should('exist')
    cy.get('time').should('have.text', fileDate)
  })
})
