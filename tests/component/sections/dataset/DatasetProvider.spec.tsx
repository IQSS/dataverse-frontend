import { DatasetProvider } from '../../../../src/sections/dataset/DatasetProvider'
import { Dataset } from '../../../../src/dataset/domain/models/Dataset'
import { DatasetRepository } from '../../../../src/dataset/domain/repositories/DatasetRepository'
import { DatasetMother, DatasetVersionMother } from '../../dataset/domain/models/DatasetMother'
import { useDataset } from '../../../../src/sections/dataset/DatasetContext'
import { LoadingProvider } from '../../../../src/shared/contexts/loading/LoadingProvider'
import { useState } from 'react'
import { AuthContext, IAuthContext } from 'react-oauth2-code-pkce'
import { ReadError } from '@iqss/dataverse-client-javascript'
import { Alert, AlertMessageKey } from '@/alert/domain/models/Alert'
import { DatasetNonNumericVersion } from '@/dataset/domain/models/Dataset'
import { encodeReturnToPathInStateQueryParam } from '@/sections/auth-callback/AuthCallback'

function TestComponent() {
  const { dataset, isLoading, isNotAuthorized } = useDataset()

  return (
    <div>
      {dataset ? <span>{dataset.version.title}</span> : <span>Dataset Not Found</span>}
      {isLoading && <div>Loading...</div>}
      {isNotAuthorized && <div>Not Authorized</div>}
    </div>
  )
}

const datasetRepository: DatasetRepository = {} as DatasetRepository
const dataset = DatasetMother.create()

describe('DatasetProvider', () => {
  beforeEach(() => {
    datasetRepository.getByPersistentId = cy
      .stub()
      .resolves(Cypress.Promise.resolve(dataset).delay(1000))
    datasetRepository.getByPrivateUrlToken = cy.stub().resolves(dataset)
  })

  it('gets the dataset by persistentId', () => {
    cy.customMount(
      <LoadingProvider>
        <DatasetProvider
          repository={datasetRepository}
          searchParams={{ persistentId: dataset.persistentId }}>
          <TestComponent />
        </DatasetProvider>
      </LoadingProvider>
    )

    cy.findByText('Loading...').should('exist')
    cy.wrap(datasetRepository.getByPersistentId).should('be.calledOnceWith', dataset.persistentId)
    cy.findByText(dataset.version.title).should('exist')
    cy.findByText('Loading...').should('not.exist')
  })

  it('gets the draft dataset by persistentId when no version param is provided', () => {
    const draftDataset: Dataset = DatasetMother.create({
      version: DatasetVersionMother.createDraft()
    })
    const getByPersistentIdStub = cy
      .stub()
      .resolves(
        Cypress.Promise.resolve(draftDataset).delay(1000)
      ) as unknown as typeof datasetRepository.getByPersistentId
    datasetRepository.getByPersistentId = getByPersistentIdStub

    cy.customMount(
      <LoadingProvider>
        <DatasetProvider
          repository={datasetRepository}
          searchParams={{ persistentId: draftDataset.persistentId }}>
          <TestComponent />
        </DatasetProvider>
      </LoadingProvider>
    )

    cy.findByText('Loading...').should('exist')
    cy.wrap(datasetRepository.getByPersistentId).should(
      'be.calledOnceWith',
      draftDataset.persistentId,
      undefined
    )
    cy.findByText(draftDataset.version.title).should('exist')
    cy.findByText('Loading...').should('not.exist')
  })

  it('gets the dataset by persistentId and version', () => {
    cy.customMount(
      <LoadingProvider>
        <DatasetProvider
          repository={datasetRepository}
          searchParams={{ persistentId: dataset.persistentId, version: 'draft' }}>
          <TestComponent />
        </DatasetProvider>
      </LoadingProvider>
    )

    cy.findByText('Loading...').should('exist')
    cy.wrap(datasetRepository.getByPersistentId).should(
      'be.calledOnceWith',
      dataset.persistentId,
      'draft'
    )
    cy.findByText(dataset.version.title).should('exist')
    cy.findByText('Loading...').should('not.exist')
  })

  it('gets the dataset by privateUrlToken', () => {
    cy.customMount(
      <LoadingProvider>
        <DatasetProvider
          repository={datasetRepository}
          searchParams={{ privateUrlToken: 'some-private-url-token' }}>
          <TestComponent />
        </DatasetProvider>
      </LoadingProvider>
    )

    cy.findByText('Loading...').should('exist')
    cy.wrap(datasetRepository.getByPrivateUrlToken).should(
      'be.calledOnce',
      'some-private-url-token'
    )
    cy.findByText(dataset.version.title).should('exist')
    cy.findByText('Loading...').should('not.exist')
  })

  it('stops loading if searchParams not passed', () => {
    cy.customMount(
      <LoadingProvider>
        <DatasetProvider repository={datasetRepository} searchParams={{}}>
          <TestComponent />
        </DatasetProvider>
      </LoadingProvider>
    )

    cy.findByText('Loading...').should('exist')
    cy.findByText('Dataset Not Found').should('exist')
    cy.findByText('Loading...').should('not.exist')
  })

  it('stops loading if error happens', () => {
    cy.stub(console, 'error').as('consoleError')
    datasetRepository.getByPersistentId = cy.stub().rejects(new Error('some error'))
    cy.customMount(
      <LoadingProvider>
        <DatasetProvider
          repository={datasetRepository}
          searchParams={{ persistentId: dataset.persistentId }}>
          <TestComponent />
        </DatasetProvider>
      </LoadingProvider>
    )

    cy.findByText('Loading...').should('exist')
    cy.wrap(datasetRepository.getByPersistentId).should('have.been.calledOnce')
    cy.get('@consoleError').should(
      'have.been.calledWithMatch',
      'There was an error getting the dataset'
    )
    cy.findByText('Dataset Not Found').should('exist')
    cy.findByText('Loading...').should('not.exist')
  })

  it('does not fetch the dataset while publishing', () => {
    cy.customMount(
      <LoadingProvider>
        <DatasetProvider
          repository={datasetRepository}
          searchParams={{ persistentId: dataset.persistentId }}
          isPublishing>
          <TestComponent />
        </DatasetProvider>
      </LoadingProvider>
    )

    cy.wrap(datasetRepository.getByPersistentId).should('not.have.been.called')
    cy.wrap(datasetRepository.getByPrivateUrlToken).should('not.have.been.called')
    cy.findByText('Loading...').should('exist')
    cy.findByText('Dataset Not Found').should('exist')
  })
})

describe('DatasetProvider draft access', () => {
  const DRAFT_PATH = `/datasets?persistentId=${dataset.persistentId}&version=DRAFT`

  const authContextValue = (overrides: Partial<IAuthContext> = {}): IAuthContext => ({
    token: '',
    idToken: undefined,
    logIn: cy.stub().as('logIn'),
    logOut: () => {},
    loginInProgress: false,
    tokenData: undefined,
    idTokenData: undefined,
    error: null,
    login: () => {},
    ...overrides
  })
  const anonymous = () => authContextValue()
  const loggedIn = () => authContextValue({ token: 'some-token' })

  const mountDraftRequest = (
    auth: IAuthContext,
    version: string = DatasetNonNumericVersion.DRAFT
  ) => {
    cy.customMount(
      <AuthContext.Provider value={auth}>
        <LoadingProvider>
          <DatasetProvider
            repository={datasetRepository}
            searchParams={{ persistentId: dataset.persistentId, version }}>
            <TestComponent />
          </DatasetProvider>
        </LoadingProvider>
      </AuthContext.Provider>,
      [DRAFT_PATH]
    )
  }

  const rejectWith = (statusCode: number) => {
    datasetRepository.getByPersistentId = cy
      .stub()
      .rejects(new ReadError(`[${statusCode}] some reason`))
  }

  const resolveWithPublishedFallback = () => {
    const published = DatasetMother.create()
    published.alerts.push(new Alert('danger', AlertMessageKey.NOT_AUTHORIZED))
    datasetRepository.getByPersistentId = cy.stub().resolves(published)
    return published
  }

  beforeEach(() => {
    cy.stub(console, 'error')
  })

  it('shows the draft when the draft request succeeds', () => {
    datasetRepository.getByPersistentId = cy.stub().resolves(dataset)
    mountDraftRequest(anonymous())

    cy.findByText(dataset.version.title).should('exist')
    cy.get('@logIn').should('not.have.been.called')
    cy.findByText('Not Authorized').should('not.exist')
  })

  it('redirects an anonymous user to login with the return URL when the draft-only dataset is not authorized', () => {
    rejectWith(401)
    mountDraftRequest(anonymous())

    cy.get('@logIn').should(
      'have.been.calledOnceWith',
      encodeReturnToPathInStateQueryParam(DRAFT_PATH)
    )
    cy.findByText('Loading...').should('exist')
    cy.findByText('Not Authorized').should('not.exist')
  })

  it('redirects an anonymous user to login instead of showing the published fallback', () => {
    const published = resolveWithPublishedFallback()
    mountDraftRequest(anonymous())

    cy.get('@logIn').should(
      'have.been.calledOnceWith',
      encodeReturnToPathInStateQueryParam(DRAFT_PATH)
    )
    cy.findByText(published.version.title).should('not.exist')
    cy.findByText('Loading...').should('exist')
  })

  it('keeps loading without showing Not Authorized while a login redirect is already in progress', () => {
    rejectWith(401)
    mountDraftRequest(authContextValue({ loginInProgress: true }))

    cy.wrap(datasetRepository.getByPersistentId).should('have.been.called')
    cy.get('@logIn').should('not.have.been.called')
    cy.findByText('Loading...').should('exist')
    cy.findByText('Not Authorized').should('not.exist')
  })

  it('shows Not Authorized to a logged in user when the draft-only dataset is not authorized', () => {
    rejectWith(403)
    mountDraftRequest(loggedIn())

    cy.findByText('Not Authorized').should('exist')
    cy.findByText('Loading...').should('not.exist')
    cy.get('@logIn').should('not.have.been.called')
  })

  it('shows the published fallback to a logged in user when the draft is not authorized', () => {
    const published = resolveWithPublishedFallback()
    mountDraftRequest(loggedIn())

    cy.findByText(published.version.title).should('exist')
    cy.get('@logIn').should('not.have.been.called')
  })

  it('does not label a missing dataset as Not Authorized', () => {
    rejectWith(404)
    mountDraftRequest(loggedIn())

    cy.findByText('Dataset Not Found').should('exist')
    cy.findByText('Loading...').should('not.exist')
    cy.findByText('Not Authorized').should('not.exist')
  })

  it('does not label a server or network error as Not Authorized', () => {
    datasetRepository.getByPersistentId = cy.stub().rejects(new Error('Network Error'))
    mountDraftRequest(loggedIn())

    cy.findByText('Dataset Not Found').should('exist')
    cy.findByText('Not Authorized').should('not.exist')
    cy.get('@logIn').should('not.have.been.called')
  })

  it('does not redirect or show Not Authorized when a non-draft version is not authorized', () => {
    rejectWith(401)
    mountDraftRequest(anonymous(), '1.0')

    cy.findByText('Dataset Not Found').should('exist')
    cy.findByText('Not Authorized').should('not.exist')
    cy.get('@logIn').should('not.have.been.called')
  })

  it('does not refetch the dataset when the auth state changes', () => {
    datasetRepository.getByPersistentId = cy.stub().resolves(dataset)
    const logIn = cy.stub()

    function AuthStateToggle() {
      const [token, setToken] = useState('')
      return (
        <AuthContext.Provider value={{ ...authContextValue({ logIn }), token }}>
          <button onClick={() => setToken('some-token')}>Log in</button>
          <LoadingProvider>
            <DatasetProvider
              repository={datasetRepository}
              searchParams={{
                persistentId: dataset.persistentId,
                version: DatasetNonNumericVersion.DRAFT
              }}>
              <TestComponent />
            </DatasetProvider>
          </LoadingProvider>
        </AuthContext.Provider>
      )
    }
    cy.customMount(<AuthStateToggle />, [DRAFT_PATH])

    cy.findByText(dataset.version.title).should('exist')
    cy.findByRole('button', { name: 'Log in' }).click()
    cy.findByText(dataset.version.title).should('exist')
    cy.wrap(datasetRepository.getByPersistentId).should('have.been.calledOnce')
  })
})
