import { axiosInstance } from '@/axiosInstance'
import { AxiosError } from 'axios'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Button, Col, Form, Stack } from '@iqss/dataverse-design-system'
import { TTokenData } from 'react-oauth2-code-pkce/dist/types'
import { ValidTokenNotLinkedAccountFormData } from './types'
import styles from './FormFields.module.scss'
import { useNavigate } from 'react-router-dom'
import { Validator } from '@/shared/helpers/Validator'
import { ValidTokenNotLinkedAccountFormHelper } from './ValidTokenNotLinkedAccountFormHelper'

interface FormFieldsProps {
  formDefaultValues: ValidTokenNotLinkedAccountFormData
  tokenData: TTokenData | undefined
}

export const FormFields = ({ formDefaultValues, tokenData }: FormFieldsProps) => {
  const navigate = useNavigate()
  const { t } = useTranslation('signUp')
  const { t: tShared } = useTranslation('shared')

  // TODO:ME - We will need an api call to get the terms of use of the installation
  const hasTermsOfUse = false

  const isUsernameRequired = formDefaultValues.username === ''
  const isEmailRequired = formDefaultValues.emailAddress === ''
  const isFirstNameRequired = formDefaultValues.firstName === ''
  const isLastNameRequired = formDefaultValues.lastName === ''

  const form = useForm({
    mode: 'onChange',
    defaultValues: formDefaultValues
  })

  const submitForm = (formData: ValidTokenNotLinkedAccountFormData) => {
    // We wont send properties that are already present in the tokenData, those are the disabled/readonly fields
    const registrationDTO = ValidTokenNotLinkedAccountFormHelper.defineRegistrationDTOProperties(
      formDefaultValues,
      formData,
      tokenData
    )

    console.log({ registrationDTO })
    // curl -H "Authorization: Bearer $TOKEN" -X POST http://localhost:8080/api/users/register --data '{"termsAccepted":true}'
    axiosInstance
      .post('/api/users/register', registrationDTO)
      .then((response) => {
        console.log({ response })

        // TODO:ME - Enforce the SessionProvider to make a new call to get the user now and navigate to the root collection
      })
      .catch((error: AxiosError) => {
        console.error({ error })
      })
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

  return (
    <div>
      <div className={styles['about-prefilled-fields-wrapper']}>
        <Form.Group.Text>{t('aboutPrefilledFields')}</Form.Group.Text>
      </div>

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
                    <Form.Group.TextArea
                      rows={hasTermsOfUse ? 3 : 1}
                      disabled
                      value={t('fields.termsAccepted.noTerms')}
                    />

                    <Form.Group.Checkbox
                      id="termsAccepted"
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
            <Button type="submit" disabled={!hasAcceptedTheTermsOfUse}>
              {t('submit')}
            </Button>

            <Button onClick={() => navigate('/')} type="button" variant="secondary">
              {tShared('cancel')}
            </Button>
          </Stack>
        </form>
      </FormProvider>
    </div>
  )
}
