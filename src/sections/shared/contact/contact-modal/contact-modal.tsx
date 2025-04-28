import { useTranslation } from 'react-i18next'
import { useForm, FormProvider } from 'react-hook-form'
import { Alert, Button, Modal, Spinner } from '@iqss/dataverse-design-system'
import { FeedbackDTO } from '@/contact/domain/useCases/DTOs/FeedbackDTO'
import { ContactForm } from '@/sections/shared/form/ContactForm/ContactForm'
import { useSession } from '@/sections/session/SessionContext'
import { useSendFeedbacktoOwners } from '@/sections/shared/form/ContactForm/useSendFeedbacktoOwners'
import { ContactRepository } from '@/contact/domain/repositories/ContactRepository'
import { toast } from 'react-toastify'

interface ContactModalProps {
  show: boolean
  handleClose: () => void
  title: string
  toContactName: string
  id: string | number
  contactRepository: ContactRepository
}

export type ContactFormData = {
  id: string | number
  subject: string
  body: string
  fromEmail: string
  captchaInput: string
}

export const ContactModal = ({
  show,
  title,
  handleClose,
  toContactName,
  id,
  contactRepository
}: ContactModalProps) => {
  const { t } = useTranslation('shared')
  const { user } = useSession()

  const closeModalAndSentToast = () => {
    handleClose()
    toast.success(t('contact.contactSuccess'))
  }

  const { submitForm, isSubmittingForm, submitError } = useSendFeedbacktoOwners({
    contactRepository,
    onSuccessfulSubmit: closeModalAndSentToast
  })

  const formMethods = useForm<ContactFormData>({
    defaultValues: {
      id: id,
      subject: '',
      body: '',
      fromEmail: user?.email ?? '',
      captchaInput: ''
    }
  })

  const onSubmit = async (data: ContactFormData) => {
    const formData: FeedbackDTO = {
      subject: data.subject,
      body: data.body,
      fromEmail: data.fromEmail,
      ...(typeof data.id === 'string' ? { identifier: data.id } : { targetId: data.id })
    }

    await submitForm(formData)
    formMethods.reset()
  }

  return (
    <Modal
      show={show}
      onHide={() => {
        handleClose()
        formMethods.reset()
      }}
      centered>
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {submitError && (
          <Alert variant="danger" dismissible={false}>
            {submitError}
          </Alert>
        )}
        <FormProvider {...formMethods}>
          <form onSubmit={formMethods.handleSubmit(onSubmit)}>
            <ContactForm isLoggedIn={Boolean(user)} toContactName={toContactName} />
          </form>
        </FormProvider>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" type="button" disabled={isSubmittingForm} onClick={handleClose}>
          {t('close')}
        </Button>
        <Button
          type="submit"
          onClick={formMethods.handleSubmit(onSubmit)}
          disabled={isSubmittingForm}>
          {isSubmittingForm && <Spinner variant="light" animation="border" size="sm" />
            ? t('Submitting')
            : t('Submit')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
