import { ReadError } from '@iqss/dataverse-client-javascript'
import { DatasetJSDataverseRepository } from '@/dataset/infrastructure/repositories/DatasetJSDataverseRepository'
import { Dataset, DatasetNonNumericVersion } from '@/dataset/domain/models/Dataset'
import { AlertMessageKey } from '@/alert/domain/models/Alert'
import { DatasetMother } from '../../domain/models/DatasetMother'

const PERSISTENT_ID = 'doi:10.5072/FK2/TEST'
const { DRAFT, LATEST_PUBLISHED } = DatasetNonNumericVersion

const readError = (statusCode: number) => new ReadError(`[${statusCode}] some reason`)

// Stubs the single-version fetch so each test controls what every attempt returns
function stubFetchByPersistentId(
  repository: DatasetJSDataverseRepository,
  ...results: (Dataset | Error)[]
) {
  const stub = cy.stub()
  results.forEach((result, index) => {
    if (result instanceof Error) stub.onCall(index).rejects(result)
    else stub.onCall(index).resolves(result)
  })
  ;(repository as unknown as { fetchByPersistentId: typeof stub }).fetchByPersistentId = stub
  return stub
}

const hasNotAuthorizedAlert = (dataset: Dataset | undefined) =>
  dataset?.alerts.some((alert) => alert.messageKey === AlertMessageKey.NOT_AUTHORIZED)

const expectRejection = (promise: Promise<unknown>) =>
  cy.wrap(
    promise.then(
      () => {
        throw new Error('Expected the promise to reject')
      },
      (error: unknown) => error
    )
  )

describe('DatasetJSDataverseRepository getByPersistentId fallbacks', () => {
  let repository: DatasetJSDataverseRepository

  beforeEach(() => {
    repository = new DatasetJSDataverseRepository()
  })

  it('returns the draft when the draft request succeeds', () => {
    const draft = DatasetMother.create()
    const fetchStub = stubFetchByPersistentId(repository, draft)

    cy.wrap(repository.getByPersistentId(PERSISTENT_ID, DRAFT, undefined, true)).should(
      'equal',
      draft
    )
    cy.wrap(fetchStub).should('have.been.calledOnceWith', PERSISTENT_ID, DRAFT, undefined, true)
  })

  it('falls back to the published version and flags NOT_AUTHORIZED when the draft is 401', () => {
    const published = DatasetMother.create()
    const fetchStub = stubFetchByPersistentId(repository, readError(401), published)

    cy.wrap(repository.getByPersistentId(PERSISTENT_ID, DRAFT, undefined, true)).then((dataset) => {
      expect(dataset).to.equal(published)
      expect(hasNotAuthorizedAlert(dataset as Dataset)).to.equal(true)
    })
    cy.wrap(fetchStub).should('have.been.calledTwice')
    cy.wrap(fetchStub).should('have.been.calledWith', PERSISTENT_ID, LATEST_PUBLISHED, DRAFT, true)
  })

  it('falls back to the published version and flags NOT_AUTHORIZED when the draft is 403', () => {
    const published = DatasetMother.create()
    stubFetchByPersistentId(repository, readError(403), published)

    cy.wrap(repository.getByPersistentId(PERSISTENT_ID, DRAFT)).then((dataset) => {
      expect(dataset).to.equal(published)
      expect(hasNotAuthorizedAlert(dataset as Dataset)).to.equal(true)
    })
  })

  it('falls back to the published version without NOT_AUTHORIZED when the draft is missing', () => {
    const published = DatasetMother.create()
    const fetchStub = stubFetchByPersistentId(repository, readError(404), published)

    cy.wrap(repository.getByPersistentId(PERSISTENT_ID, DRAFT)).then((dataset) => {
      expect(dataset).to.equal(published)
      expect(hasNotAuthorizedAlert(dataset as Dataset)).to.equal(false)
    })
    // The requested draft is passed on so the version-not-found alert is generated
    cy.wrap(fetchStub).should('have.been.calledWith', PERSISTENT_ID, LATEST_PUBLISHED, DRAFT)
  })

  it('does not flag NOT_AUTHORIZED when the draft fails with a server error', () => {
    const published = DatasetMother.create()
    stubFetchByPersistentId(repository, readError(500), published)

    cy.wrap(repository.getByPersistentId(PERSISTENT_ID, DRAFT)).then((dataset) => {
      expect(hasNotAuthorizedAlert(dataset as Dataset)).to.equal(false)
    })
  })

  it('settles after two attempts with the draft error when draft and published both reject', () => {
    const draftError = readError(401)
    const fetchStub = stubFetchByPersistentId(repository, draftError, readError(404))

    expectRejection(repository.getByPersistentId(PERSISTENT_ID, DRAFT)).should('equal', draftError)
    cy.wrap(fetchStub).should('have.been.calledTwice')
  })

  it('falls back to the draft without a requested version when nothing is published', () => {
    const draft = DatasetMother.create()
    const fetchStub = stubFetchByPersistentId(repository, readError(404), draft)

    cy.wrap(repository.getByPersistentId(PERSISTENT_ID)).should('equal', draft)
    cy.wrap(fetchStub).should('have.been.calledTwice')
    // No requested version, so no "version :latest-published was not found" alert
    cy.wrap(fetchStub).should('have.been.calledWith', PERSISTENT_ID, DRAFT, undefined)
  })

  it('settles after two attempts when neither the published version nor the draft load', () => {
    const draftError = readError(401)
    const fetchStub = stubFetchByPersistentId(repository, readError(404), draftError)

    expectRejection(repository.getByPersistentId(PERSISTENT_ID)).should('equal', draftError)
    cy.wrap(fetchStub).should('have.been.calledTwice')
  })

  it('falls back to the published version when a numbered version is not found', () => {
    const published = DatasetMother.create()
    const fetchStub = stubFetchByPersistentId(repository, readError(404), published)

    cy.wrap(repository.getByPersistentId(PERSISTENT_ID, '2.0')).should('equal', published)
    cy.wrap(fetchStub).should('have.been.calledWith', PERSISTENT_ID, LATEST_PUBLISHED, '2.0')
  })

  it('does not retry when the published version fails for an already requested version', () => {
    const error = readError(404)
    const fetchStub = stubFetchByPersistentId(repository, error)

    expectRejection(repository.getByPersistentId(PERSISTENT_ID, LATEST_PUBLISHED, '2.0')).should(
      'equal',
      error
    )
    cy.wrap(fetchStub).should('have.been.calledOnce')
  })
})
