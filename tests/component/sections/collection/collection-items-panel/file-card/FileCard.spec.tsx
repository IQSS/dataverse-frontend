import { FileCard } from '@/sections/collection/collection-items-panel/items-list/file-card/FileCard'
import { FileItemTypePreviewMother } from '@tests/component/files/domain/models/FileItemTypePreviewMother'
import { DateHelper } from '@/shared/helpers/DateHelper'
import { FileCardHelper } from '@/sections/collection/collection-items-panel/items-list/file-card/FileCardHelper'
import { PublicationStatus } from '@/shared/core/domain/models/PublicationStatus'
import { FileLabelType } from '@/files/domain/models/FileMetadata'
import i18n from '@/i18n'

describe('FileCard', () => {
  beforeEach(() => cy.wrap(i18n.changeLanguage('en')))
  afterEach(() => cy.wrap(i18n.changeLanguage('en')))

  it('should render the card', () => {
    const userRoles = ['Admin', 'Contributor']
    const filePreview = FileItemTypePreviewMother.create({ userRoles: userRoles })
    cy.customMount(<FileCard filePreview={filePreview} />)

    filePreview.restricted
      ? cy.findByTestId('file-access-restricted-icon').should('exist')
      : cy.findByTestId('file-access-restricted-icon').should('not.exist')
    cy.contains(DateHelper.toDisplayFormat(filePreview.releaseOrCreateDate)).should('exist')
    cy.contains(filePreview.fileType).should('exist')
    filePreview.checksum?.type && cy.contains(filePreview.checksum?.type).should('exist')
    cy.contains(FileCardHelper.formatBytesToCompactNumber(filePreview.sizeInBytes)).should('exist')
    filePreview.description && cy.findByText(filePreview.description).should('exist')
    filePreview.datasetName && cy.findByText(filePreview.datasetName).should('exist')
    filePreview.tags &&
      filePreview.tags.forEach((tag) => {
        cy.findByText(tag.value).should('exist')
      })
    userRoles.forEach((role) => {
      cy.findByText(role).should('exist')
    })
  })

  it('should render the card if file is tabular', () => {
    const filePreview = FileItemTypePreviewMother.create({
      fileType: 'Tab-Delimited',
      fileContentType: 'text/tab-separated-values'
    })
    cy.customMount(<FileCard filePreview={filePreview} />)

    cy.contains(DateHelper.toDisplayFormat(filePreview.releaseOrCreateDate)).should('exist')
    cy.contains(filePreview.fileType).should('exist')
    filePreview.checksum?.type && cy.contains(filePreview.checksum?.type).should('exist')
    cy.contains(FileCardHelper.formatBytesToCompactNumber(filePreview.sizeInBytes)).should('exist')
    filePreview.description && cy.findByText(filePreview.description).should('exist')
    filePreview.datasetName && cy.findByText(filePreview.datasetName).should('exist')
    filePreview.tags &&
      filePreview.tags.forEach((tag) => {
        cy.findByText(tag.value).should('exist')
      })
    filePreview.variables &&
      cy.contains(new Intl.NumberFormat('en').format(filePreview.variables)).should('exist')
    filePreview.observations &&
      cy.contains(new Intl.NumberFormat('en').format(filePreview.observations)).should('exist')
  })

  it('should render the card if dateset is draft version', () => {
    const filePreview = FileItemTypePreviewMother.create({
      publicationStatuses: [PublicationStatus.Draft],
      userRoles: ['Admin', 'Contributor', 'Curator']
    })
    cy.customMount(<FileCard filePreview={filePreview} />)

    cy.contains(DateHelper.toDisplayFormat(filePreview.releaseOrCreateDate)).should('exist')
    cy.contains(filePreview.fileType).should('exist')
    filePreview.checksum?.type && cy.contains(filePreview.checksum?.type).should('exist')
    cy.contains(FileCardHelper.formatBytesToCompactNumber(filePreview.sizeInBytes)).should('exist')
    filePreview.description && cy.findByText(filePreview.description).should('exist')
    filePreview.datasetName && cy.findByText(filePreview.datasetName).should('exist')
    filePreview.tags &&
      filePreview.tags.forEach((tag) => {
        cy.findByText(tag.value).should('exist')
      })
    cy.findByRole('link', { name: filePreview.datasetName })
      .should('have.attr', 'href')
      .and('include', 'version=DRAFT')
  })

  it('should not show any tag if the file has no tags', () => {
    const filePreview = FileItemTypePreviewMother.create({ tags: [] })
    cy.customMount(<FileCard filePreview={filePreview} />)

    cy.findByTestId('file-labels').children().should('have.length', 0)
  })

  it('localizes the date, file type, system label, and tabular counts in Spanish', () => {
    const filePreview = FileItemTypePreviewMother.create({
      releaseOrCreateDate: new Date(2026, 8, 2, 12),
      fileType: 'Tab-Delimited',
      fileContentType: 'text/tab-separated-values',
      variables: 53_305,
      observations: 4_940,
      tags: [{ value: 'Data', type: FileLabelType.CATEGORY }]
    })

    cy.wrap(i18n.changeLanguage('es')).then(() => {
      cy.customMount(<FileCard filePreview={filePreview} />)
    })

    cy.findByText(/2 sept 2026/).should('exist')
    cy.findByText('Valores separados por tabuladores').should('exist')
    cy.findByText(/53\.305 variables, 4940 observaciones/).should('exist')
    cy.findByText('Datos').should('have.class', 'bg-secondary')
  })

  it('should default to 0 variables and 0 observations if file is tabular and they are not present', () => {
    const filePreview = FileItemTypePreviewMother.create({
      fileType: 'Tab-Delimited',
      fileContentType: 'text/tab-separated-values',
      variables: undefined,
      observations: undefined
    })
    cy.customMount(<FileCard filePreview={filePreview} />)

    cy.contains('0 variables, 0 observations').should('exist')
  })
})
