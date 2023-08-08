import { Col, Row, useTheme } from '@iqss/dataverse-design-system'
import { TailSpin } from 'react-loader-spinner'
import styles from './SpinnerSymbol.module.scss'
import { useTranslation } from 'react-i18next'

export function SpinnerSymbol() {
  const theme = useTheme()
  const { t } = useTranslation('files')
  return (
    <Row className={styles.container}>
      <Col md="auto">
        <TailSpin
          height="30"
          width="30"
          ariaLabel={t('filesLoading')}
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
