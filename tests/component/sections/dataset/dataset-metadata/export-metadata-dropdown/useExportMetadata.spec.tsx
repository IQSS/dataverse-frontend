import { act, renderHook } from '@testing-library/react'
import { ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'
import { toast } from 'react-toastify'
import { DatasetNotNumberedVersion } from '@iqss/dataverse-client-javascript'
import i18next from '@/i18n'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { useExportMetadata } from '@/sections/dataset/dataset-metadata/export-metadata-dropdown/useExportMetadata'
import { DatasetVersionMother } from '@tests/component/dataset/domain/models/DatasetMother'
import { WithRepositories } from '@tests/component/WithRepositories'

const testDatasetPersistentId = 'doi:10.70122/FK2/XXXXXX'

describe('useExportMetadata', () => {
  const datasetRepository: DatasetRepository = {} as DatasetRepository
  const wrapper = ({ children }: { children: ReactNode }) => (
    <I18nextProvider i18n={i18next}>
      <WithRepositories datasetRepository={datasetRepository}>{children}</WithRepositories>
    </I18nextProvider>
  )
  let openedWindow: {
    closed: boolean
    document: { title: string }
    location: { href: string }
    close: Cypress.Agent<sinon.SinonStub>
  }

  beforeEach(() => {
    datasetRepository.exportDatasetMetadata = cy.stub().as('exportDatasetMetadata').resolves({
      content: 'exported metadata',
      contentType: 'application/xml'
    })

    cy.clock()

    cy.window().then((win) => {
      cy.stub(win.URL, 'createObjectURL').as('createObjectURL').returns('blob:exported-metadata')
      cy.stub(win.URL, 'revokeObjectURL').as('revokeObjectURL')
      openedWindow = {
        closed: false,
        document: { title: '' },
        location: { href: '' },
        close: cy.stub().as('openedWindowClose')
      }
      cy.stub(win, 'open')
        .as('windowOpen')
        .returns(openedWindow as unknown as Window)
    })
  })

  it('should export latest published metadata in a new tab', () => {
    const { result } = renderHook(
      () =>
        useExportMetadata({
          datasetPersistentId: testDatasetPersistentId,
          datasetVersion: DatasetVersionMother.createReleased()
        }),
      { wrapper }
    )

    cy.then(async () => {
      await act(async () => {
        await result.current.handleExportMetadata('OAI_ORE')
      })
    })

    cy.get('@windowOpen').should('have.been.calledWith', '', '_blank')
    cy.get('@exportDatasetMetadata').should(
      'have.been.calledWith',
      testDatasetPersistentId,
      'OAI_ORE'
    )
    cy.then(() => {
      expect(openedWindow.document.title).to.equal('Export Metadata')
      expect(openedWindow.location.href).to.equal('blob:exported-metadata')
    })
    cy.get('@createObjectURL').should('have.been.called')
    cy.tick(1000)
    cy.get('@revokeObjectURL').should('have.been.calledWith', 'blob:exported-metadata')
  })

  it('should export draft metadata when dataset version is draft', () => {
    const { result } = renderHook(
      () =>
        useExportMetadata({
          datasetPersistentId: testDatasetPersistentId,
          datasetVersion: DatasetVersionMother.createDraft()
        }),
      { wrapper }
    )

    cy.then(async () => {
      await act(async () => {
        await result.current.handleExportMetadata('OAI_ORE')
      })
    })

    cy.get('@exportDatasetMetadata').should(
      'have.been.calledWith',
      testDatasetPersistentId,
      'OAI_ORE',
      DatasetNotNumberedVersion.DRAFT
    )
  })

  it('should close the new tab and show an error when export fails', () => {
    datasetRepository.exportDatasetMetadata = cy
      .stub()
      .as('exportDatasetMetadata')
      .rejects(new Error('Export failed'))
    cy.stub(toast, 'error').as('toastError')

    const { result } = renderHook(
      () =>
        useExportMetadata({
          datasetPersistentId: testDatasetPersistentId,
          datasetVersion: DatasetVersionMother.createReleased()
        }),
      { wrapper }
    )

    cy.then(async () => {
      await act(async () => {
        await result.current.handleExportMetadata('OAI_ORE')
      })
    })

    cy.get('@openedWindowClose').should('have.been.called')
    cy.get('@toastError').should(
      'have.been.calledWith',
      'There was a problem exporting the dataset metadata. Please try again.'
    )
  })

  it('should not export metadata when popup is blocked', () => {
    cy.window().then((win) => {
      ;(win.open as Cypress.Agent<sinon.SinonStub>).returns(null)
    })

    const { result } = renderHook(
      () =>
        useExportMetadata({
          datasetPersistentId: testDatasetPersistentId,
          datasetVersion: DatasetVersionMother.createReleased()
        }),
      { wrapper }
    )

    cy.then(async () => {
      await act(async () => {
        await result.current.handleExportMetadata('OAI_ORE')
      })
    })

    cy.get('@exportDatasetMetadata').should('not.have.been.called')
    cy.get('@createObjectURL').should('not.have.been.called')
  })
})
