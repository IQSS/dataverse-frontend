import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Container, ContainerProps } from '../../../sections/ui/grid/container/Container'
import { Row } from '../../../sections/ui/grid/row/Row'
import { Col } from '../../../sections/ui/grid/col/Col'

export default {
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
