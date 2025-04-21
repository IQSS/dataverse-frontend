import { Trans, useTranslation } from 'react-i18next'
import { Accordion, Col, Row } from '@iqss/dataverse-design-system'
import TurndownService from 'turndown'
import { FilePreview } from '../file-preview/FilePreview'
import { FileLabels } from '../file-labels/FileLabels'
import { FileEmbargoDate } from '../file-embargo/FileEmbargoDate'
import { DATAVERSE_BACKEND_URL } from '../../../config'
import { FileMetadata as FileMetadataModel } from '../../../files/domain/models/FileMetadata'
import { FilePermissions } from '../../../files/domain/models/FilePermissions'
import { DatasetPublishingStatus } from '../../../dataset/domain/models/Dataset'
import styles from './FileMetadata.module.scss'
import { MarkdownComponent } from '@/sections/dataset/markdown/MarkdownComponent'

interface FileMetadataProps {
  name: string
  metadata: FileMetadataModel
  permissions: FilePermissions
  datasetPublishingStatus: DatasetPublishingStatus
}

const turndownService = new TurndownService()
function convertHtmlToMarkdown(html: string): string {
  return turndownService.turndown(html)
}

export function FileMetadata({
  name,
  metadata,
  permissions,
  datasetPublishingStatus
}: FileMetadataProps) {
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
                  {DATAVERSE_BACKEND_URL}
                  {removeQueryParams(metadata.downloadUrls.original)}
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
            <Col>
              <time dateTime={metadata.depositDate}>{metadata.depositDate}</time>
            </Col>
          </Row>
          {metadata.publicationDate && (
            <Row className={styles.row}>
              <Col sm={3}>
                <strong>{t('metadata.fields.metadataReleaseDate')}</strong>
              </Col>
              <Col>
                <time dateTime={metadata.publicationDate}>{metadata.publicationDate}</time>
              </Col>
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
                    datasetPublishingStatus={datasetPublishingStatus}
                    format="YYYY-MM-DD"
                  />
                ) : (
                  metadata.publicationDate && (
                    <time dateTime={metadata.publicationDate}>{metadata.publicationDate}</time>
                  )
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
                <Col>{metadata.tabularData.variables}</Col>
              </Row>
              <Row className={styles.row}>
                <Col sm={3}>
                  <strong>{t('metadata.fields.observations')}</strong>
                </Col>
                <Col>{metadata.tabularData.observations}</Col>
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
              <Col>
                <MarkdownComponent markdown={convertHtmlToMarkdown(metadata.description)} />
              </Col>
            </Row>
          )}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}

function removeQueryParams(urlString: string): string {
  return urlString.split('?')[0]
}
