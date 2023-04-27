import { Accordion } from '../../../../src/sections/ui/accordion/Accordion'

describe('Accordion', () => {
  it('renders an accordion with defaultActiveKey prop and children', () => {
    cy.mount(
      <Accordion defaultActiveKey="1">
        <Accordion.Item eventKey="1">
          <Accordion.Header>Section 1</Accordion.Header>
          <Accordion.Body>Content 1</Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>Section 2</Accordion.Header>
          <Accordion.Body>Content 2</Accordion.Body>
        </Accordion.Item>
      </Accordion>
    )
    cy.pause()
    const section1Header = cy.findByText('Section 1')
    const section1Body = cy.findByText('Content 1')

    const section2Header = cy.findByText('Section 2')
    const section2Body = cy.findByText('Content 2')

    section1Header.should('be.visible')
    section1Body.should('exist')
    section2Header.should('be.visible')
    section2Body.should('exist')
  })
})
