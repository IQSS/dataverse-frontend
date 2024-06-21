import { CreateDataset } from '../../../../src/sections/create-dataset/CreateDataset'
import { DatasetRepository } from '../../../../src/dataset/domain/repositories/DatasetRepository'
import { MetadataBlockInfoRepository } from '../../../../src/metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { MetadataBlockInfoMother } from '../../metadata-block-info/domain/models/MetadataBlockInfoMother'
import { NotImplementedModalProvider } from '../../../../src/sections/not-implemented/NotImplementedModalProvider'

const datasetRepository: DatasetRepository = {} as DatasetRepository
const metadataBlockInfoRepository: MetadataBlockInfoRepository = {} as MetadataBlockInfoRepository

const collectionMetadataBlocksInfo =
  MetadataBlockInfoMother.getByCollectionIdDisplayedOnCreateTrue()

describe('Create Dataset', () => {
  beforeEach(() => {
    datasetRepository.create = cy.stub().resolves({ persistentId: 'persistentId' })
    metadataBlockInfoRepository.getDisplayedOnCreateByCollectionId = cy
      .stub()
      .resolves(collectionMetadataBlocksInfo)
  })

  it('renders the Host Collection Form', () => {
    cy.customMount(
      <NotImplementedModalProvider>
        <CreateDataset
          datasetRepository={datasetRepository}
          collectionId={'test-collectionId'}
          metadataBlockInfoRepository={metadataBlockInfoRepository}
        />
      </NotImplementedModalProvider>
    )
    cy.findByText(/^Host Collection/i).should('exist')
    cy.findByDisplayValue('test-collectionId').should('exist')
    cy.findByText(/^Edit Host Collection/i)
      .should('exist')
      .click()
      .then(() => {
        cy.findByText('Not Implemented').should('exist')
      })
  })
})
