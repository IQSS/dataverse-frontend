import type { Meta, StoryObj } from '@storybook/react'
import { Col } from '../../components/grid/Col'
import { Container } from '../../components/grid/Container'
import { Row } from '../../components/grid/Row'

/**
 * ## Description
 * Grid system for the layout of the page
 * It is based on a 12-column system, using Bootstrap's grid system underneath.
 *
 * ## Usage guidelines
 *
 * Bootstrap provides a responsive, fluid, 12-column grid system that we use to organize our page layouts.
 *
 * We use the fixed-width Container component which provides responsive widths based on media queries for the page
 * layout, with a series of rows and columns for the content.
 *
 * The grid layout uses Col component for horizontal groups of columns, inside a Row containing component. Content
 * should be placed within columns, and only columns may be immediate children of rows.
 */
const meta: Meta<typeof Container> = {
  tags: ['autodocs'],
  title: 'Grid',
  component: Container
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

export const ColumnsWithOffset: Story = {
  render: () => (
    <Container>
      <Row>
        <Col md={4}>md=4</Col>
        <Col md={{ span: 4, offset: 4 }}>{`md={{ span: 4, offset: 4 }}`}</Col>
      </Row>
      <Row>
        <Col md={{ span: 3, offset: 3 }}>{`md={{ span: 3, offset: 3 }}`}</Col>
        <Col md={{ span: 3, offset: 3 }}>{`md={{ span: 3, offset: 3 }}`}</Col>
      </Row>
      <Row>
        <Col md={{ span: 6, offset: 3 }}>{`md={{ span: 6, offset: 3 }}`}</Col>
      </Row>
    </Container>
  )
}
