import { useContext, useRef } from 'react'
import { AuthContext } from 'react-oauth2-code-pkce'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Alert, Button, Col, Form, Stack } from '@iqss/dataverse-design-system'
import { UserRepository } from '@/users/domain/repositories/UserRepository'
import { Validator } from '@/shared/helpers/Validator'
import { type ValidTokenNotLinkedAccountFormData } from './types'
import { TermsOfUse } from '@/info/domain/models/TermsOfUse'
import { SubmissionStatus, useSubmitUser } from './useSubmitUser'
import styles from './FormFields.module.scss'

interface FormFieldsProps {
  userRepository: UserRepository
  formDefaultValues: ValidTokenNotLinkedAccountFormData
  termsOfUse: TermsOfUse
}

export const FormFields = ({ userRepository, formDefaultValues, termsOfUse }: FormFieldsProps) => {
  const { tokenData, logOut: oidcLogout } = useContext(AuthContext)
  const { t } = useTranslation('signUp')
  const { t: tShared } = useTranslation('shared')

  const formContainerRef = useRef<HTMLDivElement>(null)

  const isUsernameRequired = formDefaultValues.username === ''
  const isEmailRequired = formDefaultValues.emailAddress === ''
  const isFirstNameRequired = formDefaultValues.firstName === ''
  const isLastNameRequired = formDefaultValues.lastName === ''

  const form = useForm({
    mode: 'onChange',
    defaultValues: formDefaultValues
  })

  const { submissionStatus, submitError, submitForm } = useSubmitUser(
    userRepository,
    onSubmitUserError,
    tokenData
  )

  // If the user cancels the registration, we should logout the user and redirect to the home page.
  // This is to avoid sending the valid bearer token and receiving the same BEARER_TOKEN_IS_VALID_BUT_NOT_LINKED_MESSAGE error
  const handleCancel = () => oidcLogout()

  function onSubmitUserError() {
    if (formContainerRef.current) {
      formContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const userNameRules = {
    required: isUsernameRequired ? t('fields.username.required') : false,
    validate: (value: string) => {
      if (!Validator.isValidUsername(value)) {
        return t('fields.username.invalid')
      }
      return true
    }
  }

  const firstNameRules = {
    required: isFirstNameRequired ? t('fields.firstName.required') : false
  }

  const lastNameRules = {
    required: isLastNameRequired ? t('fields.lastName.required') : false
  }

  const emailRules = {
    required: isEmailRequired ? t('fields.emailAddress.required') : false,
    validate: (value: string) => {
      if (!Validator.isValidEmail(value)) {
        return t('fields.emailAddress.invalid')
      }
      return true
    }
  }

  const termsAcceptedRules = {
    validate: (value: boolean) => {
      if (!value) {
        return t('fields.termsAccepted.required')
      }
      return true
    }
  }

  const hasAcceptedTheTermsOfUse = form.watch('termsAccepted')

  const disableSubmitButton =
    !hasAcceptedTheTermsOfUse || submissionStatus === SubmissionStatus.IsSubmitting

  return (
    <div className={styles['form-container']} ref={formContainerRef}>
      {submissionStatus === SubmissionStatus.Errored && (
        <Alert variant={'danger'} dismissible={false}>
          {submitError}
        </Alert>
      )}

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(submitForm)}
          noValidate={true}
          data-testid="valid-token-not-linked-account-form">
          {/* USERNAME  */}
          <Form.Group controlId="username" className={styles['form-group']}>
            <Form.Group.Label message={t('fields.username.description')} column md={3}>
              {t('fields.username.label')}
            </Form.Group.Label>
            <Controller
              name="username"
              control={form.control}
              rules={userNameRules}
              render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
                <Col md={6}>
                  <Stack direction="vertical" gap={1}>
                    <Form.Group.Text>{t('fields.username.helperText')}</Form.Group.Text>
                    <div>
                      <Form.Group.Input
                        type="text"
                        value={value}
                        onChange={onChange}
                        isInvalid={invalid}
                        ref={ref}
                        disabled={!isUsernameRequired}
                        aria-required={isUsernameRequired}
                      />
                      <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
                    </div>
                  </Stack>
                </Col>
              )}
            />
          </Form.Group>

          {/* GIVEN NAME - firstName */}
          <Form.Group controlId="firstName" className={styles['form-group']}>
            <Form.Group.Label message={t('fields.firstName.description')} column md={3}>
              {t('fields.firstName.label')}
            </Form.Group.Label>
            <Controller
              name="firstName"
              control={form.control}
              rules={firstNameRules}
              render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
                <Col md={6}>
                  <Form.Group.Input
                    type="text"
                    value={value}
                    onChange={onChange}
                    isInvalid={invalid}
                    ref={ref}
                    disabled={!isFirstNameRequired}
                    aria-required={isFirstNameRequired}
                  />
                  <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
                </Col>
              )}
            />
          </Form.Group>

          {/* FAMILY NAME - lastName */}
          <Form.Group controlId="lastName" className={styles['form-group']}>
            <Form.Group.Label message={t('fields.lastName.description')} column md={3}>
              {t('fields.lastName.label')}
            </Form.Group.Label>
            <Controller
              name="lastName"
              control={form.control}
              rules={lastNameRules}
              render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
                <Col md={6}>
                  <Form.Group.Input
                    type="text"
                    value={value}
                    onChange={onChange}
                    isInvalid={invalid}
                    ref={ref}
                    disabled={!isLastNameRequired}
                    aria-required={isLastNameRequired}
                  />
                  <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
                </Col>
              )}
            />
          </Form.Group>

          {/* EMAIL */}
          <Form.Group controlId="emailAddress" className={styles['form-group']}>
            <Form.Group.Label message={t('fields.emailAddress.description')} column md={3}>
              {t('fields.emailAddress.label')}
            </Form.Group.Label>
            <Controller
              name="emailAddress"
              control={form.control}
              rules={emailRules}
              render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
                <Col md={6}>
                  <Form.Group.Input
                    type="text"
                    value={value}
                    onChange={onChange}
                    isInvalid={invalid}
                    ref={ref}
                    disabled={!isEmailRequired}
                    aria-required={isEmailRequired}
                  />
                  <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
                </Col>
              )}
            />
          </Form.Group>

          {/* AFFILIATION */}
          <Form.Group controlId="affiliation" className={styles['form-group']}>
            <Form.Group.Label message={t('fields.affiliation.description')} column md={3}>
              {t('fields.affiliation.label')}
            </Form.Group.Label>
            <Controller
              name="affiliation"
              control={form.control}
              render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
                <Col md={6}>
                  <Form.Group.Input
                    type="text"
                    value={value}
                    onChange={onChange}
                    isInvalid={invalid}
                    ref={ref}
                  />
                  <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
                </Col>
              )}
            />
          </Form.Group>

          {/* POSITION */}
          <Form.Group controlId="position" className={styles['form-group']}>
            <Form.Group.Label message={t('fields.position.description')} column md={3}>
              {t('fields.position.label')}
            </Form.Group.Label>
            <Controller
              name="position"
              control={form.control}
              render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
                <Col md={6}>
                  <Form.Group.Input
                    type="text"
                    value={value}
                    onChange={onChange}
                    isInvalid={invalid}
                    ref={ref}
                  />
                  <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
                </Col>
              )}
            />
          </Form.Group>

          {/* TERMS OF USE - termsAccepted */}
          <Form.Group className={styles['form-group']}>
            <Form.Group.Label message={t('fields.termsAccepted.description')} column md={3}>
              {t('fields.termsAccepted.primaryLabel')}
            </Form.Group.Label>
            <Controller
              name="termsAccepted"
              control={form.control}
              rules={termsAcceptedRules}
              render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
                <Col md={6}>
                  <Stack direction="vertical" gap={3}>
                    <div
                      className={styles['terms-of-use-wrapper']}
                      dangerouslySetInnerHTML={{
                        __html: termsOfUse ? termsOfUse : t('fields.termsAccepted.noTerms')
                      }}
                    />

                    <Form.Group.Checkbox
                      id="termsAccepted"
                      data-testid="termsAcceptedCheckbox"
                      onChange={onChange}
                      name="termsAccepted"
                      label={t('fields.termsAccepted.label')}
                      checked={value}
                      isInvalid={invalid}
                      invalidFeedback={error?.message}
                      ref={ref}
                    />
                  </Stack>
                </Col>
              )}
            />
          </Form.Group>

          <Stack direction="horizontal" gap={3}>
            <Button type="submit" disabled={disableSubmitButton}>
              {t('submit')}
            </Button>

            <Button onClick={handleCancel} type="button" variant="secondary">
              {tShared('cancel')}
            </Button>
          </Stack>
        </form>
      </FormProvider>
    </div>
  )
}
