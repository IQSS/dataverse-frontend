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
import { ContactDTO } from '@/contact/domain/useCases/ContactDTO'
import { Captcha } from '../form/ContactForm/ContactCaptcha'

interface ContactModalProps {
  show: boolean
  handleClose: () => void
  title: string
  onSuccess: () => void
}

export const ContactModal = ({ show, title, handleClose, onSuccess }: ContactModalProps) => {
  const { t } = useTranslation('shared')
  const { collectionId } = useParams<{ collectionId: string }>()
  const [collectionName, setCollectionName] = useState<string>('Root')
  const [userEmail, setUserEmail] = useState<string>('')
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

  const contactRepository = useMemo(() => new ContactJSDataverseRepository(), [])

  const { submitForm, submissionStatus, submitError } = useSubmitContact(contactRepository)

  //CAPTCHA
  const [num1, setNum1] = useState(0)
  const [num2, setNum2] = useState(0)
  const [captchaInput, setCaptchaInput] = useState('')
  const [captchaAnswer, setCaptchaAnswer] = useState(0)
  const [captchaError, setCaptchaError] = useState<string | null>(null)

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
      fromEmail: ''
    }
  })

  const { reset } = methods

  useEffect(() => {
    if (show) {
      const randomNum1 = Math.floor(Math.random() * 10) + 1
      const randomNum2 = Math.floor(Math.random() * 10) + 1
      setNum1(randomNum1)
      setNum2(randomNum2)
      setCaptchaAnswer(randomNum1 + randomNum2)
    }
  }, [show, contactRepository])

  const onSubmit = async (data: ContactDTO) => {
    if (submissionStatus === SubmissionStatus.Errored) {
      return
    }
    if (!captchaInput) {
      setCaptchaError('Verification is required.')
      return
    }

    if (parseInt(captchaInput, 10) !== captchaAnswer) {
      setCaptchaError('Incorrect answer. Please try again.')
      return
    }

    setCaptchaError(null)

    isLoggedIn && (data.fromEmail = userEmail)
    data.identifier = collectionId || ''

    await submitForm(data)
    onSuccess()
    reset()
    setCaptchaInput('')
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
        {captchaError && (
          <Alert variant="danger" dismissible={false}>
            {captchaError}
          </Alert>
        )}
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <ContactForm
              isLoggedIn={isLoggedIn}
              fromEmail={userEmail}
              collectionName={collectionName ?? ''}
            />
          </form>
        </FormProvider>
        <Captcha userInput={captchaInput} onChange={setCaptchaInput} num1={num1} num2={num2} />
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
