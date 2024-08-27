import { FileTitle } from '../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-info/file-info-cell/file-info-data/FileTitle'
import { DatasetVersionMother } from '../../../../../../../dataset/domain/models/DatasetMother'

describe('FileTitle', () => {
  it('renders the link and name correctly', () => {
    const id = 12345
    const name = 'file-name.txt'

    cy.customMount(
      <FileTitle datasetVersionNumber={DatasetVersionMother.create().number} id={id} name={name} />
    )

    cy.findByRole('link', { name: name }).should(
      'have.attr',
      'href',
      `/files?id=${id}&datasetVersion=${DatasetVersionMother.create().number.toSearchParam()}`
    )
  })
})
