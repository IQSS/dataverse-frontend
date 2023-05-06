import { render, screen } from '@testing-library/react'
import { Accordion } from '../../../../src/sections/ui/accordion/Accordion'

describe('Accordion', () => {
  test('renders an accordion with defaultActiveKey prop and children', () => {
    render(
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

    const section1Header = screen.getByText('Section 1')
    const section1Body = screen.getByText('Content 1')

    const section2Header = screen.getByText('Section 2')
    const section2Body = screen.getByText('Content 2')

    expect(section1Header).toBeInTheDocument()
    expect(section1Body).toBeInTheDocument()
    expect(section2Header).toBeInTheDocument()
    expect(section2Body).toBeInTheDocument()
  })
})
