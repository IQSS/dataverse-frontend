import { Accordion, Col, Row } from '@iqss/dataverse-design-system'
import { File } from '../../../files/domain/models/File'
import { FilePreview } from '../file-preview/FilePreview'
import { FileLabels } from '../../dataset/dataset-files/files-table/file-info/file-info-cell/file-info-data/FileLabels'
import styles from './FileMetadata.module.scss'
import { DateHelper } from '../../../shared/domain/helpers/DateHelper'
import { FileEmbargoDate } from '../../dataset/dataset-files/files-table/file-info/file-info-cell/file-info-data/FileEmbargoDate'

interface FileMetadataProps {
  file: File
}

const BASE_URL = (import.meta.env.VITE_DATAVERSE_BACKEND_URL as string) ?? ''

export function FileMetadata({ file }: FileMetadataProps) {
  return (
    <Accordion defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>File Metadata</Accordion.Header>
        <Accordion.Body>
          <Row className={styles.row}>
            <Col sm={3}>
              <strong>Preview</strong>
            </Col>
            <Col>
              <FilePreview thumbnail={file.thumbnail} type={file.type} name={file.name} />
            </Col>
          </Row>
          {file.labels.length > 0 && (
            <Row className={styles.row}>
              <Col sm={3}>
                <strong>File Tags</strong>
              </Col>
              <Col>
                <FileLabels labels={file.labels} />
              </Col>
            </Row>
          )}
          {file.persistentId && (
            <Row className={styles.row}>
              <Col sm={3}>
                <strong>File Persistent ID</strong>
              </Col>
              <Col>{file.persistentId}</Col>
            </Row>
          )}
          {file.permissions.canDownloadFile && (
            <Row className={styles.row}>
              <Col sm={3}>
                <strong>Download URL</strong>
              </Col>
              <Col>
                <p className={styles['help-text']}>
                  Use the Download URL in a Wget command or a download manager to avoid interrupted
                  downloads, time outs or other failures.{' '}
                  <a href="https://guides.dataverse.org/en/6.1/user/find-use-data.html#downloading-via-url">
                    User Guide - Downloading via URL
                  </a>
                </p>
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
                <strong>File UNF</strong>
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
              <strong>Deposit Date</strong>
            </Col>
            <Col>{DateHelper.toDisplayFormatYYYYMMDD(file.depositDate)}</Col>
          </Row>
          {file.publicationDate && (
            <Row className={styles.row}>
              <Col sm={3}>
                <strong>Metadata Release Date</strong>
              </Col>
              <Col>{DateHelper.toDisplayFormatYYYYMMDD(file.publicationDate)}</Col>
            </Row>
          )}
          {(file.publicationDate || file.embargo) && (
            <Row className={styles.row}>
              <Col sm={3}>
                <strong>Publication Date</strong>
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
                <strong>Embargo Reason</strong>
              </Col>
              <Col>{file.embargo.reason}</Col>
            </Row>
          )}
          <Row className={styles.row}>
            <Col sm={3}>
              <strong>Size</strong>
            </Col>
            <Col>{file.size.toString()}</Col>
          </Row>
          <Row className={styles.row}>
            <Col sm={3}>
              <strong>Type</strong>
            </Col>
            <Col>{file.type.toDisplayFormat()}</Col>
          </Row>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  )
}
