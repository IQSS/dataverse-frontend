import TopBarProgressIndicator from '../../../../../src/sections/layout/topbar-progress-indicator/TopbarProgressIndicator'
import { LoadingContext } from '../../../../../src/sections/loading/LoadingContext'

describe('TopBarProgressIndicator', () => {
  it('should render without errors', () => {
    cy.mount(<TopBarProgressIndicator />)

    cy.get('canvas').should('exist')
  })

  it('should render the TopBarProgress when loading is true', () => {
    const setIsLoading = () => {}

    cy.mount(
      <LoadingContext.Provider value={{ isLoading: true, setIsLoading }}>
        <TopBarProgressIndicator />{' '}
      </LoadingContext.Provider>
    )

    cy.get('canvas').should('exist')
  })
})
