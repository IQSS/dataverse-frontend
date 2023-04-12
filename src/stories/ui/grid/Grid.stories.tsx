import type { Meta, StoryObj } from '@storybook/react'
import { Container } from '../../../sections/ui/grid/Container'
import { WithI18next } from '../../WithI18next'
import { Col } from '../../../sections/ui/grid/Col'
import { Row } from '../../../sections/ui/grid/Row'

const meta: Meta<typeof Container> = {
  /* Grid system for the layout of the page
   * It is based on a 12-column system, using Bootstrap's grid system underneath.
   */
  tags: ['autodocs'],
  title: 'UI/Grid',
  component: Container,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof Container>

export const EqualWidth12Columns: Story = {
  render: () => (
    <Container>
      <Row>
        <Col>1 of 1</Col>
        <Col>1 of 2</Col>
        <Col>1 of 3</Col>
        <Col>1 of 4</Col>
        <Col>1 of 5</Col>
        <Col>1 of 6</Col>
        <Col>1 of 7</Col>
        <Col>1 of 8</Col>
        <Col>1 of 9</Col>
        <Col>1 of 10</Col>
        <Col>1 of 11</Col>
        <Col>1 of 12</Col>
      </Row>
    </Container>
  )
}

export const ColumnsWithDifferentWidths: Story = {
  render: () => (
    <Container>
      <Row>
        <Col>1 of 3</Col>
        <Col xs={6}>2 of 3 (wider)</Col>
        <Col>3 of 3</Col>
      </Row>
      <Row>
        <Col>1 of 3</Col>
        <Col xs={5}>2 of 3 (wider)</Col>
        <Col>3 of 3</Col>
      </Row>
    </Container>
  )
}

export const RowsWithDifferentWidths: Story = {
  render: () => (
    <Container>
      <Row xs={2} md={4} lg={6}>
        <Col>1 of 2</Col>
        <Col>2 of 2</Col>
      </Row>
      <Row xs={1} md={2}>
        <Col>1 of 3</Col>
        <Col>2 of 3</Col>
        <Col>3 of 3</Col>
      </Row>
      <Row>
        <Col>1 of 3</Col>
        <Col>2 of 3</Col>
        <Col>3 of 3</Col>
      </Row>
    </Container>
  )
}
