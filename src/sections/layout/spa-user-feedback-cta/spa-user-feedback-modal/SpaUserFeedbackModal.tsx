import { Controller, FormProvider, UseControllerProps, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { SendFill } from 'react-bootstrap-icons'
import { toast } from 'react-toastify'
import { Alert, Button, Col, Form, Modal, Spinner, Stack } from '@iqss/dataverse-design-system'
import { ContactRepository } from '@/contact/domain/repositories/ContactRepository'
import { PAGE_OPTIONS, useGetDefaultPageOptionFromURL } from '../useGetDefaultPageOptionFromURL'
import { useSendFeedback } from '../useSendFeedback'

interface SpaUserFeedbackModalProps {
  contactRepository: ContactRepository
  showModal: boolean
  userEmail: string
  handleClose: () => void
}

export interface SpaUserFeedbackFormData {
  page: string
  feedback: string
  fromEmail: string
}

export const SpaUserFeedbackModal = ({
  contactRepository,
  showModal,
  userEmail,
  handleClose
}: SpaUserFeedbackModalProps) => {
  const { t } = useTranslation('shared')
  const defaultPageOption: string | undefined = useGetDefaultPageOptionFromURL()

  const { submitFeedback, isSendingFeedback, errorSendingFeedback } = useSendFeedback({
    contactRepository,
    onSuccessfulSend: () => {
      handleClose()
      formInstance.reset()
      toast.success(t('spaUserFeedback.success'))
    }
  })

  const formInstance = useForm<SpaUserFeedbackFormData>({
    mode: 'onChange',
    values: {
      page: defaultPageOption ?? '',
      feedback: '',
      fromEmail: userEmail
    }
  })

  const feedbackRules: UseControllerProps['rules'] = {
    required: t('spaUserFeedback.fields.feedback.required'),
    validate: (value: string) => {
      if (value.trim() === '') {
        return t('spaUserFeedback.fields.feedback.required')
      }

      return true
    },
    maxLength: {
      value: 255,
      message: t('spaUserFeedback.fields.feedback.maxLength', { maxLength: 255 })
    }
  }

  const onHideHandler = () => {
    handleClose()
    formInstance.reset()
  }

  return (
    <Modal
      show={showModal}
      onHide={isSendingFeedback ? () => {} : onHideHandler}
      size="lg"
      centered>
      <Modal.Header>
        <Modal.Title>{t('spaUserFeedback.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorSendingFeedback && !isSendingFeedback && (
          <Alert variant="danger">{errorSendingFeedback}</Alert>
        )}
        <FormProvider {...formInstance}>
          <form onSubmit={formInstance.handleSubmit(submitFeedback)} noValidate>
            {/* Page field */}
            <Controller
              name="page"
              render={({ field: { onChange, ref, value } }) => (
                <Form.Group as={Col}>
                  <Form.Group.Label>{t('spaUserFeedback.fields.page.label')}</Form.Group.Label>
                  <Form.Group.SelectAdvanced
                    options={Object.values(PAGE_OPTIONS)}
                    onChange={onChange}
                    defaultValue={value as string}
                    isMultiple={false}
                    inputButtonId="feedback-type"
                    isSearchable={false}
                    ref={ref}
                  />
                  <Form.Group.Text>{t('spaUserFeedback.fields.page.helpText')}</Form.Group.Text>
                </Form.Group>
              )}
            />
            {/* Feedback field */}
            <Controller
              name="feedback"
              rules={feedbackRules}
              render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
                <Form.Group controlId="user-feedback" as={Col}>
                  <Form.Group.Label required>
                    {t('spaUserFeedback.fields.feedback.label')}
                  </Form.Group.Label>
                  <Form.Group.TextArea
                    value={value as string}
                    onChange={onChange}
                    isInvalid={invalid}
                    placeholder={t('spaUserFeedback.fields.feedback.placeholder')}
                    aria-label={t('spaUserFeedback.fields.feedback.placeholder')}
                    ref={ref}
                  />
                  <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
                </Form.Group>
              )}
            />
          </form>
        </FormProvider>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={onHideHandler}
          type="button"
          disabled={isSendingFeedback}>
          {t('cancel')}
        </Button>
        <Button
          variant="primary"
          type="submit"
          onClick={formInstance.handleSubmit(submitFeedback)}
          disabled={isSendingFeedback}>
          <Stack direction="horizontal" gap={2}>
            <SendFill aria-hidden size={14} color="white" />
            <span>{t('send')}</span>
            {isSendingFeedback && <Spinner variant="light" animation="border" size="sm" />}
          </Stack>
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
