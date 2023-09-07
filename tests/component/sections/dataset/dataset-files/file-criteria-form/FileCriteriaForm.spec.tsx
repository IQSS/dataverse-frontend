import { FileCriteriaForm } from '../../../../../../src/sections/dataset/dataset-files/file-criteria-form/FileCriteriaForm'
import {
  FileAccessOption,
  FileCriteria,
  FileSortByOption,
  FileTag
} from '../../../../../../src/files/domain/models/FileCriteria'
import { FilesCountInfoMother } from '../../../../files/domain/models/FilesCountInfoMother'
import { FileType } from '../../../../../../src/files/domain/models/File'
import { UserMother } from '../../../../users/domain/models/UserMother'
import { UserRepository } from '../../../../../../src/users/domain/repositories/UserRepository'
import { SessionProvider } from '../../../../../../src/sections/session/SessionProvider'

let onCriteriaChange = () => {}
const filesCountInfo = FilesCountInfoMother.create({
  perFileType: [
    {
      type: new FileType('image'),
      count: 5
    },
    {
      type: new FileType('text'),
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
      tag: new FileType('data'),
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
    cy.findByRole('button', { name: 'Filter Type: All' }).should('not.exist')
    cy.findByRole('button', { name: 'Access: All' }).should('not.exist')
    cy.findByRole('button', { name: 'Filter Tag: All' }).should('not.exist')
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

    cy.findByRole('button', { name: 'Filter Type: All' }).should('exist')
    cy.findByRole('button', { name: 'Access: All' }).should('exist')
    cy.findByRole('button', { name: 'Filter Tag: All' }).should('exist')
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
      .withFilterByType('image')
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

    cy.findByRole('button', { name: 'Filter Type: Image' }).should('exist')
    cy.findByRole('button', { name: 'Access: Public' }).should('exist')
    cy.findByRole('button', { name: 'Filter Tag: Document' }).should('exist')
    cy.findByLabelText('Search').should('have.value', 'search text')
  })

  it('saves global criteria when the filter by type option changes', () => {
    const onCriteriaChange = cy.stub().as('onCriteriaChange')
    const criteria = new FileCriteria()
      .withFilterByTag('document')
      .withFilterByAccess(FileAccessOption.PUBLIC)
      .withFilterByType('image')
      .withSearchText('search text')

    cy.customMount(
      <FileCriteriaForm
        criteria={criteria}
        onCriteriaChange={onCriteriaChange}
        filesCountInfo={filesCountInfo}
      />
    )

    cy.findByRole('button', { name: 'Filter Type: Image' }).click()
    cy.findByText('Text (10)').click()

    cy.wrap(onCriteriaChange).should('be.calledWith', criteria.withFilterByType('text'))

    cy.findByRole('button', { name: 'Filter Type: Text' }).should('exist')
    cy.findByRole('button', { name: 'Access: Public' }).should('exist')
    cy.findByRole('button', { name: 'Filter Tag: Document' }).should('exist')
    cy.findByLabelText('Search').should('have.value', 'search text')
  })

  it('saves global criteria when the filter by access option changes', () => {
    const onCriteriaChange = cy.stub().as('onCriteriaChange')
    const criteria = new FileCriteria()
      .withFilterByTag('document')
      .withFilterByAccess(FileAccessOption.PUBLIC)
      .withFilterByType('image')
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

    cy.findByRole('button', { name: 'Filter Type: Image' }).should('exist')
    cy.findByRole('button', { name: 'Access: Restricted' }).should('exist')
    cy.findByRole('button', { name: 'Filter Tag: Document' }).should('exist')
    cy.findByLabelText('Search').should('have.value', 'search text')
  })

  it('saves global criteria when the filter by tag option changes', () => {
    const onCriteriaChange = cy.stub().as('onCriteriaChange')
    const criteria = new FileCriteria()
      .withFilterByTag('document')
      .withFilterByAccess(FileAccessOption.PUBLIC)
      .withFilterByType('image')
      .withSearchText('search text')

    cy.customMount(
      <FileCriteriaForm
        criteria={criteria}
        onCriteriaChange={onCriteriaChange}
        filesCountInfo={filesCountInfo}
      />
    )

    cy.findByRole('button', { name: 'Filter Tag: Document' }).click()
    cy.findByText('Data (10)').click()

    cy.wrap(onCriteriaChange).should('be.calledWith', criteria.withFilterByTag('data'))

    cy.findByRole('button', { name: 'Filter Type: Image' }).should('exist')
    cy.findByRole('button', { name: 'Access: Public' }).should('exist')
    cy.findByRole('button', { name: 'Filter Tag: Data' }).should('exist')
    cy.findByLabelText('Search').should('have.value', 'search text')
  })

  it('saves global criteria when the search input changes', () => {
    const onCriteriaChange = cy.stub().as('onCriteriaChange')
    const criteria = new FileCriteria()
      .withFilterByTag('document')
      .withFilterByAccess(FileAccessOption.PUBLIC)
      .withFilterByType('image')
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

    cy.findByRole('button', { name: 'Filter Type: Image' }).should('exist')
    cy.findByRole('button', { name: 'Access: Public' }).should('exist')
    cy.findByRole('button', { name: 'Filter Tag: Document' }).should('exist')
    cy.findByLabelText('Search').should('have.value', 'new search')
  })

  it('renders the Upload Files button', () => {
    const user = UserMother.create()
    const userRepository = {} as UserRepository
    userRepository.getAuthenticated = cy.stub().resolves(user)
    userRepository.removeAuthenticated = cy.stub().resolves()

    cy.customMount(
      <SessionProvider repository={userRepository}>
        <FileCriteriaForm
          criteria={new FileCriteria()}
          onCriteriaChange={onCriteriaChange}
          filesCountInfo={filesCountInfo}
        />
      </SessionProvider>
    )

    cy.findByRole('button', { name: 'Upload Files' }).should('exist')
  })
})
