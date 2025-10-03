import { ExternalToolsRepository } from '@/externalTools/domain/repositories/ExternalToolsRepository'
import {
  DatasetConfigureOptions,
  DatasetExploreOptions
} from '@/sections/dataset/dataset-action-buttons/DatasetToolsOptions'
import { ExternalToolsProvider } from '@/shared/contexts/external-tools/ExternalToolsProvider'
import { ExternalToolsMother } from '@tests/component/externalTools/domain/models/ExternalToolsMother'

const testExternalToolsRepository: ExternalToolsRepository = {} as ExternalToolsRepository

describe('DatasetToolOptions', () => {
  beforeEach(() => {
    testExternalToolsRepository.getExternalTools = cy
      .stub()
      .resolves([
        ExternalToolsMother.createDatasetExploreTool(),
        ExternalToolsMother.createDatasetConfigureTool()
      ])
  })

  it('renders the dataset configure tools options if they are available', () => {
    cy.customMount(
      <ExternalToolsProvider externalToolsRepository={testExternalToolsRepository}>
        <DatasetConfigureOptions persistentId="some-persistent-id" />
      </ExternalToolsProvider>
    )

    cy.findByText('Explore Options').should('not.exist')
    cy.findByText('Configure Options').should('exist')
    cy.findByText('Dataset Configure Tool').should('exist')
  })

  it('renders nothing if there are no dataset configure tools', () => {
    testExternalToolsRepository.getExternalTools = cy.stub().resolves([])
    cy.customMount(
      <ExternalToolsProvider externalToolsRepository={testExternalToolsRepository}>
        <DatasetConfigureOptions persistentId="some-persistent-id" />
      </ExternalToolsProvider>
    )
    cy.findByText('Configure Options').should('not.exist')
  })

  it('renders the dataset explore tools options if they are available', () => {
    cy.customMount(
      <ExternalToolsProvider externalToolsRepository={testExternalToolsRepository}>
        <DatasetExploreOptions persistentId="some-persistent-id" />
      </ExternalToolsProvider>
    )

    cy.findByText('Configure Options').should('not.exist')
    cy.findByText('Explore Options').should('exist')
    cy.findByText('Dataset Explore Tool').should('exist')
  })

  it('renders nothing if there are no dataset explore tools', () => {
    testExternalToolsRepository.getExternalTools = cy.stub().resolves([])
    cy.customMount(
      <ExternalToolsProvider externalToolsRepository={testExternalToolsRepository}>
        <DatasetExploreOptions persistentId="some-persistent-id" />
      </ExternalToolsProvider>
    )
    cy.findByText('Explore Options').should('not.exist')
  })
})
