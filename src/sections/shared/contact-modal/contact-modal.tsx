import { useEffect, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Button, Modal } from '@iqss/dataverse-design-system'
import { ContactForm } from '@/sections/shared/form/ContactForm/ContactForm'
import {
  useSubmitContact,
  SubmissionStatus,
  ContactFormData
} from '@/sections/shared/form/ContactForm/useSubmitContact'
import { ContactJSDataverseRepository } from '@/contact/infrastructure/ContactJSDataverseRepository'
import { useForm, FormProvider } from 'react-hook-form'
import { useParams } from 'react-router-dom'

interface ContactModalProps {
  show: boolean
  handleClose: () => void
  title: string
  onSuccess: () => void
}
export const ContactModal = ({ show, title, handleClose, onSuccess }: ContactModalProps) => {
  const { t } = useTranslation('shared')
  const { collectionId } = useParams<{ collectionId: string }>()
  const contactRepository = useMemo(() => new ContactJSDataverseRepository(), [])
  const { submitForm, submissionStatus } = useSubmitContact(contactRepository)
  const [collectionName, setCollectionName] = useState<string>('Root')
  const [userEmail, setUserEmail] = useState<string>('')
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

  const [num1, setNum1] = useState(0)
  const [num2, setNum2] = useState(0)
  const [captchaAnswer, setCaptchaAnswer] = useState(0)

  useEffect(() => {
    const generateQuestion = () => {
      const randomNum1 = Math.floor(Math.random() * 10) + 1
      const randomNum2 = Math.floor(Math.random() * 10) + 1
      setNum1(randomNum1)
      setNum2(randomNum2)
      setCaptchaAnswer(randomNum1 + randomNum2)
    }

    if (show) {
      generateQuestion()
    }
  }, [show])

  useEffect(() => {
    const handleGetUserEmail = async () => {
      const userEmail = await contactRepository.getEmail()
      userEmail && setUserEmail(userEmail)
      userEmail && setIsLoggedIn(true)
    }
    void handleGetUserEmail()
  }, [contactRepository])

  useEffect(() => {
    const handleGetCollectionName = async (collectionAlias: string) => {
      const name = await contactRepository.getCollectionName(collectionAlias)
      setCollectionName(name)
    }

    void handleGetCollectionName(collectionId ?? '')
  }, [collectionId, collectionName, contactRepository])

  const methods = useForm<ContactFormData>({
    defaultValues: {
      subject: '',
      body: '',
      fromEmail: userEmail
    }
  })

  const { reset } = methods
  const onSubmit = async (data: ContactFormData) => {
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
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            {submissionStatus === SubmissionStatus.Errored && (
              <Alert variant="danger">{submissionStatus}</Alert>
            )}
            <ContactForm
              isLoggedIn={isLoggedIn}
              fromEmail={userEmail}
              collectionName={collectionName ?? ''}
              validateCaptcha={[num1, num2, captchaAnswer]}
            />
          </form>
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
