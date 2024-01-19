import { FileCriteriaForm } from '../../../../../../src/sections/dataset/dataset-files/file-criteria-form/FileCriteriaForm'
import {
  FileAccessOption,
  FileCriteria,
  FileSortByOption,
  FileTag
} from '../../../../../../src/files/domain/models/FileCriteria'
import { FilesCountInfoMother } from '../../../../files/domain/models/FilesCountInfoMother'
import { FileType } from '../../../../../../src/files/domain/models/FilePreview'
import { DatasetRepository } from '../../../../../../src/dataset/domain/repositories/DatasetRepository'
import {
  DatasetMother,
  DatasetPermissionsMother
} from '../../../../dataset/domain/models/DatasetMother'
import { DatasetProvider } from '../../../../../../src/sections/dataset/DatasetProvider'

let onCriteriaChange = () => {}
const filesCountInfo = FilesCountInfoMother.create({
  perFileType: [
    {
      type: new FileType('image/png'),
      count: 5
    },
    {
      type: new FileType('text/plain'),
      count: 10
    }
  ],
  perAccess: [
    {
      access: FileAccessOption.PUBLIC,
      count: 5
    },
    {
      access: FileAccessOption.RESTRICTED,
      count: 10
    }
  ],
  perFileTag: [
    {
      tag: new FileTag('document'),
      count: 5
    },
    {
      tag: new FileTag('data'),
      count: 10
    }
  ]
})
describe('FileCriteriaForm', () => {
  beforeEach(() => {
    onCriteriaChange = cy.stub().as('onCriteriaChange')
  })

  it('does not render the files criteria inputs when there are less than 2 files', () => {
    cy.customMount(
      <FileCriteriaForm
        criteria={new FileCriteria()}
        onCriteriaChange={onCriteriaChange}
        filesCountInfo={FilesCountInfoMother.create({ total: 1 })}
      />
    )

    cy.findByRole('button', { name: /Sort/ }).should('not.exist')
    cy.findByRole('button', { name: 'File Type: All' }).should('not.exist')
    cy.findByRole('button', { name: 'Access: All' }).should('not.exist')
    cy.findByRole('button', { name: 'File Tags: All' }).should('not.exist')
    cy.findByLabelText('Search').should('not.exist')
  })

  it('renders the SortBy input', () => {
    cy.customMount(
      <FileCriteriaForm
        criteria={new FileCriteria()}
        onCriteriaChange={onCriteriaChange}
        filesCountInfo={FilesCountInfoMother.create()}
      />
    )

    cy.findByRole('button', { name: /Sort/ }).should('exist')
  })

  it('renders the Filters input', () => {
    cy.customMount(
      <FileCriteriaForm
        criteria={new FileCriteria()}
        onCriteriaChange={onCriteriaChange}
        filesCountInfo={filesCountInfo}
      />
    )

    cy.findByRole('button', { name: 'File Type: All' }).should('exist')
    cy.findByRole('button', { name: 'Access: All' }).should('exist')
    cy.findByRole('button', { name: 'File Tags: All' }).should('exist')
    cy.findByText('Filter by').should('exist')
  })

  it('renders the Search input', () => {
    cy.customMount(
      <FileCriteriaForm
        criteria={new FileCriteria()}
        onCriteriaChange={onCriteriaChange}
        filesCountInfo={filesCountInfo}
      />
    )

    cy.findByLabelText('Search').should('exist')
  })

  it('saves global criteria when the sort by option changes', () => {
    const onCriteriaChange = cy.stub().as('onCriteriaChange')
    const criteria = new FileCriteria()
      .withFilterByTag('document')
      .withFilterByAccess(FileAccessOption.PUBLIC)
      .withFilterByType('image/png')
      .withSearchText('search text')

    cy.customMount(
      <FileCriteriaForm
        criteria={criteria}
        onCriteriaChange={onCriteriaChange}
        filesCountInfo={filesCountInfo}
      />
    )

    cy.findByRole('button', { name: /Sort/ }).click()
    cy.findByText('Oldest').click()

    cy.wrap(onCriteriaChange).should('be.calledWith', criteria.withSortBy(FileSortByOption.OLDEST))

    cy.findByRole('button', { name: 'File Type: PNG Image' }).should('exist')
    cy.findByRole('button', { name: 'Access: Public' }).should('exist')
    cy.findByRole('button', { name: 'File Tags: Document' }).should('exist')
    cy.findByLabelText('Search').should('have.value', 'search text')
  })

  it('saves global criteria when the filter by type option changes', () => {
    const onCriteriaChange = cy.stub().as('onCriteriaChange')
    const criteria = new FileCriteria()
      .withFilterByTag('document')
      .withFilterByAccess(FileAccessOption.PUBLIC)
      .withFilterByType('image/png')
      .withSearchText('search text')

    cy.customMount(
      <FileCriteriaForm
        criteria={criteria}
        onCriteriaChange={onCriteriaChange}
        filesCountInfo={filesCountInfo}
      />
    )

    cy.findByRole('button', { name: 'File Type: PNG Image' }).click()
    cy.findByText('Plain Text (10)').click()

    cy.wrap(onCriteriaChange).should('be.calledWith', criteria.withFilterByType('text/plain'))

    cy.findByRole('button', { name: 'File Type: Plain Text' }).should('exist')
    cy.findByRole('button', { name: 'Access: Public' }).should('exist')
    cy.findByRole('button', { name: 'File Tags: Document' }).should('exist')
    cy.findByLabelText('Search').should('have.value', 'search text')
  })

  it('saves global criteria when the filter by access option changes', () => {
    const onCriteriaChange = cy.stub().as('onCriteriaChange')
    const criteria = new FileCriteria()
      .withFilterByTag('document')
      .withFilterByAccess(FileAccessOption.PUBLIC)
      .withFilterByType('image/png')
      .withSearchText('search text')

    cy.customMount(
      <FileCriteriaForm
        criteria={criteria}
        onCriteriaChange={onCriteriaChange}
        filesCountInfo={filesCountInfo}
      />
    )

    cy.findByRole('button', { name: 'Access: Public' }).click()
    cy.findByText('Restricted (10)').click()

    cy.wrap(onCriteriaChange).should(
      'be.calledWith',
      criteria.withFilterByAccess(FileAccessOption.RESTRICTED)
    )

    cy.findByRole('button', { name: 'File Type: PNG Image' }).should('exist')
    cy.findByRole('button', { name: 'Access: Restricted' }).should('exist')
    cy.findByRole('button', { name: 'File Tags: Document' }).should('exist')
    cy.findByLabelText('Search').should('have.value', 'search text')
  })

  it('saves global criteria when the filter by tag option changes', () => {
    const onCriteriaChange = cy.stub().as('onCriteriaChange')
    const criteria = new FileCriteria()
      .withFilterByTag('document')
      .withFilterByAccess(FileAccessOption.PUBLIC)
      .withFilterByType('image/png')
      .withSearchText('search text')

    cy.customMount(
      <FileCriteriaForm
        criteria={criteria}
        onCriteriaChange={onCriteriaChange}
        filesCountInfo={filesCountInfo}
      />
    )

    cy.findByRole('button', { name: 'File Tags: Document' }).click()
    cy.findByText('Data (10)').click()

    cy.wrap(onCriteriaChange).should('be.calledWith', criteria.withFilterByTag('data'))

    cy.findByRole('button', { name: 'File Type: PNG Image' }).should('exist')
    cy.findByRole('button', { name: 'Access: Public' }).should('exist')
    cy.findByRole('button', { name: 'File Tags: Data' }).should('exist')
    cy.findByLabelText('Search').should('have.value', 'search text')
  })

  it('saves global criteria when the search input changes', () => {
    const onCriteriaChange = cy.stub().as('onCriteriaChange')
    const criteria = new FileCriteria()
      .withFilterByTag('document')
      .withFilterByAccess(FileAccessOption.PUBLIC)
      .withFilterByType('image/png')
      .withSearchText('search text')

    cy.customMount(
      <FileCriteriaForm
        criteria={criteria}
        onCriteriaChange={onCriteriaChange}
        filesCountInfo={filesCountInfo}
      />
    )

    cy.findByLabelText('Search').clear().type('new search{enter}')

    cy.wrap(onCriteriaChange).should('be.calledWith', criteria.withSearchText('new search'))

    cy.findByRole('button', { name: 'File Type: PNG Image' }).should('exist')
    cy.findByRole('button', { name: 'Access: Public' }).should('exist')
    cy.findByRole('button', { name: 'File Tags: Document' }).should('exist')
    cy.findByLabelText('Search').should('have.value', 'new search')
  })

  it('renders the Upload Files button', () => {
    const datasetRepository: DatasetRepository = {} as DatasetRepository
    const datasetWithUpdatePermissions = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithUpdateDatasetAllowed()
    })
    datasetRepository.getByPersistentId = cy.stub().resolves(datasetWithUpdatePermissions)
    datasetRepository.getByPrivateUrlToken = cy.stub().resolves(datasetWithUpdatePermissions)

    cy.mountAuthenticated(
      <DatasetProvider
        repository={datasetRepository}
        searchParams={{ persistentId: 'some-persistent-id', version: 'some-version' }}>
        <FileCriteriaForm
          criteria={new FileCriteria()}
          onCriteriaChange={onCriteriaChange}
          filesCountInfo={filesCountInfo}
        />
      </DatasetProvider>
    )

    cy.findByRole('button', { name: 'Upload Files' }).should('exist')
  })

  it('does not reload the page when the search button is clicked', () => {
    const onCriteriaChange = cy.stub().as('onCriteriaChange')
    const criteria = new FileCriteria()
      .withFilterByTag('document')
      .withFilterByAccess(FileAccessOption.PUBLIC)
      .withFilterByType('image/png')

    cy.customMount(
      <FileCriteriaForm
        criteria={criteria}
        onCriteriaChange={onCriteriaChange}
        filesCountInfo={filesCountInfo}
      />
    )

    cy.findByLabelText('Search').type('test')
    cy.findByRole('button', { name: 'Submit search' }).click()

    cy.wrap(onCriteriaChange).should('be.calledWith', criteria.withSearchText('test'))

    cy.findByLabelText('Search').should('have.value', 'test')
  })

  it('renders the file criteria if there are less than 2 files but there is a filter applied', () => {
    const criteria = new FileCriteria()
      .withFilterByTag('document')
      .withFilterByAccess(FileAccessOption.PUBLIC)
      .withFilterByType('image/png')

    cy.customMount(
      <FileCriteriaForm
        criteria={criteria}
        onCriteriaChange={onCriteriaChange}
        filesCountInfo={FilesCountInfoMother.create({ total: 1 })}
      />
    )

    cy.findByRole('button', { name: 'File Type: PNG Image' }).should('exist')
    cy.findByRole('button', { name: 'Access: Public' }).should('exist')
    cy.findByRole('button', { name: 'File Tags: Document' }).should('exist')
  })
})
