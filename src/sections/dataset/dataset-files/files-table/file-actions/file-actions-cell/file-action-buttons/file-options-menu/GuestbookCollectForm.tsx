import { useMemo } from 'react'
import { Col, DropdownButton, DropdownButtonItem, Form, Row } from '@iqss/dataverse-design-system'
import { Trans, useTranslation } from 'react-i18next'
import { Guestbook, GuestbookCustomQuestion } from '@/guestbooks/domain/models/Guestbook'
import { CustomTerms as CustomTermsModel, DatasetLicense } from '@/dataset/domain/models/Dataset'
import { Validator as validator } from '@/shared/helpers/Validator'
import { CustomTerms } from '@/sections/dataset/dataset-terms/CustomTerms'
import { QueryParamKey, Route } from '@/sections/Route.enum'
import styles from './DownloadWithTermsAndGuestbookModal.module.scss'

interface GuestbookCollectFormProps {
  license?: DatasetLicense
  customTerms?: CustomTermsModel
  datasetPersistentId?: string
  guestbook?: Guestbook
  formValues: Record<string, string>
  hasAttemptedAccept: boolean
  accountFieldErrors: Record<string, string | null>
  customQuestionErrors: Record<string, string | null>
  accountFieldKeys: string[]
  shouldLockIdentityFields: boolean
  isAccountFieldRequired: (fieldName: string) => boolean
  onFieldChange: (fieldName: string, value: string) => void
}

export const getGuestbookCustomQuestionFieldName = (
  question: GuestbookCustomQuestion,
  index: number
): string => `custom-question-${question.displayOrder}-${index}`

export const isGuestbookCollectFormEmailValid = (email: string): boolean =>
  validator.isValidEmail(email)

export function GuestbookCollectForm({
  license,
  customTerms,
  datasetPersistentId,
  guestbook,
  formValues,
  hasAttemptedAccept,
  accountFieldErrors,
  customQuestionErrors,
  accountFieldKeys,
  shouldLockIdentityFields,
  isAccountFieldRequired,
  onFieldChange
}: GuestbookCollectFormProps) {
  const { t: tFiles } = useTranslation('files')
  const { t: tDataset } = useTranslation('dataset')
  const { t: tGuestbooks } = useTranslation('guestbooks')

  const customQuestions = useMemo(
    () => (guestbook?.customQuestions ?? []).filter((question) => !question.hidden),
    [guestbook?.customQuestions]
  )
  const customTermsHref = datasetPersistentId
    ? `/spa${Route.DATASETS}?${QueryParamKey.PERSISTENT_ID}=${encodeURIComponent(
        datasetPersistentId
      )}&${QueryParamKey.TAB}=terms&termsTab=guestbook`
    : undefined

  const renderCustomQuestionField = (question: GuestbookCustomQuestion, index: number) => {
    const fieldName = getGuestbookCustomQuestionFieldName(question, index)
    const value = formValues[fieldName] ?? ''
    const isRequired = question.required
    const invalid = hasAttemptedAccept && customQuestionErrors[fieldName] !== null

    if (question.type === 'textarea') {
      return (
        <>
          <Form.Group.TextArea
            value={value}
            onChange={(event) =>
              onFieldChange(fieldName, (event.target as HTMLTextAreaElement).value)
            }
            isInvalid={invalid}
            aria-required={isRequired}
            rows={3}
          />
          <Form.Group.Feedback type="invalid">
            {invalid ? customQuestionErrors[fieldName] : undefined}
          </Form.Group.Feedback>
        </>
      )
    }

    if (question.type === 'options') {
      return (
        <>
          <DropdownButton
            id={fieldName}
            title={value || 'Select...'}
            onSelect={(eventKey) => onFieldChange(fieldName, eventKey ?? '')}
            variant="secondary"
            aria-required={isRequired}>
            <DropdownButtonItem eventKey="">Select...</DropdownButtonItem>
            {(question.optionValues ?? []).map((option) => (
              <DropdownButtonItem
                key={`${fieldName}-${option.displayOrder}`}
                eventKey={option.value}>
                {option.value}
              </DropdownButtonItem>
            ))}
          </DropdownButton>
          <Form.Group.Feedback type="invalid" style={{ display: invalid ? 'block' : 'none' }}>
            {invalid ? customQuestionErrors[fieldName] : undefined}
          </Form.Group.Feedback>
        </>
      )
    }

    return (
      <>
        <Form.Group.Input
          type="text"
          value={value}
          onChange={(event) => onFieldChange(fieldName, (event.target as HTMLInputElement).value)}
          isInvalid={invalid}
          aria-required={isRequired}
        />
        <Form.Group.Feedback type="invalid">
          {invalid ? customQuestionErrors[fieldName] : undefined}
        </Form.Group.Feedback>
      </>
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
          {!license && customTerms && (
            <span>
              {customTermsHref ? (
                <a href={customTermsHref}>{tDataset('customTerms.title')}</a>
              ) : (
                tDataset('customTerms.title')
              )}{' '}
              - {tDataset('customTerms.description')}
            </span>
          )}
        </Col>
      </Form.Group>
      <CustomTerms customTerms={customTerms} />

      {guestbook && (
        <>
          {accountFieldKeys.map((accountFieldKey) => {
            const fieldLabel = tGuestbooks(`create.fields.dataCollected.options.${accountFieldKey}`)
            const isRequired = isAccountFieldRequired(accountFieldKey)
            const isIdentityField = accountFieldKey === 'name' || accountFieldKey === 'email'
            const shouldDisableInput = shouldLockIdentityFields && isIdentityField
            const invalid = hasAttemptedAccept && accountFieldErrors[accountFieldKey] !== null

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
                    isInvalid={invalid}
                    disabled={shouldDisableInput}
                    aria-required={isRequired}
                  />
                  <Form.Group.Feedback type="invalid">
                    {invalid ? accountFieldErrors[accountFieldKey] : undefined}
                  </Form.Group.Feedback>
                </Col>
              </Form.Group>
            )
          })}

          {customQuestions.length > 0 && (
            <Form.Group as={Row} className={styles['form-row']}>
              <Col sm={3}>
                <Form.Group.Label className={styles['row-label']}>
                  {tFiles('actions.optionsMenu.guestbookCollectModal.additionalQuestions')}
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
        </>
      )}
    </Form>
  )
}
