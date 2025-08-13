import { LoadingProvider } from '../../../../src/sections/loading/LoadingProvider'
import { useLoading } from '../../../../src/sections/loading/LoadingContext'

describe('LoadingProvider', () => {
  it('should render children', () => {
    cy.mount(
      <LoadingProvider>
        <div>Hello, world!</div>
      </LoadingProvider>
    )

    cy.findByText('Hello, world!').should('exist')
  })

  it('should set isLoading to false when setIsLoading is called', () => {
    const buttonText = 'Toggle Loading'
    const TestComponent = () => {
      const { isLoading, setIsLoading } = useLoading()
      return (
        <>
          <button onClick={() => setIsLoading(false)}>{buttonText}</button>
          {isLoading && <div>Loading...</div>}
        </>
      )
    }

    cy.mount(
      <LoadingProvider>
        <TestComponent />
      </LoadingProvider>
    )

    cy.findByText(buttonText).should('exist')

    cy.findByText('Loading...').should('exist')

    cy.findByText(buttonText).click()

    cy.findByText('Loading...').should('not.exist')
  })
})
