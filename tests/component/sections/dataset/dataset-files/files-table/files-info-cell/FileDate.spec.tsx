import { FileDate } from '../../../../../../../src/sections/dataset/dataset-files/files-table/file-info-cell/FileDate'
import { FileDateType } from '../../../../../../../src/files/domain/models/File'
describe('FileDate', () => {
  it('renders the date', () => {
    const date = { type: FileDateType.PUBLISHED, date: '2021-01-01' }
    cy.customMount(<FileDate date={date} />)

    cy.findByText(`Published ${date.date}`).should('exist')
  })
})
