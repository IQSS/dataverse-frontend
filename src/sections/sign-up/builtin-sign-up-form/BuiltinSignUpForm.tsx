import { useRef } from 'react'
import { Controller, FormProvider, RegisterOptions, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Alert, Button, Col, Form, Stack } from '@iqss/dataverse-design-system'
import { DataverseInfoRepository } from '@/info/domain/repositories/DataverseInfoRepository'
import { useGetTermsOfUse } from '@/shared/hooks/useGetTermsOfUse'
import { useUserRepositories } from '@/shared/contexts/repositories/RepositoriesProvider'
import { Validator } from '@/shared/helpers/Validator'
import { FormFieldsSkeleton } from '../valid-token-not-linked-account-form/FormFieldsSkeleton'
import { SignUpStatus, useSignUp } from './useSignUp'
import { SignUpSuccess } from './SignUpSuccess'
import styles from '../valid-token-not-linked-account-form/FormFields.module.scss'

export interface BuiltinSignUpFormData {
  username: string
  firstName: string
  lastName: string
  emailAddress: string
  password: string
  confirmPassword: string
  affiliation: string
  position: string
  termsAccepted: boolean
}

type TextFieldName = Exclude<keyof BuiltinSignUpFormData, 'termsAccepted'>

const DEFAULT_VALUES: BuiltinSignUpFormData = {
  username: '',
  firstName: '',
  lastName: '',
  emailAddress: '',
  password: '',
  confirmPassword: '',
  affiliation: '',
  position: '',
  termsAccepted: false
}

const MAX_LENGTH = 255

interface BuiltinSignUpFormProps {
  dataverseInfoRepository: DataverseInfoRepository
}

export const BuiltinSignUpForm = ({ dataverseInfoRepository }: BuiltinSignUpFormProps) => {
  const { t } = useTranslation('signUp')
  const { userRepository } = useUserRepositories()
  const formContainerRef = useRef<HTMLDivElement>(null)
  const {
    termsOfUse,
    isLoading: isLoadingTermsOfUse,
    error: errorTermsOfUse
  } = useGetTermsOfUse(dataverseInfoRepository)

  const form = useForm<BuiltinSignUpFormData>({ mode: 'onChange', defaultValues: DEFAULT_VALUES })

  const { status, result, submitError, submit } = useSignUp(
    userRepository,
    (fieldErrors) => {
      Object.entries(fieldErrors).forEach(([field, message]) => {
        if (field in DEFAULT_VALUES) {
          form.setError(field as keyof BuiltinSignUpFormData, { type: 'server', message })
        }
      })
    },
    () => formContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  )

  if (isLoadingTermsOfUse) {
    return <FormFieldsSkeleton />
  }

  if (errorTermsOfUse) {
    return <Alert variant="danger">{errorTermsOfUse}</Alert>
  }

  if (status === SignUpStatus.Succeeded && result) {
    return <SignUpSuccess result={result} />
  }

  const maxLengthRule = (field: string) => ({
    value: MAX_LENGTH,
    message: t(`fields.${field}.invalid.maxLength`, { maxLength: MAX_LENGTH })
  })

  const rules: Record<TextFieldName, RegisterOptions<BuiltinSignUpFormData, TextFieldName>> = {
    username: {
      required: t('fields.username.required'),
      validate: (value) =>
        Validator.isValidUsername(String(value)) || t('fields.username.invalid.username')
    },
    firstName: {
      required: t('fields.firstName.required'),
      maxLength: maxLengthRule('firstName')
    },
    lastName: {
      required: t('fields.lastName.required'),
      maxLength: maxLengthRule('lastName')
    },
    emailAddress: {
      required: t('fields.emailAddress.required'),
      validate: (value) =>
        Validator.isValidEmail(String(value)) || t('fields.emailAddress.invalid.email'),
      maxLength: maxLengthRule('emailAddress')
    },
    password: {
      required: t('fields.password.required')
    },
    confirmPassword: {
      required: t('fields.confirmPassword.required'),
      validate: (value, formValues) =>
        value === formValues.password || t('fields.confirmPassword.mismatch')
    },
    affiliation: { maxLength: maxLengthRule('affiliation') },
    position: { maxLength: maxLengthRule('position') }
  }

  const textFields: {
    name: TextFieldName
    type: 'text' | 'email' | 'password'
    autoComplete: string
  }[] = [
    { name: 'username', type: 'text', autoComplete: 'username' },
    { name: 'firstName', type: 'text', autoComplete: 'given-name' },
    { name: 'lastName', type: 'text', autoComplete: 'family-name' },
    { name: 'emailAddress', type: 'email', autoComplete: 'email' },
    { name: 'password', type: 'password', autoComplete: 'new-password' },
    { name: 'confirmPassword', type: 'password', autoComplete: 'new-password' },
    { name: 'affiliation', type: 'text', autoComplete: 'organization' },
    { name: 'position', type: 'text', autoComplete: 'organization-title' }
  ]

  const onSubmit = (formData: BuiltinSignUpFormData) =>
    submit({
      username: formData.username,
      firstName: formData.firstName,
      lastName: formData.lastName,
      emailAddress: formData.emailAddress,
      password: formData.password,
      affiliation: formData.affiliation || undefined,
      position: formData.position || undefined,
      termsAccepted: formData.termsAccepted
    })

  const isSubmitting = status === SignUpStatus.IsSubmitting
  const hasAcceptedTheTermsOfUse = form.watch('termsAccepted')

  return (
    <div className={styles['form-container']} ref={formContainerRef}>
      {status === SignUpStatus.Errored && submitError && (
        <Alert variant="danger" dismissible={false}>
          {submitError}
        </Alert>
      )}

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate={true}
          data-testid="builtin-sign-up-form">
          {textFields.map(({ name, type, autoComplete }) => (
            <Form.Group key={name} controlId={name} className={styles['form-group']}>
              <Form.Group.Label
                message={t(`fields.${name}.description`)}
                required={Boolean(rules[name].required)}
                column
                md={3}>
                {t(`fields.${name}.label`)}
              </Form.Group.Label>
              <Controller
                name={name}
                control={form.control}
                rules={rules[name]}
                render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
                  <Col md={6}>
                    <Stack direction="vertical" gap={1}>
                      {name === 'username' && (
                        <Form.Group.Text>{t('fields.username.helperText')}</Form.Group.Text>
                      )}
                      <div>
                        <Form.Group.Input
                          type={type}
                          value={value}
                          onChange={onChange}
                          isInvalid={invalid}
                          ref={ref}
                          autoComplete={autoComplete}
                          aria-required={Boolean(rules[name].required)}
                        />
                        <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
                      </div>
                    </Stack>
                  </Col>
                )}
              />
            </Form.Group>
          ))}

          <Form.Group className={styles['form-group']}>
            <Form.Group.Label message={t('fields.termsAccepted.description')} column md={3}>
              {t('fields.termsAccepted.primaryLabel')}
            </Form.Group.Label>
            <Controller
              name="termsAccepted"
              control={form.control}
              rules={{ validate: (value) => Boolean(value) || t('fields.termsAccepted.required') }}
              render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
                <Col md={6}>
                  <Stack direction="vertical" gap={3}>
                    <div
                      className={styles['terms-of-use-wrapper']}
                      dangerouslySetInnerHTML={{ __html: termsOfUse }}
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

          <Button type="submit" disabled={!hasAcceptedTheTermsOfUse || isSubmitting}>
            {t('submit')}
          </Button>
        </form>
      </FormProvider>
    </div>
  )
}
