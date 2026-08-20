import { DatasetTypeSelect } from '@/sections/create-dataset/dataset-type-select/DatasetTypeSelect'
import { DatasetTypeMother } from '@tests/component/dataset/domain/models/DatasetTypeMother'

const datasetTypes = [
  DatasetTypeMother.create({ id: 1, name: 'dataset', displayName: 'Dataset' }),
  DatasetTypeMother.create({ id: 2, name: 'software', displayName: 'Software' })
]

describe('DatasetTypeSelect', () => {
  let defaultProps: {
    datasetTypes: typeof datasetTypes
    onChange: Cypress.Agent<sinon.SinonStub>
    selectedType: (typeof datasetTypes)[0]
  }

  beforeEach(() => {
    defaultProps = {
      datasetTypes,
      onChange: cy.stub(),
      selectedType: datasetTypes[0]
    }
  })

  it('should open the menu when toggle is clicked', () => {
    cy.customMount(<DatasetTypeSelect {...defaultProps} />)
    cy.get('[role="menu"]').should('not.be.visible')
    cy.findByLabelText('Toggle dataset types options menu').click()
    cy.get('[role="menu"]').should('be.visible')
  })

  it('should not open the menu when disabled and toggle is clicked', () => {
    cy.customMount(<DatasetTypeSelect {...defaultProps} disabled={true} />)
    cy.findByLabelText('Toggle dataset types options menu').click({ force: true })
    cy.get('[role="menu"]').should('not.be.visible')
  })

  it('should not call onChange when disabled and a card item is clicked', () => {
    const onChange = cy.stub()
    cy.customMount(<DatasetTypeSelect {...defaultProps} onChange={onChange} disabled={true} />)
    cy.get('[role="menuitem"]').last().click({ force: true })
    cy.wrap(onChange).should('not.have.been.called')
  })

  it('should set tabIndex to -1 on all menu items when disabled', () => {
    cy.customMount(<DatasetTypeSelect {...defaultProps} disabled={true} />)
    cy.get('[role="menuitem"]').each(($item) => {
      expect($item).to.have.attr('tabindex', '-1')
    })
  })

  it('should select a type when Enter is pressed on a menu item', () => {
    const onChange = cy.stub()
    cy.customMount(<DatasetTypeSelect {...defaultProps} onChange={onChange} />)
    cy.findByLabelText('Toggle dataset types options menu').click()
    cy.get('[role="menuitem"]').last().trigger('keydown', { key: 'Enter' })
    cy.wrap(onChange).should('have.been.calledWith', '2')
  })

  it('should select a type when Space is pressed on a menu item', () => {
    const onChange = cy.stub()
    cy.customMount(<DatasetTypeSelect {...defaultProps} onChange={onChange} />)
    cy.findByLabelText('Toggle dataset types options menu').click()
    cy.get('[role="menuitem"]').last().trigger('keydown', { key: ' ' })
    cy.wrap(onChange).should('have.been.calledWith', '2')
  })

  it('should close the menu when Escape is pressed on a menu item', () => {
    cy.customMount(<DatasetTypeSelect {...defaultProps} />)
    cy.findByLabelText('Toggle dataset types options menu').click()
    cy.get('[role="menu"]').should('be.visible')
    cy.get('[role="menuitem"]').first().trigger('keydown', { key: 'Escape' })
    cy.get('[role="menu"]').should('not.be.visible')
  })

  it('should not call onChange when a key other than Enter/Space/Escape is pressed on a menu item', () => {
    const onChange = cy.stub()
    cy.customMount(<DatasetTypeSelect {...defaultProps} onChange={onChange} />)
    cy.findByLabelText('Toggle dataset types options menu').click()
    cy.get('[role="menuitem"]').last().trigger('keydown', { key: 'Tab' })
    cy.wrap(onChange).should('not.have.been.called')
  })

  it('should not call onChange when disabled and keydown is triggered on a menu item', () => {
    const onChange = cy.stub()
    cy.customMount(<DatasetTypeSelect {...defaultProps} onChange={onChange} disabled={true} />)
    cy.get('[role="menuitem"]').last().trigger('keydown', { key: 'Enter', force: true })
    cy.wrap(onChange).should('not.have.been.called')
  })
})
