import { FormattedCitation } from '@/dataset/domain/models/DatasetCitation'
import { CopyToClipboardButton } from '@/sections/dataset/dataset-files/files-table/file-info/file-info-cell/file-info-data/copy-to-clipboard-button/CopyToClipboardButton'
import { Button, Form, Modal, Stack } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import styles from '../Citation.module.scss'

interface ViewStyledCitationModalProps {
  show: boolean
  handleClose: () => void
  citation: FormattedCitation | null
}

export const ViewStyledCitationModal = ({
  show,
  handleClose,
  citation
}: ViewStyledCitationModalProps) => {
  const { t } = useTranslation('shared', { keyPrefix: 'downloadCitation' })
  //TODO: Implement more CSL Style and its corresponding parsing logic

  const parsedCitationContent = parse(citation?.content || '')
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header>
        <Modal.Title>{t('title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group.Label htmlFor="cslStyle">{t('selectCSLStyle')}</Form.Group.Label>
          <Form.Group.Select id="cslStyle" name="cslStyle">
            <option value="chicago-author-date">Chicago-Author-Date</option>
            {/* Add more CSL styles as needed */}
          </Form.Group.Select>
          <Form.Group.Label htmlFor="citationContent">
            {t('citationInStyle', { styleName: 'Chicago-Author-Date' })}
          </Form.Group.Label>
          <Stack direction="horizontal" gap={1}>
            <p className={styles['styledCitationBox']}>{parsedCitationContent}</p>
            <CopyToClipboardButton text={parsedCitationContent} showTruncateText={false} />
          </Stack>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} type="button">
          {t('cancel')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export function parse(citation: string): string {
  return citation.replace(/<[^>]+>/g, '')
}
