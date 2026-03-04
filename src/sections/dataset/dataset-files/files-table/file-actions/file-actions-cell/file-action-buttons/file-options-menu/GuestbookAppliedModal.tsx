import { useEffect, useMemo, useState } from 'react'
import { Alert, Button, Modal, Spinner } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { GuestbookJSDataverseRepository } from '@/guestbooks/infrastructure/repositories/GuestbookJSDataverseRepository'
import { useDataset } from '@/sections/dataset/DatasetContext'
import { useGetGuestbookById } from '@/sections/dataset/dataset-guestbook/useGetGuestbookById'
import {
  GuestbookAppliedForm,
  getGuestbookCustomQuestionFieldName,
  isGuestbookAppliedFormEmailValid
} from './GuestbookAppliedForm'
import { useSession } from '@/sections/session/SessionContext'
import { Guestbook, GuestbookCustomQuestion } from '@/guestbooks/domain/models/Guestbook'
import { useSubmitGuestbookForDatafileDownload } from '@/access/hooks/useSubmitGuestbookForDatafileDownload'
import { useSubmitGuestbookForDatafilesDownload } from '@/access/hooks/useSubmitGuestbookForDatafilesDownload'
import { GuestbookRepository } from '@/guestbooks/domain/repositories/GuestbookRepository'
import { AccessRepository } from '@/access/domain/repositories/AccessRepository'

interface GuestbookAppliedModalProps {
  fileId?: number | string
  fileIds?: Array<number | string>
  guestbookId?: number
  show: boolean
  handleClose: () => void
  guestbookRepository?: GuestbookRepository
  accessRepository?: AccessRepository
}

type GuestbookFormValues = Record<string, string>
type GuestbookResponseAnswer = { id: number | string; value: string | string[] }

export function GuestbookAppliedModal({
  fileId,
  fileIds,
  guestbookId,
  show,
  handleClose,
  guestbookRepository,
  accessRepository
}: GuestbookAppliedModalProps) {
  const { t: tFiles } = useTranslation('files')
  const { t: tDataset } = useTranslation('dataset')
  const { t: tGuestbooks } = useTranslation('guestbooks')
  const { dataset } = useDataset()
  const { user } = useSession()
  const repository = useMemo(
    () => guestbookRepository ?? new GuestbookJSDataverseRepository(),
    [guestbookRepository]
  )
  const [formValues, setFormValues] = useState<GuestbookFormValues>({})
  const [hasAttemptedAccept, setHasAttemptedAccept] = useState(false)
  const [errorDownloadSignedUrlFile, setErrorDownloadSignedUrlFile] = useState<string | null>(null)
  const {
    isSubmittingGuestbook: isSubmittingGuestbookDatafile,
    errorSubmitGuestbook: errorSubmitGuestbookDatafile,
    handleSubmitGuestbookForDatafileDownload,
    resetSubmitGuestbookForDatafileDownloadState
  } = useSubmitGuestbookForDatafileDownload({ accessRepository })
  const {
    isSubmittingGuestbook: isSubmittingGuestbookDatafiles,
    errorSubmitGuestbook: errorSubmitGuestbookDatafiles,
    handleSubmitGuestbookForDatafilesDownload,
    resetSubmitGuestbookForDatafilesDownloadState
  } = useSubmitGuestbookForDatafilesDownload({ accessRepository })
  const { guestbook, isLoadingGuestbook, errorGetGuestbook } = useGetGuestbookById({
    guestbookRepository: repository,
    guestbookId: guestbookId
  })

  const accountFieldLabels = useMemo(() => {
    const options = tGuestbooks('create.fields.dataCollected.options', {
      returnObjects: true
    })

    if (typeof options !== 'object' || options === null || Array.isArray(options)) {
      return {}
    }

    return Object.entries(options).reduce<Record<string, string>>((labels, [key, value]) => {
      if (typeof value === 'string') {
        labels[key] = value
      }
      return labels
    }, {})
  }, [tGuestbooks])

  const accountFieldKeys = useMemo(() => Object.keys(accountFieldLabels), [accountFieldLabels])
  const prefilledAccountFieldValues = useMemo(() => {
    if (!user) {
      return {}
    }

    const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.displayName

    return accountFieldKeys.reduce<GuestbookFormValues>((prefilledValues, fieldName) => {
      if (fieldName === 'name') {
        prefilledValues[fieldName] = fullName
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
    () =>
      (guestbook?.customQuestions ?? [])
        .filter((question) => !question.hidden)
        .sort((first, second) => first.displayOrder - second.displayOrder),
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

  const getFilenameFromContentDisposition = (contentDispositionHeader: string | null): string => {
    if (!contentDispositionHeader) {
      return fileId !== undefined ? `datafile-${fileId}` : 'files-download'
    }

    const utf8FileNameMatch = contentDispositionHeader.match(/filename\*=UTF-8''([^;]+)/i)
    if (utf8FileNameMatch?.[1]) {
      try {
        return decodeURIComponent(utf8FileNameMatch[1])
      } catch {
        return utf8FileNameMatch[1]
      }
    }

    const basicFileNameMatch = contentDispositionHeader.match(/filename="?([^"]+)"?/i)
    if (basicFileNameMatch?.[1]) {
      return basicFileNameMatch[1]
    }

    return fileId !== undefined ? `datafile-${fileId}` : 'files-download'
  }

  const triggerDirectDownload = async (signedUrl: string) => {
    const response = await fetch(buildSignedUrl(signedUrl), {
      // signed URLs do not require cookies/tokens and may redirect to cross-origin storage (e.g. S3),
      // where credentialed CORS requests are rejected.
      credentials: 'omit'
    })

    if (!response.ok) {
      let errorMessage: string | undefined

      try {
        const errorPayload = (await response.json()) as {
          message?: string
          data?: { message?: string }
        }
        if (errorPayload.message) {
          errorMessage = errorPayload.message
        } else if (errorPayload.data?.message) {
          errorMessage = errorPayload.data.message
        }
      } catch {
        // fallback message below
      }

      throw new Error(
        errorMessage ?? tFiles('actions.optionsMenu.guestbookAppliedModal.downloadError')
      )
    }

    const blob = await response.blob()
    const objectURL = URL.createObjectURL(blob)
    const downloadLink = document.createElement('a')

    downloadLink.href = objectURL
    downloadLink.download = getFilenameFromContentDisposition(
      response.headers.get('content-disposition')
    )
    downloadLink.style.display = 'none'

    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
    URL.revokeObjectURL(objectURL)
  }

  const clearModalErrors = () => {
    setErrorDownloadSignedUrlFile(null)
    resetSubmitGuestbookForDatafileDownloadState()
    resetSubmitGuestbookForDatafilesDownloadState()
  }

  const isSubmittingGuestbook = isSubmittingGuestbookDatafile || isSubmittingGuestbookDatafiles
  const errorSubmitGuestbook = errorSubmitGuestbookDatafile || errorSubmitGuestbookDatafiles

  useEffect(() => {
    if (show) {
      setFormValues(prefilledAccountFieldValues)
      setHasAttemptedAccept(false)
      setErrorDownloadSignedUrlFile(null)
      resetSubmitGuestbookForDatafileDownloadState()
      resetSubmitGuestbookForDatafilesDownloadState()
    }
  }, [
    show,
    prefilledAccountFieldValues,
    resetSubmitGuestbookForDatafileDownloadState,
    resetSubmitGuestbookForDatafilesDownloadState
  ])

  const handleModalClose = () => {
    clearModalErrors()
    handleClose()
  }

  const updateFieldValue = (fieldName: string, value: string) => {
    setFormValues((current) => ({
      ...current,
      [fieldName]: value
    }))
  }

  const handleSubmit = async () => {
    setHasAttemptedAccept(true)
    setErrorDownloadSignedUrlFile(null)

    if (hasAccountFieldErrors || !guestbook) {
      return
    }

    const answers = buildGuestbookAnswers()

    let signedUrl: string | undefined

    if (fileId !== undefined) {
      signedUrl = await handleSubmitGuestbookForDatafileDownload(fileId, answers)
    } else if (fileIds && fileIds.length > 0) {
      signedUrl = await handleSubmitGuestbookForDatafilesDownload(fileIds, answers)
    } else {
      return
    }
    if (signedUrl) {
      handleModalClose()
      void triggerDirectDownload(signedUrl).catch((error) => {
        const fallbackMessage = tFiles('actions.optionsMenu.guestbookAppliedModal.downloadError')
        toast.error(error instanceof Error ? error.message : fallbackMessage)
      })
    }
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
              license={dataset?.license}
              guestbook={guestbook}
              formValues={formValues}
              hasAttemptedAccept={hasAttemptedAccept}
              accountFieldErrors={accountFieldErrors}
              accountFieldKeys={accountFieldKeys}
              isAccountFieldRequired={isAccountFieldRequired}
              onFieldChange={updateFieldValue}
            />
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() => void handleSubmit()}
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
