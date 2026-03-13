import { startTransition, useCallback, useEffect, useState } from 'react'
import { Alert, Button, Col, Form, Row, Spinner } from '@iqss/dataverse-design-system'
import { Trans, useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Guestbook } from '@/guestbooks/domain/models/Guestbook'
import { GuestbookRepository } from '@/guestbooks/domain/repositories/GuestbookRepository'
import {
  DatasetNonNumericVersionSearchParam,
  DatasetPublishingStatus
} from '@/dataset/domain/models/Dataset'
import { useGetGuestbooksByCollectionId } from '@/sections/guestbooks/useGetGuestbooksByCollectionId'
import { QueryParamKey, Route } from '@/sections/Route.enum'
import { useAssignDatasetGuestbook } from './useAssignDatasetGuestbook'
import { useRemoveDatasetGuestbook } from './useRemoveDatasetGuestbook'
import { useDataset } from '../../dataset/DatasetContext'
import { PreviewGuestbookModal } from '@/sections/guestbooks/preview-modal/PreviewGuestbookModal'
import styles from './EditGuestbook.module.scss'

interface EditGuestbookProps {
  guestbookRepository: GuestbookRepository
  onPreview?: () => void
}

export function EditGuestbook({ guestbookRepository, onPreview }: EditGuestbookProps) {
  const { t } = useTranslation('dataset')
  const { t: tShared } = useTranslation('shared')
  const [selectedGuestbookId, setSelectedGuestbookId] = useState<number | undefined>(undefined)
  const [previewGuestbook, setPreviewGuestbook] = useState<Guestbook | undefined>(undefined)
  const { dataset, refreshDataset } = useDataset()
  const navigate = useNavigate()
  const collectionIdOrAlias = dataset?.parentCollectionNode?.id
  const collectionName = dataset?.parentCollectionNode?.name ?? ''

  const navigateToDatasetView = useCallback(() => {
    if (!dataset) return

    const searchParams = new URLSearchParams()
    searchParams.set(QueryParamKey.PERSISTENT_ID, dataset.persistentId)

    if (dataset.version.publishingStatus === DatasetPublishingStatus.DRAFT) {
      searchParams.set(QueryParamKey.VERSION, DatasetNonNumericVersionSearchParam.DRAFT)
    } else {
      searchParams.set(QueryParamKey.VERSION, dataset.version.number.toString())
    }

    navigate(`${Route.DATASETS}?${searchParams.toString()}`)
  }, [dataset, navigate])

  const handleCancel = () => {
    navigateToDatasetView()
  }

  const { guestbooks, isLoadingGuestbooksByCollectionId, errorGetGuestbooksByCollectionId } =
    useGetGuestbooksByCollectionId({
      guestbookRepository,
      collectionIdOrAlias
    })
  const {
    handleAssignDatasetGuestbook,
    isLoadingAssignDatasetGuestbook,
    errorAssignDatasetGuestbook
  } = useAssignDatasetGuestbook({
    guestbookRepository,
    onSuccessfulAssignDatasetGuestbook: () => {
      toast.success(t('alerts.termsUpdated.alertText'))
      refreshDataset()
      navigateToDatasetView()
    }
  })
  const {
    handleRemoveDatasetGuestbook,
    isLoadingRemoveDatasetGuestbook,
    errorRemoveDatasetGuestbook
  } = useRemoveDatasetGuestbook({
    guestbookRepository,
    onSuccessfulRemoveDatasetGuestbook: () => {
      toast.success(t('alerts.termsUpdated.alertText'))
      refreshDataset()
      navigateToDatasetView()
    }
  })

  useEffect(() => {
    if (guestbooks.length === 0) {
      setSelectedGuestbookId(undefined)
      return
    }

    const currentDatasetGuestbookId = dataset?.guestbookId

    if (currentDatasetGuestbookId === undefined) {
      setSelectedGuestbookId((currentSelectedGuestbookId) =>
        currentSelectedGuestbookId !== undefined &&
        guestbooks.some((guestbook) => guestbook.id === currentSelectedGuestbookId)
          ? currentSelectedGuestbookId
          : undefined
      )
      return
    }

    const hasCurrentDatasetGuestbook = guestbooks.some(
      (guestbook) => guestbook.id === currentDatasetGuestbookId
    )

    if (!hasCurrentDatasetGuestbook) {
      setSelectedGuestbookId(undefined)
      return
    }

    setSelectedGuestbookId((currentSelectedGuestbookId) => {
      if (
        currentSelectedGuestbookId !== undefined &&
        guestbooks.some((guestbook) => guestbook.id === currentSelectedGuestbookId)
      ) {
        return currentSelectedGuestbookId
      }

      return currentDatasetGuestbookId
    })
  }, [dataset?.guestbookId, guestbooks])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!dataset) {
      return
    }

    if (selectedGuestbookId === undefined) {
      if (dataset.guestbookId === undefined) {
        return
      }

      await handleRemoveDatasetGuestbook(dataset.id)
      return
    }

    await handleAssignDatasetGuestbook(dataset.id, selectedGuestbookId)
  }

  return (
    <div className={styles['edit-guest-book']}>
      <form onSubmit={handleSubmit}>
        <Row style={{ marginBottom: '1rem' }}>
          <Col sm={4}>
            <Form.Group.Label>{t('editTerms.guestbook.title')}</Form.Group.Label>
          </Col>
          <Col sm={8}>
            <Form.Group.Text className={styles['guestbook-description']}>
              <Trans
                t={t}
                i18nKey="editTerms.guestbook.description"
                components={{
                  anchor: (
                    <a
                      href="https://guides.dataverse.org/en/6.9/user/dataverse-management.html#dataset-guestbooks"
                      target="_blank"
                      rel="noreferrer"
                    />
                  )
                }}
              />
              {!isLoadingGuestbooksByCollectionId &&
                !errorGetGuestbooksByCollectionId &&
                guestbooks.length === 0 && (
                  <div style={{ marginTop: '10px' }}>
                    {t('editTerms.guestbook.noGuestbooksEnabled', { collectionName })}
                  </div>
                )}
            </Form.Group.Text>

            {!isLoadingGuestbooksByCollectionId &&
              !errorGetGuestbooksByCollectionId &&
              guestbooks.length > 0 &&
              selectedGuestbookId !== undefined && (
                <div style={{ marginTop: '10px' }}>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    style={{ marginBottom: '0.75rem' }}
                    onClick={() => setSelectedGuestbookId(undefined)}>
                    {t('editTerms.guestbook.clearSelection')}
                  </Button>
                </div>
              )}

            {isLoadingGuestbooksByCollectionId && (
              <div className={styles['guestbook-loading']}>
                <Spinner />
              </div>
            )}

            {errorGetGuestbooksByCollectionId && (
              <Alert variant="danger">{errorGetGuestbooksByCollectionId}</Alert>
            )}
            {errorAssignDatasetGuestbook && (
              <Alert variant="danger">{errorAssignDatasetGuestbook}</Alert>
            )}
            {errorRemoveDatasetGuestbook && (
              <Alert variant="danger">{errorRemoveDatasetGuestbook}</Alert>
            )}

            {!isLoadingGuestbooksByCollectionId &&
              !errorGetGuestbooksByCollectionId &&
              guestbooks.length > 0 && (
                <div className={styles['guestbook-list']}>
                  {guestbooks.map((guestbook) => (
                    <div
                      key={guestbook.id}
                      className={`${styles['guestbook-option']}${
                        selectedGuestbookId === guestbook.id
                          ? ` ${styles['guestbook-option-selected']}`
                          : ''
                      }`}>
                      <Form.Group.Radio
                        name="guestbook"
                        id={`guestbook-${guestbook.id}`}
                        value={guestbook.id.toString()}
                        checked={selectedGuestbookId === guestbook.id}
                        onChange={() => setSelectedGuestbookId(guestbook.id)}
                        label={guestbook.name}
                      />

                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          if (onPreview) {
                            onPreview()
                            return
                          }
                          startTransition(() => {
                            setPreviewGuestbook(guestbook)
                          })
                        }}
                        aria-label={t('editTerms.guestbook.previewButton')}>
                        {t('editTerms.guestbook.previewButton')}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
          </Col>
        </Row>

        <div className={styles['form-actions']}>
          <Button
            type="submit"
            disabled={
              guestbooks.length === 0 ||
              (selectedGuestbookId === undefined && dataset?.guestbookId === undefined) ||
              selectedGuestbookId === dataset?.guestbookId ||
              isLoadingAssignDatasetGuestbook ||
              isLoadingRemoveDatasetGuestbook
            }>
            {isLoadingAssignDatasetGuestbook || isLoadingRemoveDatasetGuestbook
              ? tShared('saving')
              : tShared('saveChanges')}
          </Button>
          <Button variant="secondary" type="button" onClick={handleCancel}>
            {tShared('cancel')}
          </Button>
        </div>
      </form>

      {previewGuestbook && (
        <PreviewGuestbookModal
          show={Boolean(previewGuestbook)}
          handleClose={() =>
            startTransition(() => {
              setPreviewGuestbook(undefined)
            })
          }
          guestbook={previewGuestbook}
        />
      )}
    </div>
  )
}
