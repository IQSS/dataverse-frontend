import { Accordion } from '../../../../src/sections/ui/accordion/Accordion'
import { ThemeProvider } from '../../../../src/sections/ui/theme/ThemeProvider'

//TODO: remove ThemeProvider and replace with customMount()

describe('Accordion', () => {
  const section1Header = 'Section 1'
  const section1Body = 'Content 1'
  const section2Header = 'Section 2'
  const section2Body = 'Content 2'
  it('renders an accordion with defaultActiveKey prop and children', () => {
    cy.mount(
      <ThemeProvider>
        <Accordion defaultActiveKey="1">
          <Accordion.Item eventKey="1">
            <Accordion.Header>{section1Header}</Accordion.Header>
            <Accordion.Body>{section1Body}</Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>{section2Header}</Accordion.Header>
            <Accordion.Body>{section2Body}</Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </ThemeProvider>
    )

    cy.findByText(section1Header).should('be.visible')
    cy.findByText(section1Body).should('be.visible')
    cy.findByText(section2Header).should('be.visible')
    cy.findByText(section2Body).should('not.be.visible')

    cy.findByText(section1Header).click()
    cy.findByText(section1Body).should('not.be.visible')
  })
  it('renders fully collapsed without a defaultActiveKey', () => {
    cy.mount(
      <ThemeProvider>
        <Accordion alwaysOpen={true}>
          <Accordion.Item eventKey="1">
            <Accordion.Header>{section1Header}</Accordion.Header>
            <Accordion.Body>{section1Body}</Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>{section2Header}</Accordion.Header>
            <Accordion.Body>{section2Body}</Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </ThemeProvider>
    )
    cy.findByText(section1Header).should('be.visible')
    cy.findByText(section1Body).should('not.be.visible')
    cy.findByText(section2Header).should('be.visible')
    cy.findByText(section2Body).should('not.be.visible')
  })
  it('renders the always open tab correctly', () => {
    cy.mount(
      <ThemeProvider>
        <Accordion defaultActiveKey={['1']} alwaysOpen={true}>
          <Accordion.Item eventKey="1">
            <Accordion.Header>{section1Header}</Accordion.Header>
            <Accordion.Body>{section1Body}</Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>{section2Header}</Accordion.Header>
            <Accordion.Body>{section2Body}</Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </ThemeProvider>
    )
    cy.findByText(section1Header).should('be.visible')
    cy.findByText(section1Body).should('be.visible')
    cy.findByText(section2Header).should('be.visible')
    cy.findByText(section2Body).should('not.be.visible')

    cy.findByText(section2Header).click()
    cy.findByText(section1Header).click()
    cy.findByText(section1Body).should('be.visible')
    cy.findByText(section2Body).should('be.visible')
  })
})
