import { act, renderHook, waitFor } from '@testing-library/react'
import { useGetMetadataBlockDisplayFormatInfo } from '../../../../src/sections/dataset/useGetMetadataBlockDisplayFormatInfo'
import { MetadataBlockInfoRepository } from '../../../../src/metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { MetadataBlockInfoMother } from '../../metadata-block-info/domain/models/MetadataBlockInfoMother'
import { MetadataBlockName } from '../../../../src/dataset/domain/models/Dataset'
import { ExternalVocabularyRepository } from '../../../../src/external-vocabularies/domain/repositories/ExternalVocabularyRepository'
import { ExternalVocabularyConfig } from '../../../../src/external-vocabularies/domain/models/ExternalVocabularyConfig'

const metadataBlockInfoRepository: MetadataBlockInfoRepository = {} as MetadataBlockInfoRepository
const externalVocabularyRepository: ExternalVocabularyRepository =
  {} as ExternalVocabularyRepository
const metadataBlockInfoMock = MetadataBlockInfoMother.create()
const authorIdentifierExternalVocabularyConfig: ExternalVocabularyConfig = {
  fieldName: 'author',
  termUriField: 'authorIdentifier',
  protocol: 'orcid',
  allowFreeText: false,
  languages: 'en',
  vocabs: {
    orcid: {
      uriSpace: 'https://orcid.org/',
      vocabularyUri: 'https://orcid.org/'
    }
  },
  managedFields: {
    personName: 'authorName',
    idType: 'authorIdentifierScheme'
  }
}

describe('useGetMetadataBlockDisplayFormatInfo', () => {
  beforeEach(() => {
    metadataBlockInfoRepository.getByName = cy.stub().resolves(metadataBlockInfoMock)
    externalVocabularyRepository.getConfiguredExternalVocabularies = cy.stub().resolves([])
  })
  it('should return metadataBlockDisplayFormatInfo correctly', async () => {
    const { result } = renderHook(() =>
      useGetMetadataBlockDisplayFormatInfo({
        metadataBlockName: MetadataBlockName.CITATION,
        metadataBlockInfoRepository,
        externalVocabularyRepository
      })
    )

    await act(() => {
      expect(result.current.isLoading).to.deep.equal(true)
      return expect(result.current.metadataBlockDisplayFormatInfo).to.deep.equal(undefined)
    })

    await act(() => {
      expect(result.current.isLoading).to.deep.equal(false)
      return expect(result.current.metadataBlockDisplayFormatInfo).to.deep.equal(
        metadataBlockInfoMock
      )
    })
  })

  it('should add configured external vocabulary info to matching display metadata fields', async () => {
    externalVocabularyRepository.getConfiguredExternalVocabularies = cy
      .stub()
      .resolves([authorIdentifierExternalVocabularyConfig])

    const { result } = renderHook(() =>
      useGetMetadataBlockDisplayFormatInfo({
        metadataBlockName: MetadataBlockName.CITATION,
        metadataBlockInfoRepository,
        externalVocabularyRepository
      })
    )

    await waitFor(() => {
      expect(result.current.isLoading).to.deep.equal(false)
      expect(
        result.current.metadataBlockDisplayFormatInfo?.fields.authorIdentifier.externalVocabulary
      ).to.deep.equal(authorIdentifierExternalVocabularyConfig)
      expect(
        result.current.metadataBlockDisplayFormatInfo?.fields.authorName.externalVocabulary
      ).to.deep.equal(authorIdentifierExternalVocabularyConfig)
    })
  })

  describe('Error handling', () => {
    it('should return correct error message when there is an error type catched', async () => {
      metadataBlockInfoRepository.getByName = cy.stub().rejects(new Error('Error message'))

      const { result } = renderHook(() =>
        useGetMetadataBlockDisplayFormatInfo({
          metadataBlockName: MetadataBlockName.CITATION,
          metadataBlockInfoRepository,
          externalVocabularyRepository
        })
      )

      await act(() => {
        expect(result.current.isLoading).to.deep.equal(true)
        return expect(result.current.error).to.deep.equal(null)
      })

      await act(() => {
        expect(result.current.isLoading).to.deep.equal(false)
        return expect(result.current.error).to.deep.equal('Error message')
      })
    })

    it('should return correct error message when there is not an error type catched', async () => {
      metadataBlockInfoRepository.getByName = cy.stub().rejects('Error message')

      const { result } = renderHook(() =>
        useGetMetadataBlockDisplayFormatInfo({
          metadataBlockName: MetadataBlockName.CITATION,
          metadataBlockInfoRepository,
          externalVocabularyRepository
        })
      )

      await act(() => {
        expect(result.current.isLoading).to.deep.equal(true)
        return expect(result.current.error).to.deep.equal(null)
      })

      await act(() => {
        expect(result.current.isLoading).to.deep.equal(false)
        return expect(result.current.error).to.deep.equal(
          'There was an error getting the metadata block info by name'
        )
      })
    })
  })
})
