import { FilesTreeCheckbox } from '../../../../../../src/sections/dataset/dataset-files/files-tree/FilesTreeCheckbox'

describe('FilesTreeCheckbox', () => {
  it('renders aria-checked=true and the checked class when state is "all"', () => {
    cy.mount(<FilesTreeCheckbox state="all" label="Toggle row" onToggle={() => undefined} />)
    cy.findByRole('checkbox', { name: 'Toggle row' }).should('have.attr', 'aria-checked', 'true')
  })

  it('renders aria-checked=mixed when state is "partial"', () => {
    cy.mount(<FilesTreeCheckbox state="partial" label="Toggle row" onToggle={() => undefined} />)
    cy.findByRole('checkbox', { name: 'Toggle row' }).should('have.attr', 'aria-checked', 'mixed')
  })

  it('renders aria-checked=false when state is "none"', () => {
    cy.mount(<FilesTreeCheckbox state="none" label="Toggle row" onToggle={() => undefined} />)
    cy.findByRole('checkbox', { name: 'Toggle row' }).should('have.attr', 'aria-checked', 'false')
  })

  it('toggles on Space and Enter, preventing default scroll behaviour', () => {
    const onToggle = cy.stub()
    cy.mount(<FilesTreeCheckbox state="none" label="Toggle row" onToggle={onToggle} />)

    cy.findByRole('checkbox')
      .trigger('keydown', { key: ' ' })
      .trigger('keydown', { key: 'Enter' })
      .trigger('keydown', { key: 'Tab' }) // ignored
      .then(() => {
        expect(onToggle).to.have.been.calledTwice
      })
  })

  it('toggles on click', () => {
    const onToggle = cy.stub()
    cy.mount(<FilesTreeCheckbox state="none" label="Toggle row" onToggle={onToggle} />)
    cy.findByRole('checkbox').click()
    cy.then(() => {
      expect(onToggle).to.have.been.calledOnce
    })
  })
})
