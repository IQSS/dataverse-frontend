import { PropsWithChildren } from 'react'
import { Form as FormBS } from 'react-bootstrap'
import { Col } from '../../../grid/Col'

interface FormTextProps {
  withinMultipleFieldsGroup?: boolean
}

export function FormText({
  withinMultipleFieldsGroup,
  children
}: PropsWithChildren<FormTextProps>) {
  const Layout = ({ children }: PropsWithChildren) => {
    return withinMultipleFieldsGroup ? (
      <>{children}</>
    ) : (
      <Col sm={{ offset: 3, span: 9 }} className="mt-2">
        {children}
      </Col>
    )
  }

  return (
    <Layout>
      <FormBS.Text muted>{children}</FormBS.Text>
    </Layout>
  )
}
