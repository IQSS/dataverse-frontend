import { renderHook } from '@testing-library/react'
import { useErrorLogger } from '../../../../src/sections/error-page/useErrorLogger'

interface RouterError {
  status: number
  statusText: string
  internal: boolean
  data: string
  error: Error
}

describe('useErrorLogger', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      cy.stub(win.console, 'error').as('consoleError')
    })
  })

  it('should only log the same errors once when multiple occur, and log different errors separately', () => {
    const testError = {
      status: 404,
      statusText: 'Not Found',
      internal: true,
      data: 'Test Error: Not Found',
      error: new Error('Test Error')
    }

    const newError = {
      status: 500,
      statusText: 'Internal Server Error',
      internal: true,
      data: 'Error: Another error occurred',
      error: new Error('Another error occurred')
    }

    cy.window().then(() => {
      const { rerender } = renderHook(
        ({ error }: { error: Error | RouterError | null }) => useErrorLogger(error),
        { initialProps: { error: testError } }
      )
      cy.get('@consoleError').should('have.been.calledOnceWith', 'Error:', testError)
      cy.then(() => {
        rerender({ error: testError })
      })
      cy.get('@consoleError').should('have.been.calledOnce')
      cy.then(() => {
        rerender({ error: newError })
      })
      cy.get('@consoleError').should('have.been.calledWith', 'Error:', newError)
    })
  })

  it('should not log anything if no error is provided', () => {
    cy.window().then(() => {
      const { rerender } = renderHook(
        ({ error }: { error: Error | RouterError | null }) => useErrorLogger(error),
        { initialProps: { error: null } }
      )
      cy.get('@consoleError').should('not.have.been.called')
      cy.then(() => {
        rerender({ error: null })
      })
      cy.get('@consoleError').should('not.have.been.called')
    })
  })

  it('should be used to log errors manually only once for the same error, and log different errors separately', () => {
    const badRequestError = {
      status: 400,
      statusText: 'Bad Request',
      internal: true,
      data: 'Error: Manually logged error',
      error: new Error('Manually logged error')
    }

    const newError = {
      status: 500,
      statusText: 'Internal Server Error',
      internal: true,
      data: 'Error: Another error occurred',
      error: new Error('Another error occurred')
    }

    cy.window().then(() => {
      const { result } = renderHook(() => useErrorLogger(null))
      cy.then(() => {
        return result.current(badRequestError.error)
      })
      cy.get('@consoleError').should('have.been.calledOnceWith', 'Error:', badRequestError.error)
      cy.then(() => {
        result.current(badRequestError.error)
      })
      cy.get('@consoleError').should('have.been.calledOnce')
      cy.then(() => {
        result.current(newError.error)
      })
      cy.get('@consoleError').should('have.been.calledWith', 'Error:', newError.error)
    })
  })
})
