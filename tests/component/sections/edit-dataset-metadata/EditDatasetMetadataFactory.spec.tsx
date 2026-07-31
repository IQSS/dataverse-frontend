import { DatasetJSDataverseRepository } from '../../../../src/dataset/infrastructure/repositories/DatasetJSDataverseRepository'
import { MetadataBlockInfoJSDataverseRepository } from '../../../../src/metadata-block-info/infrastructure/repositories/MetadataBlockInfoJSDataverseRepository'
import { DatasetNonNumericVersion } from '../../../../src/dataset/domain/models/Dataset'
import { EditDatasetMetadataFactory } from '../../../../src/sections/edit-dataset-metadata/EditDatasetMetadataFactory'
import { LoadingProvider } from '../../../../src/shared/contexts/loading/LoadingProvider'
import { DatasetMother } from '../../dataset/domain/models/DatasetMother'
import { MetadataBlockInfoMother } from '../../metadata-block-info/domain/models/MetadataBlockInfoMother'
import { QueryParamKey, Route } from '../../../../src/sections/Route.enum'

const dataset = DatasetMother.createRealistic()
const metadataBlocksInfoOnEditMode =
  MetadataBlockInfoMother.getByCollectionIdDisplayedOnCreateFalse()
const metadataBlocksInfoOnCreateMode =
  MetadataBlockInfoMother.getByCollectionIdDisplayedOnCreateTrue()

describe('EditDatasetMetadataFactory', () => {
  const persistentId = 'doi:10.5072/FK2/EDITMETA'
  let getByPersistentIdStub: ReturnType<typeof cy.stub>

  beforeEach(() => {
    getByPersistentIdStub = cy
      .stub(DatasetJSDataverseRepository.prototype, 'getByPersistentId')
      .resolves(dataset)
    cy.stub(DatasetJSDataverseRepository.prototype, 'updateMetadata').resolves(undefined)
    cy.stub(DatasetJSDataverseRepository.prototype, 'getDatasetVersionsSummaries').resolves({
      summaries: [],
      totalCount: 0
    })
    cy.stub(MetadataBlockInfoJSDataverseRepository.prototype, 'getByCollectionId').resolves(
      metadataBlocksInfoOnEditMode
    )
    cy.stub(
      MetadataBlockInfoJSDataverseRepository.prototype,
      'getDisplayedOnCreateByCollectionId'
    ).resolves(metadataBlocksInfoOnCreateMode)
  })

  it('always fetches :latest when the URL carries an older published version (issue #1024)', () => {
    const initialEntry = `${Route.EDIT_DATASET_METADATA}?${
      QueryParamKey.PERSISTENT_ID
    }=${encodeURIComponent(persistentId)}&${QueryParamKey.VERSION}=1.0`

    cy.customMount(<LoadingProvider>{EditDatasetMetadataFactory.create()}</LoadingProvider>, [
      initialEntry
    ])

    cy.wrap(getByPersistentIdStub).should(
      'have.been.calledWith',
      persistentId,
      DatasetNonNumericVersion.LATEST,
      undefined,
      true
    )
    cy.wrap(getByPersistentIdStub).should(
      'not.have.been.calledWith',
      persistentId,
      '1.0',
      undefined,
      true
    )

    cy.findByTestId('edit-dataset-metadata-skeleton').should('not.exist')
    cy.findByText(/^Host Collection/i).should('exist')
  })

  it('still fetches :latest when the URL has no version param', () => {
    const initialEntry = `${Route.EDIT_DATASET_METADATA}?${
      QueryParamKey.PERSISTENT_ID
    }=${encodeURIComponent(persistentId)}`

    cy.customMount(<LoadingProvider>{EditDatasetMetadataFactory.create()}</LoadingProvider>, [
      initialEntry
    ])

    cy.wrap(getByPersistentIdStub).should(
      'have.been.calledWith',
      persistentId,
      DatasetNonNumericVersion.LATEST,
      undefined,
      true
    )
  })
})
