import { renderHook } from '@testing-library/react'
import { useErrorLogger } from '../../../../src/sections/error-page/useErrorLogger'

describe('useErrorLogger', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      cy.stub(win.console, 'error').as('consoleError')
    })
  })

  it('should only log the same errors once when multiple occur, and log different errors seperately', () => {
    const error = new Error('Test error')

    cy.window().then(() => {
      const { rerender } = renderHook(
        ({ error }: { error: Error | null }) => useErrorLogger(error),
        { initialProps: { error } }
      )
      cy.get('@consoleError').should('have.been.calledOnceWith', 'Error:', 'Test error')
      cy.then(() => {
        rerender({ error })
      })
      cy.get('@consoleError').should('have.been.calledOnce')

      const newError = new Error('Another error')
      cy.then(() => {
        rerender({ error: newError })
      })

      cy.get('@consoleError').should('have.been.calledWith', 'Error:', 'Another error')
    })
  })

  it('should not log anything if no error is provided', () => {
    cy.window().then(() => {
      const { rerender } = renderHook(
        ({ error }: { error: Error | null }) => useErrorLogger(error),
        { initialProps: { error: null } }
      )
      cy.get('@consoleError').should('not.have.been.called')
      cy.then(() => {
        rerender({ error: null })
      })
      cy.get('@consoleError').should('not.have.been.called')
    })
  })

  it('should be used to log errors manually only once for the same error, and log different errors seperately', () => {
    cy.window().then(() => {
      const { result } = renderHook(() => useErrorLogger(null))
      cy.then(() => {
        result.current(new Error('Manually logged error'))
      })
      cy.get('@consoleError').should('have.been.calledOnceWith', 'Error:', 'Manually logged error')
      cy.then(() => {
        result.current(new Error('Manually logged error'))
      })
      cy.get('@consoleError').should('have.been.calledOnce')
      cy.then(() => {
        result.current(new Error('Another manually logged error'))
      })
      cy.get('@consoleError').should(
        'have.been.calledWith',
        'Error:',
        'Another manually logged error'
      )
    })
  })
})
