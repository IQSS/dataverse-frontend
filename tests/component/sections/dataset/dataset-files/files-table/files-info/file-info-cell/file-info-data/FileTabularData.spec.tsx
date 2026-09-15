import { FileTabularData } from '../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-info/file-info-cell/file-info-data/FileTabularData'
import styles from '../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-info/file-info-cell/FileInfoCell.module.scss'
import i18n from '@/i18n'

describe('FileTabularData', () => {
  beforeEach(() => cy.wrap(i18n.changeLanguage('en')))
  afterEach(() => cy.wrap(i18n.changeLanguage('en')))

  it('renders the tabular data and CopyToClipboardButton when tabularData is provided', () => {
    const tabularData = {
      variables: 10,
      observations: 100,
      unf: 'UNF:6:xXw6cIZnwHWvmRdwhYCQZA=='
    }
    cy.customMount(<FileTabularData tabularData={tabularData} />)

    cy.findByText(/10 Variables, 100 Observations/).should('exist')
    cy.findByText('UNF:6:xXw6...QZA==').should('exist')
    cy.findByRole('button', { name: /Copy to clipboard icon/ }).should('exist')
  })

  it('formats counts with the active language', () => {
    cy.wrap(i18n.changeLanguage('es')).then(() => {
      cy.customMount(
        <FileTabularData tabularData={{ variables: 53_305, observations: 4_940, unf: undefined }} />
      )
    })

    cy.findByText(/53\.305 Variables, 4940 Observaciones/).should('exist')
  })

  it('renders an empty fragment when tabularData is not provided', () => {
    cy.customMount(<FileTabularData tabularData={undefined} />)

    cy.get(styles['checksum-container']).should('not.exist')
  })
})
