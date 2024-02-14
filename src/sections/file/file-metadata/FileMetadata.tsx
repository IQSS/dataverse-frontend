import { Accordion, Col, Row } from '@iqss/dataverse-design-system'
import { FilePreview } from '../file-preview/FilePreview'
import { FileLabels } from '../file-labels/FileLabels'
import styles from './FileMetadata.module.scss'
import { DateHelper } from '../../../shared/helpers/DateHelper'
import { FileEmbargoDate } from '../file-embargo/FileEmbargoDate'
import { BASE_URL } from '../../../config'
import { Trans, useTranslation } from 'react-i18next'
import { FileMetadata as FileMetadataModel } from '../../../files/domain/models/FileMetadata'
import { FilePublishingStatus } from '../../../files/domain/models/FileVersion'
import { FileUserPermissions } from '../../../files/domain/models/FileUserPermissions'

interface FileMetadataProps {
  name: string
  metadata: FileMetadataModel
  permissions: FileUserPermissions
  publishingStatus: FilePublishingStatus
}

export function FileMetadata({ name, metadata, permissions, publishingStatus }: FileMetadataProps) {
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
              <FilePreview thumbnail={metadata.thumbnail} type={metadata.type} name={name} />
            </Col>
          </Row>
          {metadata.labels.length > 0 && (
            <Row className={styles.row}>
              <Col sm={3}>
                <strong>{t('metadata.fields.labels')}</strong>
              </Col>
              <Col>
                <FileLabels labels={metadata.labels} />
              </Col>
            </Row>
          )}
          {metadata.persistentId && (
            <Row className={styles.row}>
              <Col sm={3}>
                <strong>{t('metadata.fields.persistentId')}</strong>
              </Col>
              <Col>{metadata.persistentId}</Col>
            </Row>
          )}
          {permissions.canDownloadFile && (
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
                  {metadata.downloadUrls.original}
                </code>
              </Col>
            </Row>
          )}
          {metadata.tabularData?.unf && (
            <Row className={styles.row}>
              <Col sm={3}>
                <strong>{t('metadata.fields.unf')}</strong>
              </Col>
              <Col>{metadata.tabularData.unf}</Col>
            </Row>
          )}
          {metadata.checksum && (
            <Row className={styles.row}>
              <Col sm={3}>
                <strong>{metadata.checksum.algorithm}</strong>
              </Col>
              <Col>{metadata.checksum.value}</Col>
            </Row>
          )}
          <Row className={styles.row}>
            <Col sm={3}>
              <strong>{t('metadata.fields.depositDate')}</strong>
            </Col>
            <Col>{DateHelper.toDisplayFormatYYYYMMDD(metadata.depositDate)}</Col>
          </Row>
          {metadata.publicationDate && (
            <Row className={styles.row}>
              <Col sm={3}>
                <strong>{t('metadata.fields.metadataReleaseDate')}</strong>
              </Col>
              <Col>{DateHelper.toDisplayFormatYYYYMMDD(metadata.publicationDate)}</Col>
            </Row>
          )}
          {(metadata.publicationDate || metadata.embargo) && (
            <Row className={styles.row}>
              <Col sm={3}>
                <strong>{t('metadata.fields.publicationDate')}</strong>
              </Col>
              <Col>
                {metadata.embargo ? (
                  <FileEmbargoDate
                    embargo={metadata.embargo}
                    publishingStatus={publishingStatus}
                    format="YYYY-MM-DD"
                  />
                ) : (
                  DateHelper.toDisplayFormatYYYYMMDD(metadata.publicationDate)
                )}
              </Col>
            </Row>
          )}
          {metadata.embargo && metadata.embargo.reason && (
            <Row className={styles.row}>
              <Col sm={3}>
                <strong>{t('metadata.fields.embargoReason')}</strong>
              </Col>
              <Col>{metadata.embargo.reason}</Col>
            </Row>
          )}
          <Row className={styles.row}>
            <Col sm={3}>
              <strong>{t('metadata.fields.size')}</strong>
            </Col>
            <Col>{metadata.size.toString()}</Col>
          </Row>
          <Row className={styles.row}>
            <Col sm={3}>
              <strong>{t('metadata.fields.type')}</strong>
            </Col>
            <Col>{metadata.type.toDisplayFormat()}</Col>
          </Row>
          {metadata.tabularData && (
            <>
              <Row className={styles.row}>
                <Col sm={3}>
                  <strong>{t('metadata.fields.variables')}</strong>
                </Col>
                <Col>{metadata.tabularData.variablesCount}</Col>
              </Row>
              <Row className={styles.row}>
                <Col sm={3}>
                  <strong>{t('metadata.fields.observations')}</strong>
                </Col>
                <Col>{metadata.tabularData.observationsCount}</Col>
              </Row>
            </>
          )}
          {metadata.directory && (
            <Row className={styles.row}>
              <Col sm={3}>
                <strong>{t('metadata.fields.directory')}</strong>
              </Col>
              <Col>{metadata.directory}</Col>
            </Row>
          )}
          {metadata.description && (
            <Row className={styles.row}>
              <Col sm={3}>
                <strong>{t('metadata.fields.description')}</strong>
              </Col>
              <Col>{metadata.description}</Col>
            </Row>
          )}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}
