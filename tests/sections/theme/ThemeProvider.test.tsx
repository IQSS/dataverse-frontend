import { ThemeProvider, useTheme } from '../../../src/sections/ui/theme/ThemeProvider'
import { baseTheme } from '../../../src/sections/ui/theme/BaseTheme'
import { render } from '@testing-library/react'

describe('ThemeProvider', () => {
  it('should render the child component with the given theme', () => {
    const testTheme: typeof baseTheme = {
      ...baseTheme,
      typography: {
        ...baseTheme.typography,
        fontSizeSm: '2.5rem'
      }
    }
    const TestComponent = () => {
      const theme = useTheme()
      return <div style={{ fontSize: theme.typography.fontSizeSm }}>Child component</div>
    }

    const { getByText } = render(
      <ThemeProvider theme={testTheme}>
        <TestComponent />
      </ThemeProvider>
    )

    expect(getByText('Child component')).toHaveAttribute(
      'style',
      `font-size: ${testTheme.typography.fontSizeSm};`
    )
  })
})
