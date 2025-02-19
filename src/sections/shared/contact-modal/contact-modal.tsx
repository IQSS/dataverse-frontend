import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Button, Modal } from '@iqss/dataverse-design-system'
import { ContactForm } from '@/sections/shared/form/ContactForm/ContactForm'
import {
  useSubmitContact,
  SubmissionStatus
} from '@/sections/shared/form/ContactForm/useSubmitContact'
import { ContactJSDataverseRepository } from '@/contact/infrastructure/ContactJSDataverseRepository'
import { useForm, FormProvider } from 'react-hook-form'
import { ContactDTO } from '@/contact/domain/useCases/ContactDTO'
import { Captcha } from '../form/ContactForm/ContactCaptcha'
import { useSession } from '@/sections/session/SessionContext'

interface ContactModalProps {
  show: boolean
  handleClose: () => void
  title: string
  onSuccess: () => void
  toContactName?: string
}

export type ContactFormData = {
  identifier?: string
  subject: string
  body: string
  fromEmail: string
}

export const ContactModal = ({
  show,
  title,
  handleClose,
  onSuccess,
  toContactName
}: ContactModalProps) => {
  const { t } = useTranslation('shared')
  const { user } = useSession()

  //todo: MOVE it to factory
  const contactRepository = useMemo(() => new ContactJSDataverseRepository(), [])

  const { submitForm, submissionStatus, submitError } = useSubmitContact(contactRepository)

  const methods = useForm<ContactFormData>({
    defaultValues: {
      subject: '',
      body: '',
      fromEmail: user?.email || ''
    }
  })

  const { reset } = methods

  const onSubmit = async (data: ContactDTO) => {
    await submitForm(data)
    onSuccess()
    reset()
  }

  useEffect(() => {
    if (submissionStatus === SubmissionStatus.SubmitComplete) handleClose()
  }, [submissionStatus])

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {submissionStatus === SubmissionStatus.Errored && (
          <Alert variant="danger" dismissible={false}>
            {submitError}
          </Alert>
        )}
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <ContactForm isLoggedIn={Boolean(user)} toContactName={toContactName} />
          </form>
          <Captcha />
        </FormProvider>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          type="button"
          disabled={submissionStatus === SubmissionStatus.IsSubmitting}
          onClick={handleClose}>
          {t('close')}
        </Button>
        <Button
          type="submit"
          onClick={methods.handleSubmit(onSubmit)}
          disabled={
            !methods.formState.isValid || submissionStatus === SubmissionStatus.IsSubmitting
          }>
          {submissionStatus === SubmissionStatus.IsSubmitting ? t('submitting') : t('submit')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
