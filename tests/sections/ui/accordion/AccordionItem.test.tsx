import { render, screen } from '@testing-library/react'
import { Accordion } from '../../../../src/sections/ui/accordion/Accordion'

describe('AccordionItem', () => {
  test('renders an accordion item with eventKey and children', () => {
    render(
      <Accordion.Item eventKey="1">
        <Accordion.Header>Section 1</Accordion.Header>
        <Accordion.Body>Content 1</Accordion.Body>
      </Accordion.Item>
    )

    const sectionHeader = screen.getByText('Section 1')
    const sectionBody = screen.getByText('Content 1')

    expect(sectionHeader).toBeInTheDocument()
    expect(sectionBody).toBeInTheDocument()
  })
})
