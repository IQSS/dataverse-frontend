import { useMemo } from 'react'
import { Col, Form, Row } from '@iqss/dataverse-design-system'
import { Trans, useTranslation } from 'react-i18next'
import { Guestbook, GuestbookCustomQuestion } from '@/guestbooks/domain/models/Guestbook'
import { DatasetLicense } from '@/dataset/domain/models/Dataset'
import { Validator as validator } from '@/shared/helpers/Validator'
import styles from './GuestbookAppliedModal.module.scss'

interface GuestbookAppliedFormProps {
  license?: DatasetLicense
  guestbook?: Guestbook
  formValues: Record<string, string>
  hasAttemptedAccept: boolean
  accountFieldErrors: Record<string, string | null>
  accountFieldKeys: string[]
  isAccountFieldRequired: (fieldName: string) => boolean
  onFieldChange: (fieldName: string, value: string) => void
}

export const getGuestbookCustomQuestionFieldName = (
  question: GuestbookCustomQuestion,
  index: number
): string => `custom-question-${question.displayOrder}-${index}`

export const isGuestbookAppliedFormEmailValid = (email: string): boolean =>
  validator.isValidEmail(email)

export function GuestbookAppliedForm({
  license,
  guestbook,
  formValues,
  hasAttemptedAccept,
  accountFieldErrors,
  accountFieldKeys,
  isAccountFieldRequired,
  onFieldChange
}: GuestbookAppliedFormProps) {
  const { t: tFiles } = useTranslation('files')
  const { t: tDataset } = useTranslation('dataset')
  const { t: tGuestbooks } = useTranslation('guestbooks')

  const customQuestions = useMemo(
    () =>
      (guestbook?.customQuestions ?? [])
        .filter((question) => !question.hidden)
        .sort((first, second) => first.displayOrder - second.displayOrder),
    [guestbook?.customQuestions]
  )

  const renderCustomQuestionField = (question: GuestbookCustomQuestion, index: number) => {
    const fieldName = getGuestbookCustomQuestionFieldName(question, index)
    const value = formValues[fieldName] ?? ''
    const isRequired = question.required

    if (question.type === 'textarea') {
      return (
        <Form.Group.TextArea
          value={value}
          onChange={(event) =>
            onFieldChange(fieldName, (event.target as HTMLTextAreaElement).value)
          }
          aria-required={isRequired}
          rows={3}
        />
      )
    }

    if (question.type === 'options') {
      const sortedOptionValues = [...(question.optionValues ?? [])].sort(
        (first, second) => first.displayOrder - second.displayOrder
      )

      return (
        <Form.Group.Select
          value={value}
          onChange={(event) => onFieldChange(fieldName, (event.target as HTMLSelectElement).value)}
          aria-required={isRequired}>
          <option value="" />
          {sortedOptionValues.map((option) => (
            <option key={`${fieldName}-${option.displayOrder}`} value={option.value}>
              {option.value}
            </option>
          ))}
        </Form.Group.Select>
      )
    }

    return (
      <Form.Group.Input
        type="text"
        value={value}
        onChange={(event) => onFieldChange(fieldName, (event.target as HTMLInputElement).value)}
        aria-required={isRequired}
      />
    )
  }

  return (
    <Form>
      <Form.Group as={Row} className={styles['form-row']}>
        <Col sm={3}>
          <Form.Group.Label className={styles['row-label']}>
            {tDataset('license.title')}
          </Form.Group.Label>
        </Col>
        <Col sm={9}>
          <p className={styles['community-norms-text']}>
            <Trans
              t={tDataset}
              i18nKey="termsTab.licenseHelpText"
              components={{
                anchor: (
                  <a
                    href="https://dataverse.org/best-practices/dataverse-community-norms"
                    target="_blank"
                    rel="noreferrer"
                  />
                )
              }}
            />
          </p>
          {license?.iconUri && (
            <img
              alt={`${tDataset('license.altTextPrefix')}${license.name}`}
              src={license.iconUri}
              title={license.name}
              className={styles['license-icon']}
            />
          )}
          {license && (
            <a href={license.uri} target="_blank" rel="noreferrer">
              {license.name}
            </a>
          )}
        </Col>
      </Form.Group>

      {accountFieldKeys.map((accountFieldKey) => {
        const fieldLabel = tGuestbooks(`create.fields.dataCollected.options.${accountFieldKey}`)
        const isRequired = isAccountFieldRequired(accountFieldKey)
        const hasError =
          (hasAttemptedAccept || accountFieldKey === 'email') &&
          accountFieldErrors[accountFieldKey] !== null

        return (
          <Form.Group
            key={accountFieldKey}
            as={Row}
            className={styles['form-row']}
            controlId={`guestbook-${accountFieldKey}`}>
            <Col sm={3}>
              <Form.Group.Label className={styles['row-label']}>
                {fieldLabel}
                {isRequired && <span className={styles.required}>*</span>}
              </Form.Group.Label>
            </Col>
            <Col sm={9}>
              <Form.Group.Input
                type="text"
                value={formValues[accountFieldKey] ?? ''}
                onChange={(event) =>
                  onFieldChange(accountFieldKey, (event.target as HTMLInputElement).value)
                }
                isInvalid={hasError}
                aria-required={isRequired}
              />
              {hasError && (
                <Form.Group.Feedback type="invalid">
                  {accountFieldErrors[accountFieldKey]}
                </Form.Group.Feedback>
              )}
            </Col>
          </Form.Group>
        )
      })}

      {customQuestions.length > 0 && (
        <Form.Group as={Row} className={styles['form-row']}>
          <Col sm={3}>
            <Form.Group.Label className={styles['row-label']}>
              {tFiles('actions.optionsMenu.guestbookAppliedModal.additionalQuestions')}
            </Form.Group.Label>
          </Col>
          <Col sm={9} className={styles['question-list']}>
            {customQuestions.map((question, index) => (
              <div
                key={`${question.question}-${question.displayOrder}-${index}`}
                className={styles['question-item']}>
                <label className={styles['question-label']}>
                  {question.question}
                  {question.required && <span className={styles.required}>*</span>}
                </label>
                {renderCustomQuestionField(question, index)}
              </div>
            ))}
          </Col>
        </Form.Group>
      )}
    </Form>
  )
}
