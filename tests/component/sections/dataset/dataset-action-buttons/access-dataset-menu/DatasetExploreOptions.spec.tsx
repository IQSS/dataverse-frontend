import { ExternalToolsRepository } from '@/externalTools/domain/repositories/ExternalToolsRepository'
import { DatasetExploreOptions } from '@/sections/dataset/dataset-action-buttons/access-dataset-menu/DatasetExploreOptions'
import { ExternalToolsProvider } from '@/shared/contexts/external-tools/ExternalToolsProvider'

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
})
