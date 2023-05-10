import { LoadingProvider } from '../../../src/sections/loading/LoadingProvider'
import { useLoading } from '../../../src/sections/loading/LoadingContext'

describe('LoadingProvider', () => {
  it('should render children', () => {
    cy.mount(
      <LoadingProvider>
        <div>Hello, world!</div>
      </LoadingProvider>
    )

    cy.findByText('Hello, world!').should('exist')
  })

  it('should set isLoading to true when setIsLoading is called', () => {
    const buttonText = 'Toggle Loading'
    const TestComponent = () => {
      const { isLoading, setIsLoading } = useLoading()
      return (
        <>
          <button onClick={() => setIsLoading(true)}>buttonText</button>
          {isLoading && <div>Loading...</div>}
        </>
      )
    }

    cy.mount(
      <LoadingProvider>
        <TestComponent />
      </LoadingProvider>
    )

    const toggleLoadingButton = cy.findByText(buttonText)
    expect(toggleLoadingButton).toBeInTheDocument()

    const loadingText = cy.findByText('Loading...')
    expect(loadingText).not.toBeInTheDocument()

    toggleLoadingButton.click()

    expect(loadingText).toBeInTheDocument()
  })
})
