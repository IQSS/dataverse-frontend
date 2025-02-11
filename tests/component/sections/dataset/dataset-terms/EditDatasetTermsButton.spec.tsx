import { EditDatasetTermsButton } from '@/sections/dataset/dataset-terms/EditDatasetTermsButton'
import { ReactNode } from 'react'
import { DatasetProvider } from '@/sections/dataset/DatasetProvider'
import {
  DatasetMother,
  DatasetPermissionsMother
} from '@tests/component/dataset/domain/models/DatasetMother'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { Dataset } from '@/dataset/domain/models/Dataset'
import { NotImplementedModalProvider } from '@/sections/not-implemented/NotImplementedModalProvider'
const datasetRepository: DatasetRepository = {} as DatasetRepository

describe('EditDatasetTermsButton', () => {
  const withProviders = (component: ReactNode, dataset: Dataset | undefined) => {
    datasetRepository.getByPersistentId = cy.stub().resolves(dataset)
    datasetRepository.getByPrivateUrlToken = cy.stub().resolves(dataset)

    return (
      <DatasetProvider
        searchParams={{ persistentId: 'some-persistent-id', version: 'some-version' }}
        repository={datasetRepository}>
        <NotImplementedModalProvider>{component}</NotImplementedModalProvider>
      </DatasetProvider>
    )
  }

  it('renders the EditDatasetTermsButton if the user has permission to update the dataset', () => {
    const dataset = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithUpdateDatasetAllowed()
    })

    cy.mountAuthenticated(withProviders(<EditDatasetTermsButton />, dataset))

    cy.findByRole('button', { name: 'Edit Term Requirements' }).should('exist')
  })

  it('does not render the EditDatasetTermsButton if the user does not have permission to update the dataset', () => {
    const dataset = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithNoneAllowed()
    })

    cy.mountAuthenticated(withProviders(<EditDatasetTermsButton />, dataset))

    cy.findByRole('button', { name: 'Edit Term Requirements' }).should('not.exist')
  })

  it('does not render the EditDatasetTermsButton if there is no user', () => {
    const dataset = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithUpdateDatasetAllowed()
    })

    cy.customMount(withProviders(<EditDatasetTermsButton />, dataset))

    cy.findByRole('button', { name: 'Edit Term Requirements' }).should('not.exist')
  })

  it('calls showModal when the button is clicked', () => {
    const dataset = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithUpdateDatasetAllowed()
    })
    cy.mountAuthenticated(withProviders(<EditDatasetTermsButton />, dataset))

    cy.spy(console, 'log').as('consoleLogSpy')
    cy.findByRole('button', { name: 'Edit Term Requirements' }).click()
  })
})
