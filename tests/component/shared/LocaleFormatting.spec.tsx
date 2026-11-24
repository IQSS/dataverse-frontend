import i18n from '@/i18n'
import { FileCard } from '@/sections/collection/collection-items-panel/items-list/file-card/FileCard'
import { FileMetadata } from '@/sections/file/file-metadata/FileMetadata'
import { PaginationResultsInfo } from '@/sections/shared/pagination/PaginationResultsInfo'
import { FileSizeUnit } from '@/files/domain/models/FileMetadata'
import { DateHelper } from '@/shared/helpers/DateHelper'
import { PaginationInfo } from '@/shared/pagination/domain/models/PaginationInfo'
import { DatasetPaginationInfo } from '@/dataset/domain/models/DatasetPaginationInfo'
import { DatasetMockRepository } from '@/stories/dataset/DatasetMockRepository'
import { DataverseInfoMockRepository } from '@/stories/shared-mock-repositories/info/DataverseInfoMockRepository'
import { FileItemTypePreviewMother } from '@tests/component/files/domain/models/FileItemTypePreviewMother'
import { FileMother } from '@tests/component/files/domain/models/FileMother'
import {
  FileMetadataMother,
  FileSizeMother,
  FileTabularDataMother,
  FileTypeMother
} from '@tests/component/files/domain/models/FileMetadataMother'
import { WithRepositories } from '@tests/component/WithRepositories'

describe('Regional formatting with base-language translations', () => {
  let supportedLanguages: string[]
  let originalSupportedLanguages: string[]

  beforeEach(() => {
    const languages = i18n.options.supportedLngs
    if (!languages) {
      throw new Error('The regional fixture requires configured supported languages')
    }
    supportedLanguages = languages as string[]
    originalSupportedLanguages = [...languages]
    // Configure regional locales without regional translation resources.
    supportedLanguages.push('es-mx', 'en-gb')
    cy.intercept('GET', '**/locales/es-mx/*.json', { statusCode: 404, body: {} })
    cy.intercept('GET', '**/locales/en-gb/*.json', { statusCode: 404, body: {} })
  })

  afterEach(() => {
    supportedLanguages.splice(0, supportedLanguages.length, ...originalSupportedLanguages)
  })

  it('keeps Mexican number and size formatting when file-card translations fall back to Spanish', () => {
    const filePreview = FileItemTypePreviewMother.create({
      fileType: 'Tab-Delimited',
      fileContentType: 'text/tab-separated-values',
      sizeInBytes: 180_300,
      variables: 53_305,
      observations: 4_940
    })

    cy.setLanguage('es-MX')
    cy.customMount(<FileCard filePreview={filePreview} />)

    cy.findByText('Valores separados por tabuladores').should('exist')
    cy.findByText(/53,305 variables, 4,940 observaciones/).should('exist')
    cy.findByText('- 176.1 KB').should('exist')
    cy.then(() => expect(i18n.resolvedLanguage).to.equal('es'))

    cy.setLanguage('es')
    cy.findByText(/53\.305 variables, 4940 observaciones/).should('exist')
    cy.findByText('- 176,1 KB').should('exist')

    cy.setLanguage('es-MX')
    cy.findByText(/53,305 variables, 4,940 observaciones/).should('exist')
    cy.findByText('- 176.1 KB').should('exist')
  })

  it('uses Mexican separators for file-detail sizes and tabular counts with Spanish labels', () => {
    const file = FileMother.create()
    const metadata = FileMetadataMother.create({
      size: FileSizeMother.create({ value: 180.3, unit: FileSizeUnit.KILOBYTES }),
      type: FileTypeMother.createTabular(),
      tabularData: FileTabularDataMother.create({ variables: 53_305, observations: 4_940 })
    })

    cy.setLanguage('es-MX')
    cy.customMount(
      <WithRepositories datasetRepository={new DatasetMockRepository()}>
        <FileMetadata
          name={file.name}
          metadata={metadata}
          permissions={file.permissions}
          datasetPersistentId={file.datasetPersistentId}
          datasetVersion={file.datasetVersion}
          dataverseInfoRepository={new DataverseInfoMockRepository()}
        />
      </WithRepositories>
    )

    cy.findByText('Valores separados por tabuladores').should('exist')
    cy.findByText('180.3 KB').should('exist')
    cy.findByText('53,305').should('exist')
    cy.findByText('4,940').should('exist')
  })

  it('uses Mexican separators in pagination without losing Spanish translations', () => {
    cy.setLanguage('es-MX')
    cy.customMount(
      <PaginationResultsInfo
        paginationInfo={new PaginationInfo<DatasetPaginationInfo>(1, 10, 53_305, 'resultado')}
      />
    )

    cy.findByText('1 a 10 de 53,305 resultados').should('exist')
  })

  it('uses British date formats even when date translations resolve to English', () => {
    cy.setLanguage('en-GB').then(() => {
      expect(i18n.resolvedLanguage).to.equal('en')
      expect(DateHelper.toDisplayFormat(new Date(2026, 8, 2, 12))).to.equal('2 Sept 2026')
      expect(DateHelper.toDisplayFormatYYYYMMDD(new Date(2026, 8, 2, 12))).to.equal('02/09/2026')
      expect(DateHelper.toDisplayFormatWithTime(new Date('2026-09-02T12:34:00Z'))).to.equal(
        '2 Sept 2026, 12:34 UTC'
      )
    })
  })
})
