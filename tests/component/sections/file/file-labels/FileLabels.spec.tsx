import { FileLabelType } from '../../../../../src/files/domain/models/FileMetadata'
import { FileLabels } from '../../../../../src/sections/file/file-labels/FileLabels'
import i18n from '@/i18n'

describe('FileLabels', () => {
  beforeEach(() => cy.wrap(i18n.changeLanguage('en')))
  afterEach(() => cy.wrap(i18n.changeLanguage('en')))

  it('renders labels with correct variants and values', () => {
    const labels = [
      { value: 'Category 1', type: FileLabelType.CATEGORY },
      { value: 'Tag 1', type: FileLabelType.TAG },
      { value: 'Tag 2', type: FileLabelType.TAG }
    ]
    cy.customMount(<FileLabels labels={labels} />)

    cy.findByText('Category 1').should('have.class', 'bg-secondary')
    cy.findAllByText(/Tag/).should('have.class', 'bg-info')
  })

  it('localizes system categories but preserves custom categories and tabular tags', () => {
    const labels = [
      { value: 'Data', type: FileLabelType.CATEGORY },
      { value: 'Custom Category', type: FileLabelType.CATEGORY },
      { value: 'constructor', type: FileLabelType.CATEGORY },
      { value: 'Data', type: FileLabelType.TAG }
    ]

    cy.wrap(i18n.changeLanguage('es')).then(() => {
      cy.customMount(<FileLabels labels={labels} />)
    })

    cy.findByText('Datos').should('have.class', 'bg-secondary')
    cy.findByText('Custom Category').should('have.class', 'bg-secondary')
    cy.findByText('constructor').should('have.class', 'bg-secondary')
    cy.findByText('Data').should('have.class', 'bg-info')
  })
})
