import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Container, ContainerProps } from '../../../sections/ui/grid/Container'
import { Col, Row } from 'react-bootstrap'

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
      <Col>1 of 1</Col>
      <Col>1 of 1</Col>
      <Col>1 of 1</Col>
      <Col>1 of 1</Col>
      <Col>1 of 1</Col>
      <Col>1 of 1</Col>
      <Col>1 of 1</Col>
      <Col>1 of 1</Col>
      <Col>1 of 1</Col>
      <Col>1 of 1</Col>
      <Col>1 of 1</Col>
    </Row>
  )
}
