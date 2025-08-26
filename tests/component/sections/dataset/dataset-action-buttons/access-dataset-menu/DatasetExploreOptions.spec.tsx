import { ExternalToolsRepository } from '@/externalTools/domain/repositories/ExternalToolsRepository'
import { DatasetExploreOptions } from '@/sections/dataset/dataset-action-buttons/access-dataset-menu/DatasetExploreOptions'
import { ExternalToolsProvider } from '@/shared/contexts/external-tools/ExternalToolsProvider'
import { DatasetExternalToolResolvedMother } from '@tests/component/externalTools/domain/models/DatasetExternalToolResolvedMother'

const externalToolsRepository: ExternalToolsRepository = {} as ExternalToolsRepository

describe('DatasetExploreOptions', () => {
  it('renders nothing if there are no dataset explore tools', () => {
    externalToolsRepository.getExternalTools = cy.stub().resolves([])
    cy.customMount(
      <ExternalToolsProvider externalToolsRepository={externalToolsRepository}>
        <DatasetExploreOptions
          externalToolsRepository={externalToolsRepository}
          persistentId="testPersistentId"
        />
      </ExternalToolsProvider>
    )
    cy.findByText('Explore Options').should('not.exist')
  })

  it('renders the explore options if there are dataset explore tools', () => {
    cy.customMount(
      <DatasetExploreOptions
        externalToolsRepository={externalToolsRepository}
        persistentId="testPersistentId"
      />
    )

    cy.contains('Explore Options').should('exist')
    cy.contains('Dataset Explore Tool').should('exist')
  })

  it('calls the getDatasetExternalToolResolved use case when clicking on an explore option', () => {
    externalToolsRepository.getDatasetExternalToolResolved = cy
      .stub()
      .as('getDatasetExternalToolResolved')
      .resolves(DatasetExternalToolResolvedMother.create())

    cy.customMount(
      <DatasetExploreOptions
        externalToolsRepository={externalToolsRepository}
        persistentId="testPersistentId"
      />
    )

    cy.findByText('Dataset Explore Tool').click()

    cy.get('@getDatasetExternalToolResolved').should('have.been.calledOnce')
  })
})
