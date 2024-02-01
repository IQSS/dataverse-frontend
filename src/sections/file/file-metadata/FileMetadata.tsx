import { Accordion, Col, Row } from '@iqss/dataverse-design-system'
import { File } from '../../../files/domain/models/File'
import { FilePreview } from '../file-preview/FilePreview'
import { FileLabels } from '../file-labels/FileLabels'
import styles from './FileMetadata.module.scss'
import { DateHelper } from '../../../shared/helpers/DateHelper'
import { FileEmbargoDate } from '../file-embargo/FileEmbargoDate'
import { BASE_URL } from '../../../config'
import { Trans, useTranslation } from 'react-i18next'

interface FileMetadataProps {
  file: File
}

export function FileMetadata({ file }: FileMetadataProps) {
  const { t } = useTranslation('file')
  return (
    <Accordion defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>{t('metadata.title')}</Accordion.Header>
        <Accordion.Body>
          <Row className={styles.row}>
            <Col sm={3}>
              <strong>{t('metadata.fields.preview')}</strong>
            </Col>
            <Col className={styles.preview}>
              <FilePreview thumbnail={file.thumbnail} type={file.type} name={file.name} />
            </Col>
          </Row>
          {file.labels.length > 0 && (
            <Row className={styles.row}>
              <Col sm={3}>
                <strong>{t('metadata.fields.labels')}</strong>
              </Col>
              <Col>
                <FileLabels labels={file.labels} />
              </Col>
            </Row>
          )}
          {file.persistentId && (
            <Row className={styles.row}>
              <Col sm={3}>
                <strong>{t('metadata.fields.persistentId')}</strong>
              </Col>
              <Col>{file.persistentId}</Col>
            </Row>
          )}
          {file.permissions.canDownloadFile && (
            <Row className={styles.row}>
              <Col sm={3}>
                <strong>{t('metadata.fields.downloadUrl.title')}</strong>
              </Col>
              <Col>
                <Trans i18nKey="metadata.fields.downloadUrl.description">
                  <p className={styles['help-text']}>
                    Use the Download URL in a Wget command or a download manager to avoid
                    interrupted downloads, time outs or other failures.{' '}
                    <a href="https://guides.dataverse.org/en/6.1/user/find-use-data.html#downloading-via-url">
                      User Guide - Downloading via URL
                    </a>
                  </p>
                </Trans>
                <code className={styles.code}>
                  {BASE_URL}
                  {file.downloadUrls.original}
                </code>
              </Col>
            </Row>
          )}
          {file.tabularData?.unf && (
            <Row className={styles.row}>
              <Col sm={3}>
                <strong>{t('metadata.fields.unf')}</strong>
              </Col>
              <Col>{file.tabularData.unf}</Col>
            </Row>
          )}
          {file.checksum && (
            <Row className={styles.row}>
              <Col sm={3}>
                <strong>{file.checksum.algorithm}</strong>
              </Col>
              <Col>{file.checksum.value}</Col>
            </Row>
          )}
          <Row className={styles.row}>
            <Col sm={3}>
              <strong>{t('metadata.fields.depositDate')}</strong>
            </Col>
            <Col>{DateHelper.toDisplayFormatYYYYMMDD(file.depositDate)}</Col>
          </Row>
          {file.publicationDate && (
            <Row className={styles.row}>
              <Col sm={3}>
                <strong>{t('metadata.fields.metadataReleaseDate')}</strong>
              </Col>
              <Col>{DateHelper.toDisplayFormatYYYYMMDD(file.publicationDate)}</Col>
            </Row>
          )}
          {(file.publicationDate || file.embargo) && (
            <Row className={styles.row}>
              <Col sm={3}>
                <strong>{t('metadata.fields.publicationDate')}</strong>
              </Col>
              <Col>
                {file.embargo ? (
                  <FileEmbargoDate
                    embargo={file.embargo}
                    publishingStatus={file.version.publishingStatus}
                    format="YYYY-MM-DD"
                  />
                ) : (
                  DateHelper.toDisplayFormatYYYYMMDD(file.publicationDate)
                )}
              </Col>
            </Row>
          )}
          {file.embargo && file.embargo.reason && (
            <Row className={styles.row}>
              <Col sm={3}>
                <strong>{t('metadata.fields.embargoReason')}</strong>
              </Col>
              <Col>{file.embargo.reason}</Col>
            </Row>
          )}
          <Row className={styles.row}>
            <Col sm={3}>
              <strong>{t('metadata.fields.size')}</strong>
            </Col>
            <Col>{file.size.toString()}</Col>
          </Row>
          <Row className={styles.row}>
            <Col sm={3}>
              <strong>{t('metadata.fields.type')}</strong>
            </Col>
            <Col>{file.type.toDisplayFormat()}</Col>
          </Row>
          {file.tabularData && (
            <>
              <Row className={styles.row}>
                <Col sm={3}>
                  <strong>{t('metadata.fields.variables')}</strong>
                </Col>
                <Col>{file.tabularData.variablesCount}</Col>
              </Row>
              <Row className={styles.row}>
                <Col sm={3}>
                  <strong>{t('metadata.fields.observations')}</strong>
                </Col>
                <Col>{file.tabularData.observationsCount}</Col>
              </Row>
            </>
          )}
          {file.directory && (
            <Row className={styles.row}>
              <Col sm={3}>
                <strong>{t('metadata.fields.directory')}</strong>
              </Col>
              <Col>{file.directory}</Col>
            </Row>
          )}
          {file.description && (
            <Row className={styles.row}>
              <Col sm={3}>
                <strong>{t('metadata.fields.description')}</strong>
              </Col>
              <Col>{file.description}</Col>
            </Row>
          )}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}
