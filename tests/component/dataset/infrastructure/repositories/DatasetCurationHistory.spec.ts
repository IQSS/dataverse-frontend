import { ApiConfig, getDatasetCurationStatusHistory } from '@iqss/dataverse-client-javascript'
import { DatasetJSDataverseRepository } from '@/dataset/infrastructure/repositories/DatasetJSDataverseRepository'

const datasetId = 'doi:10.5072/FK2/TEST'
const adminStatus = {
  label: 'Privacy Review',
  createTime: 'Tue Nov 10 19:12:33 UTC 2026',
  assigner: '@dataverseAdmin'
}

describe('curation history assigner names', () => {
  const repository = new DatasetJSDataverseRepository()
  let originalApiUrl: string

  beforeEach(() => {
    originalApiUrl = ApiConfig.dataverseApiUrl
    ApiConfig.dataverseApiUrl = 'https://dataverse.example/api/v1'
  })

  afterEach(() => {
    ApiConfig.dataverseApiUrl = originalApiUrl
  })

  it('resolves each distinct assigner once and preserves order, removals, and timestamps', () => {
    const history = [adminStatus, { ...adminStatus, label: undefined }, { label: 'Final Approval' }]
    const historyStub = cy.stub(getDatasetCurationStatusHistory, 'execute').resolves(history)
    const fetchStub = cy.stub(window, 'fetch').resolves(
      new Response(
        JSON.stringify({
          status: 'OK',
          data: { title: 'Dataverse Admin' }
        }),
        { status: 200 }
      )
    )

    cy.wrap(repository.getCurationStatusHistory(datasetId)).then((result) => {
      expect(result).to.deep.equal([
        { ...adminStatus, assignerDisplayName: 'Dataverse Admin' },
        { ...adminStatus, label: undefined, assignerDisplayName: 'Dataverse Admin' },
        { label: 'Final Approval', assignerDisplayName: undefined }
      ])
      expect(history[0]).not.to.have.property('assignerDisplayName')
      expect(fetchStub).to.have.been.calledOnceWith(
        'https://dataverse.example/api/v1/admin/assignee/%40dataverseAdmin'
      )
      expect(historyStub).to.have.been.calledWith(datasetId)
    })
  })

  for (const failure of ['http', 'network', 'missing name', 'invalid JSON']) {
    it(`preserves the assigner ID and history when the lookup fails: ${failure}`, () => {
      cy.stub(getDatasetCurationStatusHistory, 'execute').resolves([adminStatus])
      const fetchStub = cy.stub(window, 'fetch')
      if (failure === 'network') fetchStub.rejects(new Error('Offline'))
      else if (failure === 'http') fetchStub.resolves(new Response('', { status: 403 }))
      else fetchStub.resolves(new Response(failure === 'invalid JSON' ? 'invalid' : '{"data":{}}'))

      cy.wrap(repository.getCurationStatusHistory(datasetId)).should('deep.equal', [
        { ...adminStatus, assignerDisplayName: undefined }
      ])
    })
  }

  it('does not look up users for empty history', () => {
    cy.stub(getDatasetCurationStatusHistory, 'execute').resolves([])
    const fetchStub = cy.stub(window, 'fetch')
    cy.wrap(repository.getCurationStatusHistory(datasetId))
      .should('deep.equal', [])
      .then(() => {
        expect(fetchStub).not.to.have.been.called
      })
  })

  it('propagates history errors without making name requests', () => {
    const failure = new Error('History forbidden')
    cy.stub(getDatasetCurationStatusHistory, 'execute').rejects(failure)
    const fetchStub = cy.stub(window, 'fetch')
    cy.wrap(
      repository.getCurationStatusHistory(datasetId).then(
        () => {
          throw new Error('Expected history request to fail')
        },
        (error: unknown) => error
      )
    )
      .should('equal', failure)
      .then(() => {
        expect(fetchStub).not.to.have.been.called
      })
  })
})
