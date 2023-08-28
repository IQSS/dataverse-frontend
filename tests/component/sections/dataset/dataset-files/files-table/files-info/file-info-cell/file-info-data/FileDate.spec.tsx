import { FileDate } from '../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-info/file-info-cell/file-info-data/FileDate'
import { FileDateType } from '../../../../../../../../../src/files/domain/models/File'
describe('FileDate', () => {
  it('renders the date', () => {
    const date = { type: FileDateType.PUBLISHED, date: new Date() }
    cy.customMount(<FileDate date={date} />)

    cy.findByText(`Published ${date.date.toDateString()}`).should('exist')
  })
})
