import { useEffect, useMemo, useState } from 'react'
import { Alert, Button, Modal, Spinner } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { useGetGuestbookById } from '@/sections/dataset/dataset-guestbook/useGetGuestbookById'
import {
  GuestbookCollectForm,
  getGuestbookCustomQuestionFieldName,
  isGuestbookCollectFormEmailValid
} from './GuestbookCollectForm'
import { useSession } from '@/sections/session/SessionContext'
import { Guestbook, GuestbookCustomQuestion } from '@/guestbooks/domain/models/Guestbook'
import { useGuestbookCollectSubmission } from './useGuestbookCollectSubmission'
import { CustomTerms as CustomTermsModel, DatasetLicense } from '@/dataset/domain/models/Dataset'
import { useAccessRepository } from '@/sections/access/AccessRepositoryContext'
import { useGuestbookRepository } from '@/sections/guestbooks/GuestbookRepositoryContext'
import {
  GuestbookAnswerDTO,
  GuestbookResponseDTO
} from '@/access/domain/repositories/AccessRepository'
import { downloadFromSignedUrl } from '@/shared/helpers/DownloadHelper'
import { FileDownloadMode } from '@/files/domain/models/FileMetadata'

interface DownloadWithTermsAndGuestbookModalProps {
  fileId?: number | string
  fileIds?: Array<number>
  format?: string | FileDownloadMode
  guestbookId?: number
  datasetId?: number | string
  datasetPersistentId?: string
  datasetLicense?: DatasetLicense
  datasetCustomTerms?: CustomTermsModel
  show: boolean
  handleClose: () => void
}

type GuestbookFormValues = Record<string, string>
export function DownloadWithTermsAndGuestbookModal({
  fileId,
  fileIds,
  format,
  guestbookId,
  datasetId,
  datasetPersistentId,
  datasetLicense,
  datasetCustomTerms,
  show,
  handleClose
}: DownloadWithTermsAndGuestbookModalProps) {
  const { t: tFiles } = useTranslation('files')
  const { t: tDataset } = useTranslation('dataset')
  const { user } = useSession()
  const accessRepository = useAccessRepository()
  const guestbookRepository = useGuestbookRepository()

  const hasGuestbook = guestbookId !== undefined
  const [formValues, setFormValues] = useState<GuestbookFormValues>({})
  const { guestbook, isLoadingGuestbook, errorGetGuestbook } = useGetGuestbookById({
    guestbookRepository,
    guestbookId,
    enabled: show && hasGuestbook
  })
  const accountFieldKeys = useMemo(() => ['name', 'email', 'institution', 'position'], [])

  const prefilledAccountFieldValues = useMemo(() => {
    if (!user) {
      return {}
    }

    return accountFieldKeys.reduce<GuestbookFormValues>((prefilledValues, fieldName) => {
      if (fieldName === 'name') {
        prefilledValues[fieldName] = user.displayName
      }
      if (fieldName === 'email') {
        prefilledValues[fieldName] = user.email
      }
      if (fieldName === 'institution') {
        prefilledValues[fieldName] = user.affiliation ?? ''
      }
      if (fieldName === 'position') {
        prefilledValues[fieldName] = user.position ?? ''
      }

      return prefilledValues
    }, {})
  }, [accountFieldKeys, user])

  const isAccountFieldRequired = (fieldName: string): boolean => {
    if (!guestbook) {
      return false
    }

    switch (fieldName) {
      case 'name':
        return guestbook.nameRequired
      case 'email':
        return guestbook.emailRequired
      case 'institution':
        return guestbook.institutionRequired
      case 'position':
        return guestbook.positionRequired
      default:
        return false
    }
  }

  const accountFieldErrors = accountFieldKeys.reduce<Record<string, string | null>>(
    (errors, fieldName) => {
      const value = (formValues[fieldName] ?? '').trim()

      if (isAccountFieldRequired(fieldName) && value.length === 0) {
        errors[fieldName] = tFiles('actions.optionsMenu.guestbookCollectModal.validation.required')
        return errors
      }

      if (fieldName === 'email' && value.length > 0 && !isGuestbookCollectFormEmailValid(value)) {
        errors[fieldName] = tFiles(
          'actions.optionsMenu.guestbookCollectModal.validation.invalidEmail'
        )
        return errors
      }

      errors[fieldName] = null
      return errors
    },
    {}
  )

  const hasAccountFieldErrors = Object.values(accountFieldErrors).some((error) => error !== null)
  const customQuestions = useMemo(
    () => (guestbook?.customQuestions ?? []).filter((question) => !question.hidden),
    [guestbook?.customQuestions]
  )
  const customQuestionErrors = customQuestions.reduce<Record<string, string | null>>(
    (errors, question, index) => {
      const fieldName = getGuestbookCustomQuestionFieldName(question, index)
      const value = (formValues[fieldName] ?? '').trim()

      if (question.required && value.length === 0) {
        errors[fieldName] = tFiles('actions.optionsMenu.guestbookCollectModal.validation.required')
        return errors
      }

      errors[fieldName] = null
      return errors
    },
    {}
  )
  const hasCustomQuestionErrors = Object.values(customQuestionErrors).some(
    (error) => error !== null
  )

  const resolveAnswerId = (
    fieldName: string,
    question?: GuestbookCustomQuestion,
    guestbookData?: Guestbook
  ): string | number => {
    const guestbookWithAnswerIds = guestbookData as Guestbook & {
      email?: string
      institution?: string
      position?: string
    }
    const questionWithId = question as GuestbookCustomQuestion & { id?: number | string }

    if (questionWithId?.id !== undefined) {
      return questionWithId.id
    }

    if (fieldName === 'email') {
      return guestbookWithAnswerIds.email ?? ''
    }
    if (fieldName === 'institution') {
      return guestbookWithAnswerIds.institution ?? ''
    }
    if (fieldName === 'position') {
      return guestbookWithAnswerIds.position ?? ''
    }

    return fieldName
  }

  const buildGuestbookResponse = (): GuestbookResponseDTO => {
    const customQuestionAnswers = customQuestions.reduce<GuestbookAnswerDTO[]>(
      (answers, question, index) => {
        const fieldName = getGuestbookCustomQuestionFieldName(question, index)
        const value = (formValues[fieldName] ?? '').trim()
        if (value.length === 0) {
          return answers
        }

        answers.push({
          id: resolveAnswerId(fieldName, question, guestbook),
          value
        })

        return answers
      },
      []
    )

    return {
      guestbookResponse: {
        name: (formValues.name ?? '').trim() || undefined,
        email: (formValues.email ?? '').trim() || undefined,
        institution: (formValues.institution ?? '').trim() || undefined,
        position: (formValues.position ?? '').trim() || undefined,
        answers: customQuestionAnswers
      }
    }
  }
  const {
    hasAttemptedAccept,
    errorDownloadSignedUrlFile,
    errorSubmitGuestbook,
    isSubmittingGuestbook,
    handleModalClose,
    handleSubmit,
    resetSubmissionState
  } = useGuestbookCollectSubmission({
    datasetId,
    fileId,
    fileIds,
    format,
    handleClose,
    accessRepository,
    downloadFromSignedUrl
  })

  useEffect(() => {
    if (show) {
      setFormValues(prefilledAccountFieldValues)
      resetSubmissionState()
    }
  }, [show, prefilledAccountFieldValues, resetSubmissionState])

  const updateFieldValue = (fieldName: string, value: string) => {
    setFormValues((current) => ({
      ...current,
      [fieldName]: value
    }))
  }

  return (
    <Modal show={show} onHide={handleModalClose} size="xl">
      <Modal.Header>
        <Modal.Title>{tDataset('termsTab.licenseTitle')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoadingGuestbook ? (
          <Spinner />
        ) : (
          <>
            {errorGetGuestbook && <Alert variant="danger">{errorGetGuestbook}</Alert>}
            {errorSubmitGuestbook && <Alert variant="danger">{errorSubmitGuestbook}</Alert>}
            {errorDownloadSignedUrlFile && (
              <Alert variant="danger">{errorDownloadSignedUrlFile}</Alert>
            )}
            <GuestbookCollectForm
              license={datasetLicense}
              customTerms={datasetCustomTerms}
              datasetPersistentId={datasetPersistentId}
              guestbook={guestbook}
              formValues={formValues}
              hasAttemptedAccept={hasAttemptedAccept}
              accountFieldErrors={accountFieldErrors}
              customQuestionErrors={customQuestionErrors}
              accountFieldKeys={accountFieldKeys}
              shouldLockIdentityFields={!!user}
              isAccountFieldRequired={isAccountFieldRequired}
              onFieldChange={updateFieldValue}
            />
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() =>
            void handleSubmit({
              hasFormErrors: hasAccountFieldErrors || hasCustomQuestionErrors,
              guestbookResponse: buildGuestbookResponse()
            })
          }
          disabled={
            isLoadingGuestbook ||
            isSubmittingGuestbook ||
            !!errorGetGuestbook ||
            (hasGuestbook && !guestbook)
          }
          aria-label={tFiles('requestAccess.confirmation')}>
          {isSubmittingGuestbook ? <Spinner variant="light" animation="border" size="sm" /> : null}{' '}
          {tFiles('requestAccess.confirmation')}
        </Button>
        <Button variant="secondary" onClick={handleModalClose} disabled={isSubmittingGuestbook}>
          {tFiles('requestAccess.cancel')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
