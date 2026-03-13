import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Col, Modal, QuestionMarkTooltip, Row } from '@iqss/dataverse-design-system'
import { Guestbook } from '@/guestbooks/domain/models/Guestbook'
import { useDataset } from '@/sections/dataset/DatasetContext'
import { QueryParamKey, Route } from '@/sections/Route.enum'
import styles from '@/sections/dataset/dataset-terms/DatasetTerms.module.scss'

interface PreviewGuestbookModalProps {
  show: boolean
  handleClose: () => void
  guestbook: Guestbook
}

interface GuestbookItems {
  label: string
  required: boolean
}

export const PreviewGuestbookModal = ({
  show,
  handleClose,
  guestbook
}: PreviewGuestbookModalProps) => {
  const { t } = useTranslation('guestbooks')
  const { t: tShared } = useTranslation('shared')
  const { dataset } = useDataset()

  const guestbookData = useMemo<GuestbookItems[]>(() => {
    return [
      { label: t('create.fields.dataCollected.options.email'), required: guestbook.emailRequired },
      { label: t('create.fields.dataCollected.options.name'), required: guestbook.nameRequired },
      {
        label: t('create.fields.dataCollected.options.institution'),
        required: guestbook.institutionRequired
      },
      {
        label: t('create.fields.dataCollected.options.position'),
        required: guestbook.positionRequired
      }
    ]
  }, [guestbook, t])
  const customQuestionsHref = dataset?.persistentId
    ? `/spa${Route.DATASETS}?${QueryParamKey.PERSISTENT_ID}=${encodeURIComponent(
        dataset.persistentId
      )}&${QueryParamKey.TAB}=terms&termsTab=guestbook`
    : undefined

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header>
        <Modal.Title>{t('preview.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className={styles['community-norms-text']}>{t('preview.description')}</p>

        <Row className={styles['dataset-terms-row']}>
          <Col sm={3}>
            <strong>{t('preview.guestbookNameLabel')} </strong>
          </Col>
          <Col>{guestbook.name}</Col>
        </Row>
        <Row className={styles['dataset-terms-row']}>
          <Col sm={3}>
            <strong>{t('preview.guestbookDataLabel')} </strong>
            <QuestionMarkTooltip placement="right" message={t('preview.guestbookDataTip')} />
          </Col>
          <Col>
            <>{t('preview.accountInformation')}</>
            <ul>
              {guestbookData.map((item) => (
                <li key={item.label}>
                  {item.label} ({item.required ? t('preview.required') : t('preview.optional')})
                </li>
              ))}
            </ul>
            {guestbook.customQuestions && guestbook.customQuestions.length > 0 && (
              <>
                {customQuestionsHref ? (
                  <a href={customQuestionsHref}>{t('preview.customQuestionsLabel')}</a>
                ) : (
                  <>{t('preview.customQuestionsLabel')}</>
                )}
                <ul>
                  {guestbook.customQuestions.map((question, index) => (
                    <li key={`${question.question}-${index}`}>
                      {question.question} (
                      {question.required ? t('preview.required') : t('preview.optional')})
                    </li>
                  ))}
                </ul>
              </>
            )}
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {tShared('close')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
