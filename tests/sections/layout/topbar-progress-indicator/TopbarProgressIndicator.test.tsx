import { render } from '@testing-library/react'
import TopBarProgressIndicator from '../../../../src/sections/layout/topbar-progress-indicator/TopbarProgressIndicator'
import { vi } from 'vitest'

vi.mock('../../loading/LoadingContext', () => ({
  useLoading: vi.fn().mockReturnValue({
    isLoading: false
  })
}))

describe('TopBarProgressIndicator', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should render without errors', () => {
    const { container } = render(<TopBarProgressIndicator />)
    expect(container.firstChild).toBeNull()
  })
})
