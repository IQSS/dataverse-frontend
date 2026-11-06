import { Ref } from 'react'
import { useTranslation } from 'react-i18next'
import { Form } from '@iqss/dataverse-design-system'
import rorLogo from '@/assets/ror-icon-rgb.svg'
import styles from './AffiliationField.module.scss'

interface AffiliationFieldProps {
  value: string
  rorId: string
  isInvalid: boolean
  errorMessage?: string
  inputRef: Ref<HTMLInputElement>
  onChange: (value: string) => void
}

export const AffiliationField = ({
  value,
  rorId,
  isInvalid,
  errorMessage,
  inputRef,
  onChange
}: AffiliationFieldProps) => {
  const { t } = useTranslation('signUp')
  const rorLabel = t('fields.affiliation.rorLink', { rorId })

  return (
    <Form.InputGroup hasValidation className={styles['input-group']}>
      <Form.Group.Input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        isInvalid={isInvalid}
        ref={inputRef}
        autoComplete="organization"
      />
      {value && rorId && (
        <Form.InputGroup.Text>
          <a
            href={rorId}
            target="_blank"
            rel="noreferrer"
            title={rorLabel}
            aria-label={rorLabel}
            data-testid="affiliation-ror">
            <img src={rorLogo} alt="" className={styles['ror-logo']} />
          </a>
        </Form.InputGroup.Text>
      )}
      <Form.Group.Feedback type="invalid">{errorMessage}</Form.Group.Feedback>
    </Form.InputGroup>
  )
}
