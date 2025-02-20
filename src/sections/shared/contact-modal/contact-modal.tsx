import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm, FormProvider } from 'react-hook-form'
import { Alert, Button, Modal } from '@iqss/dataverse-design-system'
import { ContactRepositoryFactory } from '@/sections/contact/contactFactory'
import { ContactDTO } from '@/contact/domain/useCases/ContactDTO'
import { Captcha } from '@/sections/shared/form/ContactForm/ContactCaptcha'
import { ContactForm } from '@/sections/shared/form/ContactForm/ContactForm'
import { useSession } from '@/sections/session/SessionContext'
import {
  useSubmitContact,
  SubmissionStatus
} from '@/sections/shared/form/ContactForm/useSubmitContact'

interface ContactModalProps {
  show: boolean
  handleClose: () => void
  title: string
  onSuccess: () => void
  toContactName: string
  id: string | number
}

export type ContactFormData = {
  id: string | number
  subject: string
  body: string
  fromEmail: string
}

export const ContactModal = ({
  show,
  title,
  handleClose,
  onSuccess,
  toContactName,
  id
}: ContactModalProps) => {
  const { t } = useTranslation('shared')
  const { user } = useSession()

  const contactRepository = ContactRepositoryFactory.create()

  const { submitForm, submissionStatus, submitError } = useSubmitContact(contactRepository)

  const methods = useForm<ContactFormData>({
    defaultValues: {
      id: id,
      subject: '',
      body: '',
      fromEmail: user?.email || ''
    }
  })

  const { reset } = methods

  const onSubmit = async (data: ContactFormData) => {
    const formData: ContactDTO = {
      subject: data.subject,
      body: data.body,
      fromEmail: data.fromEmail,
      ...(typeof data.id === 'string' ? { identifier: data.id } : { targetId: data.id })
    }

    await submitForm(formData)
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
          disabled={submissionStatus === SubmissionStatus.IsSubmitting}>
          {submissionStatus === SubmissionStatus.IsSubmitting ? t('submitting') : t('submit')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
