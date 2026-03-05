import { useEffect, useMemo, useState } from 'react'
import { Alert, Button, Modal, Spinner } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { useDataset } from '@/sections/dataset/DatasetContext'
import { useGetGuestbookById } from '@/sections/dataset/dataset-guestbook/useGetGuestbookById'
import {
  GuestbookAppliedForm,
  getGuestbookCustomQuestionFieldName,
  isGuestbookAppliedFormEmailValid
} from './GuestbookAppliedForm'
import { useSession } from '@/sections/session/SessionContext'
import { Guestbook, GuestbookCustomQuestion } from '@/guestbooks/domain/models/Guestbook'
import { GuestbookRepository } from '@/guestbooks/domain/repositories/GuestbookRepository'
import { AccessRepository } from '@/access/domain/repositories/AccessRepository'
import { useGuestbookAppliedSubmission } from './useGuestbookAppliedSubmission'
import { GuestbookJSDataverseRepository } from '@/guestbooks/infrastructure/repositories/GuestbookJSDataverseRepository'
import { AccessJSDataverseRepository } from '@/access/infrastructure/repositories/AccessJSDataverseRepository'
import { CustomTerms as CustomTermsModel, DatasetLicense } from '@/dataset/domain/models/Dataset'

interface DownloadWithGuestbookModalProps {
  fileId?: number | string
  fileIds?: Array<number | string>
  guestbookId?: number
  datasetPersistentId?: string
  datasetLicense?: DatasetLicense
  datasetCustomTerms?: CustomTermsModel
  show: boolean
  handleClose: () => void
  guestbookRepository?: GuestbookRepository
  accessRepository?: AccessRepository
}

type GuestbookFormValues = Record<string, string>
type GuestbookResponseAnswer = { id: number | string; value: string | string[] }

export function DownloadWithGuestbookModal({
  fileId,
  fileIds,
  guestbookId,
  datasetPersistentId,
  datasetLicense,
  datasetCustomTerms,
  show,
  handleClose,
  guestbookRepository,
  accessRepository
}: DownloadWithGuestbookModalProps) {
  const { t: tFiles } = useTranslation('files')
  const { t: tDataset } = useTranslation('dataset')
  const { dataset } = useDataset()
  const { user } = useSession()
  const [formValues, setFormValues] = useState<GuestbookFormValues>({})
  const resolvedGuestbookRepository = useMemo(
    () => guestbookRepository ?? new GuestbookJSDataverseRepository(),
    [guestbookRepository]
  )
  const resolvedAccessRepository = useMemo(
    () => accessRepository ?? new AccessJSDataverseRepository(),
    [accessRepository]
  )
  const { guestbook, isLoadingGuestbook, errorGetGuestbook } = useGetGuestbookById({
    guestbookRepository: resolvedGuestbookRepository,
    guestbookId
  })

  const resolvedDatasetPersistentId = datasetPersistentId ?? dataset?.persistentId
  const resolvedDatasetLicense = datasetLicense ?? dataset?.license
  const resolvedDatasetCustomTerms = datasetCustomTerms ?? dataset?.termsOfUse.customTerms

  const accountFieldKeys = useMemo(() => ['name', 'email', 'institution', 'position'], [])

  const prefilledAccountFieldValues = useMemo(() => {
    if (!user) {
      return {}
    }

    return accountFieldKeys.reduce<GuestbookFormValues>((prefilledValues, fieldName) => {
      if (fieldName === 'name') {
        prefilledValues[fieldName] =
          `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.displayName
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
        errors[fieldName] = tFiles('actions.optionsMenu.guestbookAppliedModal.validation.required')
        return errors
      }

      if (fieldName === 'email' && value.length > 0 && !isGuestbookAppliedFormEmailValid(value)) {
        errors[fieldName] = tFiles(
          'actions.optionsMenu.guestbookAppliedModal.validation.invalidEmail'
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
      return guestbookWithAnswerIds.email ?? fieldName
    }
    if (fieldName === 'institution') {
      return guestbookWithAnswerIds.institution ?? fieldName
    }
    if (fieldName === 'position') {
      return guestbookWithAnswerIds.position ?? fieldName
    }

    return fieldName
  }

  const buildGuestbookAnswers = () => {
    const accountAnswers = accountFieldKeys.reduce<GuestbookResponseAnswer[]>(
      (answers, fieldName) => {
        const value = (formValues[fieldName] ?? '').trim()
        if (value.length === 0) {
          return answers
        }

        answers.push({
          id: resolveAnswerId(fieldName, undefined, guestbook),
          value
        })

        return answers
      },
      []
    )

    const customQuestionAnswers = customQuestions.reduce<GuestbookResponseAnswer[]>(
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

    return [...accountAnswers, ...customQuestionAnswers]
  }
  const buildSignedUrl = (signedUrl: string): string => {
    try {
      const signedUrlObject = new URL(signedUrl, window.location.origin)
      return new URL(
        `${signedUrlObject.pathname}${signedUrlObject.search}${signedUrlObject.hash}`,
        window.location.origin
      ).toString()
    } catch {
      return signedUrl
    }
  }

  const triggerDirectDownload = (signedUrl: string): Promise<void> => {
    const downloadLink = document.createElement('a')
    downloadLink.href = buildSignedUrl(signedUrl)
    downloadLink.style.display = 'none'
    downloadLink.rel = 'noreferrer'

    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)

    return Promise.resolve()
  }

  const {
    hasAttemptedAccept,
    errorDownloadSignedUrlFile,
    errorSubmitGuestbook,
    isSubmittingGuestbook,
    handleModalClose,
    handleSubmit,
    resetSubmissionState
  } = useGuestbookAppliedSubmission({
    datasetPersistentId: resolvedDatasetPersistentId,
    fileId,
    fileIds,
    handleClose,
    accessRepository: resolvedAccessRepository,
    triggerDirectDownload
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
            <GuestbookAppliedForm
              license={resolvedDatasetLicense}
              customTerms={resolvedDatasetCustomTerms}
              datasetPersistentId={resolvedDatasetPersistentId}
              guestbook={guestbook}
              formValues={formValues}
              hasAttemptedAccept={hasAttemptedAccept}
              accountFieldErrors={accountFieldErrors}
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
              hasAccountFieldErrors,
              guestbook,
              answers: buildGuestbookAnswers()
            })
          }
          disabled={
            isLoadingGuestbook || isSubmittingGuestbook || !!errorGetGuestbook || !guestbook
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
