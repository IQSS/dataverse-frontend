import { Col, Row, useTheme } from 'dataverse-design-system'
import { TailSpin } from 'react-loader-spinner'

export function SpinnerSymbol() {
  const theme = useTheme()
  return (
    <Row className="justify-content-md-center">
      <Col md="auto">
        <TailSpin
          height="30"
          width="30"
          ariaLabel="tail-spin-loading"
          color={theme.color.primary}
          radius="1"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </Col>
    </Row>
  )
}
