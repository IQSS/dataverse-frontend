import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Container, ContainerProps } from '../../../sections/ui/grid/container/Container'
import { Row } from '../../../sections/ui/grid/row/Row'
import { Col } from '../../../sections/ui/grid/col/Col'

export default {
  /* Grid system for the layout of the page
   * It is based on a 12-column system, using Bootstrap's grid system underneath.
   */
  title: 'UI/Grid',
  component: Container,
  parameters: {
    layout: 'fullscreen'
  }
} as ComponentMeta<typeof Container>

const Template: ComponentStory<typeof Container> = ({ children }: ContainerProps) => (
  <Container>{children}</Container>
)

export const EqualWidth12Columns = Template.bind({})

EqualWidth12Columns.args = {
  children: (
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
  )
}

export const ColumnsWithDifferentWidths = Template.bind({})

ColumnsWithDifferentWidths.args = {
  children: (
    <>
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
    </>
  )
}

export const RowsWithDifferentWidths = Template.bind({})

RowsWithDifferentWidths.args = {
  children: (
    <>
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
    </>
  )
}
