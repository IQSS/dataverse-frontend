import { useLocation } from 'react-router-dom'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { MetadataForm } from '@/sections/shared/form/DatasetMetadataForm/MetadataForm'
import { WithRepositories } from '@tests/component/WithRepositories'

function LocationDisplay() {
  const location = useLocation()
  return <div data-testid="current-location">{location.pathname + location.search}</div>
}

describe('Dataset metadata navigation', () => {
  for (const buttonIndex of [0, 1]) {
    it(`returns to the edited dataset draft using save button ${buttonIndex + 1}`, () => {
      const updateMetadata = cy.stub().resolves()
      const datasetRepository = { updateMetadata } as unknown as DatasetRepository
      const persistentId = 'doi:10.5072/FK2/TEST'

      cy.customMount(
        <WithRepositories datasetRepository={datasetRepository}>
          <LocationDisplay />
          <MetadataForm
            mode="edit"
            collectionId="root"
            datasetPersistentID={persistentId}
            datasetLastUpdateTime="2026-09-29T12:00:00Z"
            formDefaultValues={{}}
            metadataBlocksInfo={[]}
          />
        </WithRepositories>,
        [`/datasets/edit-metadata?persistentId=${persistentId}&version=1.0`]
      )

      cy.findAllByRole('button', { name: 'Save Changes' }).eq(buttonIndex).click()
      cy.findByTestId('current-location').should(
        'have.text',
        `/datasets?persistentId=${persistentId}&version=DRAFT`
      )
      cy.then(() => expect(updateMetadata).to.have.been.calledOnce)
    })
  }
  for (const version of ['1.0', 'DRAFT', undefined]) {
    for (const buttonIndex of [0, 1]) {
      it(`returns to version ${version ?? 'default'} without saving using cancel button ${
        buttonIndex + 1
      }`, () => {
        const updateMetadata = cy.stub().resolves()
        const datasetRepository = { updateMetadata } as unknown as DatasetRepository
        const searchParams = new URLSearchParams({ persistentId: 'doi:10.5072/FK2/TEST' })
        if (version) searchParams.set('version', version)

        cy.customMount(
          <WithRepositories datasetRepository={datasetRepository}>
            <LocationDisplay />
            <MetadataForm
              mode="edit"
              collectionId="root"
              datasetPersistentID="doi:10.5072/FK2/TEST"
              formDefaultValues={{}}
              metadataBlocksInfo={[]}
            />
          </WithRepositories>,
          [`/datasets/edit-metadata?${searchParams.toString()}`]
        )

        cy.findAllByRole('button', { name: 'Cancel' }).eq(buttonIndex).click()
        cy.findByTestId('current-location').should(
          'have.text',
          `/datasets?${searchParams.toString()}`
        )
        cy.then(() => expect(updateMetadata).not.to.have.been.called)
      })
    }
  }

  it('returns to the host collection when cancelling dataset creation', () => {
    cy.customMount(
      <>
        <LocationDisplay />
        <MetadataForm
          mode="create"
          collectionId="root"
          formDefaultValues={{}}
          metadataBlocksInfo={[]}
        />
      </>,
      ['/datasets/root/create']
    )

    cy.findByRole('button', { name: 'Cancel' }).click()
    cy.findByTestId('current-location').should('have.text', '/collections/root')
  })
})
