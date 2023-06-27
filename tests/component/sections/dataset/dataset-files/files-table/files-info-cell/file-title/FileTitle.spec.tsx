import { FileMother } from '../../../../../../files/domain/models/FileMother'
import { FileTitle } from '../../../../../../../../src/sections/dataset/dataset-files/files-table/file-info-cell/file-title/FileTitle'

describe('FileTitle', () => {
  it('renders the link and name correctly', () => {
    const id = '12345'
    const versionParameter = '&version=1.0'
    const name = 'file-name.txt'
    const file = FileMother.create({
      id: id,
      version: { majorNumber: 1, minorNumber: 0 },
      name: name
    })

    cy.customMount(<FileTitle link={file.getLink()} name={file.name} />)

    cy.findByRole('link', { name: name }).should(
      'have.attr',
      'href',
      `/file?id=${id}${versionParameter}`
    )
  })
})
