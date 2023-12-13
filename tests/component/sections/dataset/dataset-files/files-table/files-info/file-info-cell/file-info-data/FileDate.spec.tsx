import { FileDate } from '../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-info/file-info-cell/file-info-data/FileDate'
import { FileDateType } from '../../../../../../../../../src/files/domain/models/FilePreview'

describe('FileDate', () => {
  it('renders the date', () => {
    const fileDate = new Date('2023-09-18')
    const date = { type: FileDateType.PUBLISHED, date: fileDate }
    cy.customMount(<FileDate date={date} />)
    const dateString = fileDate.toLocaleDateString(Intl.DateTimeFormat().resolvedOptions().locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
    cy.findByText(`Published ` + dateString).should('exist')
  })
})
