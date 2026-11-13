import { ReturnToAuthorModal } from '@/sections/dataset/return-to-author/ReturnToAuthorModal'
import { DatasetContext } from '@/sections/dataset/DatasetContext'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'

describe('ReturnToAuthorModal', () => {
  const mountModal = (returnToAuthor = cy.stub().resolves()) => {
    const close = cy.stub().as('close')
    const refreshDataset = cy.stub().as('refresh')
    cy.customMount(
      <DatasetContext.Provider value={{ dataset: undefined, isLoading: false, refreshDataset }}>
        <ReturnToAuthorModal
          datasetId="doi:10.123/test"
          repository={{ returnToAuthor } as unknown as DatasetRepository}
          handleClose={close}
        />
      </DatasetContext.Provider>
    )
    return returnToAuthor
  }

  it('requires a nonblank reason and counts characters', () => {
    mountModal()
    cy.findByRole('button', { name: 'Continue' }).should('be.disabled')
    cy.findByText('2000 characters remaining.').should('exist')
    cy.findByRole('textbox').type('   ')
    cy.findByRole('button', { name: 'Continue' }).should('be.disabled')
    cy.findByRole('textbox').clear().type('Fix metadata')
    cy.findByText('1988 characters remaining.').should('exist')
    cy.findByRole('textbox').should('have.attr', 'maxlength', '2000')
    cy.findByRole('button', { name: 'Continue' }).should('be.enabled')
  })

  it('submits the reason, closes, and refreshes the dataset', () => {
    const submit = mountModal().as('submit')
    cy.findByRole('textbox').type('Please add files.')
    cy.findByRole('button', { name: 'Continue' }).click()
    cy.wrap(submit).should(
      'have.been.calledOnceWithExactly',
      'doi:10.123/test',
      'Please add files.'
    )
    cy.get('@close').should('have.been.calledOnce')
    cy.get('@refresh').should('have.been.calledOnce')
  })

  it('preserves the reason after an error and allows retry', () => {
    const submit = cy.stub().rejects(new Error('Server unavailable'))
    mountModal(submit)
    cy.findByRole('textbox').type('Please add files.')
    cy.findByRole('button', { name: 'Continue' }).click()
    cy.findByRole('alert').should(
      'contain.text',
      'Unable to return this dataset to its author. Please try again.'
    )
    cy.findByRole('textbox').should('have.value', 'Please add files.')
    cy.get('@close').should('not.have.been.called')
    cy.get('@refresh').should('not.have.been.called')
    cy.then(() => submit.resolves())
    cy.findByRole('button', { name: 'Continue' }).click()
    cy.get('@refresh').should('have.been.calledOnce')
  })

  it('prevents duplicate submissions and cancellation while submitting', () => {
    mountModal(cy.stub().returns(new Promise(() => {})))
    cy.findByRole('textbox').type('Please add files.')
    cy.findByRole('button', { name: 'Continue' }).click().should('be.disabled')
    cy.findByRole('button', { name: 'Cancel' }).should('be.disabled')
    cy.findByRole('textbox').should('be.disabled')
    cy.findByRole('button', { name: 'Close' }).click()
    cy.get('@close').should('not.have.been.called')
  })

  it('cancels without submitting', () => {
    mountModal().as('submit')
    cy.findByRole('textbox').type('Please add files.')
    cy.findByRole('button', { name: 'Cancel' }).click()
    cy.get('@close').should('have.been.calledOnce')
    cy.get('@submit').should('not.have.been.called')
  })
})
