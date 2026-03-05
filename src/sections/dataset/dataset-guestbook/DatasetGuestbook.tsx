import { useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Button, Col, QuestionMarkTooltip, Row, Spinner } from '@iqss/dataverse-design-system'
import { useGetGuestbookById } from './useGetGuestbookById'
import { GuestbookJSDataverseRepository } from '@/guestbooks/infrastructure/repositories/GuestbookJSDataverseRepository'
import { GuestbookRepository } from '@/guestbooks/domain/repositories/GuestbookRepository'
import { PreviewGuestbookModal } from '@/sections/guestbooks/preview-modal/PreviewGuestbookModal'
import { useDataset } from '@/sections/dataset/DatasetContext'
import styles from '@/sections/dataset/dataset-terms/DatasetTerms.module.scss'

interface DatasetGuestbookProps {
  guestbookRepository?: GuestbookRepository
}

export const DatasetGuestbook = ({ guestbookRepository }: DatasetGuestbookProps) => {
  const { t } = useTranslation('dataset')
  const { dataset } = useDataset()
  const [showPreview, setShowPreview] = useState(false)
  const repository = useMemo(
    () => guestbookRepository ?? new GuestbookJSDataverseRepository(),
    [guestbookRepository]
  )
  const datasetHasGuestbook = dataset?.guestbookId !== undefined
  const { guestbook, isLoadingGuestbook } = useGetGuestbookById({
    guestbookRepository: repository,
    guestbookId: dataset?.guestbookId as number
  })
  const hasGuestbook = guestbook !== undefined

  return (
    <>
      <Row className={styles['dataset-terms-row']} data-testid="dataset-guestbook-section">
        <Col sm={3}>
          <strong>{t('termsTab.guestbookTitle')} </strong>
          <QuestionMarkTooltip placement="right" message={t('termsTab.guestbookTip')} />
        </Col>
        <Col>
          {!datasetHasGuestbook ? (
            <p
              className={styles['community-norms-text']}
              data-testid="dataset-guestbook-empty-message">
              <Trans
                t={t}
                i18nKey="termsTab.noGuestbookAssigned"
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
            </p>
          ) : (
            <>
              <p
                className={styles['community-norms-text']}
                data-testid="dataset-guestbook-description">
                {t('termsTab.guestbookDescription')}
              </p>
              <div className={styles['guestbook-selection']}>
                {isLoadingGuestbook ? (
                  <Spinner />
                ) : (
                  <>
                    <span data-testid="dataset-guestbook-name">{guestbook?.name ?? '-'}</span>
                    {hasGuestbook && (
                      <Button type="button" size="sm" onClick={() => setShowPreview(true)}>
                        {t('termsTab.guestbookPreviewButton')}
                      </Button>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </Col>
      </Row>
      {guestbook && (
        <PreviewGuestbookModal
          show={showPreview}
          handleClose={() => setShowPreview(false)}
          guestbook={guestbook}
        />
      )}
    </>
  )
}
