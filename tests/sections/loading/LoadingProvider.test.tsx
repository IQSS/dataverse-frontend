import { fireEvent, render } from '@testing-library/react'
import { LoadingProvider } from '../../../src/sections/loading/LoadingProvider'
import { useLoading } from '../../../src/sections/loading/LoadingContext'

describe('LoadingProvider', () => {
  it('should render children', () => {
    const { getByText } = render(
      <LoadingProvider>
        <div>Hello, world!</div>
      </LoadingProvider>
    )

    expect(getByText('Hello, world!')).toBeInTheDocument()
  })

  it('should set isLoading to true when setIsLoading is called', async () => {
    const buttonText = 'Toggle Loading'
    const TestComponent = () => {
      const { isLoading, setIsLoading } = useLoading()
      return (
        <>
          <button onClick={() => setIsLoading(true)}>{buttonText}</button>
          {isLoading && <div>Loading...</div>}
        </>
      )
    }

    const { getByText, queryByText, findByText } = render(
      <LoadingProvider>
        <TestComponent />
      </LoadingProvider>
    )

    const toggleLoadingButton = getByText(buttonText)
    expect(toggleLoadingButton).toBeInTheDocument()

    const loadingTextNull = queryByText('Loading...')
    expect(loadingTextNull).not.toBeInTheDocument()

    fireEvent.click(toggleLoadingButton)

    const loadingText = await findByText('Loading...')
    expect(loadingText).toBeInTheDocument()
  })
})
