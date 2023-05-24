describe('Dataset', () => {
  // TODO - Replace hardcoded values with the actual values from a new created dataset

  it('successfully loads a dataset when passing the id', () => {
    cy.visit('/datasets/12345')

    cy.findByRole('heading', { name: 'Dataset Title' }).should('exist')
    cy.findByText('Version 1.0').should('exist')
    cy.findByText('Draft').should('exist')

    cy.findByText('Metadata').should('exist')
    cy.findByText('Files').should('exist')
  })

  it('successfully loads a dataset metadata with all possible blocks translations', () => {
    cy.visit('/datasets/12345')

    cy.findByRole('heading', { name: 'Dataset Title' }).should('exist')

    cy.findByRole('tab', { name: 'Metadata' }).should('exist').click()

    cy.findByText('Citation Metadata').should('exist')
    cy.findByText('Author').should('exist')

    cy.findByText('Geospatial Metadata').should('exist').click()
    cy.findByText('Geographic Unit').should('exist')

    cy.findByText('Astronomy and Astrophysics Metadata').should('exist').click()
    cy.findByText('Type').should('exist')

    cy.findByText('Software Metadata (CodeMeta v2.0)').should('exist').click()
    cy.findByText('Application Category').should('exist')

    cy.findByText('Computational Workflow Metadata').should('exist').click()
    cy.findByText('Documentation').should('exist')

    cy.findByText('HBGDki Custom Metadata').should('exist').click()
    cy.findByText('Lower limit of age at enrollment').should('exist')

    cy.findByText('Alliance for Research on Corporate Sustainability Metadata')
      .should('exist')
      .click()
    cy.findByText(
      '3) Do any of these data sets include individual-level data (either collected or pre-existing in the dataset) that might make them subject to U.S. or international human subjects considerations?'
    ).should('exist')

    cy.findByText('CHIA Metadata').should('exist').click()
    cy.findByText('Variables').should('exist')

    cy.findByText('Digaai Metadata').should('exist').click()
    cy.findByText('Data de Publicação').should('exist')

    cy.findByText('Graduate School of Design Metadata').should('exist').click()
    cy.findByText('Accreditation').should('exist')

    cy.findByText('MRA Metadata').should('exist').click()
    cy.findByText('Murray Research Archive Collection').should('exist')

    cy.findByText('PSI Metadata').should('exist').click()
    cy.findByText('Population').should('exist')

    cy.findByText('Political Science Replication Initiative Metadata').should('exist').click()
    cy.findByText(
      'Will you submit your replication code to this Dataverse (This is a PSRI requirement)?'
    ).should('exist')

    cy.findByText('Journal Metadata').should('exist').click()
    cy.findByText('Volume').should('exist')

    cy.findByText('Social Science and Humanities Metadata').should('exist').click()
    cy.findByText('Major Deviations for Sample Design').should('exist')
  })

  it('loads page not fount when no search parameter is passed', () => {
    cy.visit('/datasets')

    cy.findByText('Page Not Found').should('exist')
  })

  it('loads dataset anonymized view when privateUrlToken is passed', () => {
    cy.visit('/datasets/?privateUrlToken=12345')

    cy.findByRole('heading', { name: 'Dataset Title' }).should('exist')

    cy.findByRole('tab', { name: 'Metadata' }).should('exist').click()

    cy.findAllByText('withheld').should('exist')
  })

  // TODO - Add test for when the dataset is not found and loading skeleton when the js-dataverse module is ready
})
