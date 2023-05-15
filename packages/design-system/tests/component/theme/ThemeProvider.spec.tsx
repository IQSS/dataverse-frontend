import { ThemeProvider, useTheme } from '../../../src/lib/components/theme/ThemeProvider'
import { baseTheme } from '../../../src/lib/components/theme/BaseTheme'

describe('ThemeProvider', () => {
  it('should render the child component with the given theme', () => {
    const TestComponent = () => {
      const theme = useTheme()
      return <div style={{ fontSize: theme.typography.fontSizeSm }}>Child component</div>
    }

    cy.mount(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    cy.findByText('Child component').should(
      'have.attr',
      'style',
      `font-size: ${baseTheme.typography.fontSizeSm};`
    )
  })

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

    cy.mount(
      <ThemeProvider theme={testTheme}>
        <TestComponent />
      </ThemeProvider>
    )

    cy.findByText('Child component').should(
      'have.attr',
      'style',
      `font-size: ${testTheme.typography.fontSizeSm};`
    )
  })
})
