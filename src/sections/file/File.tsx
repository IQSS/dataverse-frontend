import { useTranslation } from 'react-i18next'
import styles from './File.module.scss'
import { ButtonGroup, Col, Row, Tabs } from '@iqss/dataverse-design-system'
import { FileRepository } from '../../files/domain/repositories/FileRepository'
import { useFile } from './useFile'
import { useEffect, useMemo, useState } from 'react'
import { useLoading } from '../../shared/contexts/loading/LoadingContext'
import { FileSkeleton } from './FileSkeleton'
import { DatasetCitation } from '../dataset/dataset-citation/DatasetCitation'
import { FileCitation } from './file-citation/FileCitation'
import { DatasetLabels } from '../dataset/dataset-labels/DatasetLabels'
import { FileAccessRestrictedIcon } from './file-access/FileAccessRestrictedIcon'
import { FileMetadata } from './file-metadata/FileMetadata'
import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'
import { AccessFileMenu } from './file-action-buttons/access-file-menu/AccessFileMenu'
import { DatasetPublishingStatus } from '../../dataset/domain/models/Dataset'
import { EditFileMenu } from './file-action-buttons/edit-file-menu/EditFileMenu'
import { NotFoundPage } from '../not-found-page/NotFoundPage'
import { DraftAlert } from './draft-alert/DraftAlert'
import { FileVersions } from './file-version/FileVersions'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { useExternalTools } from '@/shared/contexts/external-tools/ExternalToolsProvider'
import { FilePageHelper } from './FilePageHelper'
import { FileEmbededExternalTool } from './file-embeded-external-tool/FileEmbededExternalTool'

interface FileProps {
  repository: FileRepository
  datasetRepository: DatasetRepository
  id: number
  datasetVersionNumber?: string
  toolTypeSelectedQueryParam?: string
}

export function File({
  repository,
  id,
  datasetVersionNumber,
  datasetRepository,
  toolTypeSelectedQueryParam
}: FileProps) {
  const { setIsLoading } = useLoading()
  const { t } = useTranslation('file')
  const { file, isLoading } = useFile(repository, id, datasetVersionNumber)
  const { externalTools } = useExternalTools()
  const [activeTab, setActiveTab] = useState<string>('metadata')

  const fileAssociatedPreviewOrQueryTools = useMemo(
    () =>
      FilePageHelper.getFileAssociatedPreviewOrQueryTools(externalTools, file?.metadata.type.value),
    [externalTools, file]
  )

  const externalToolTabTitle: string = FilePageHelper.getExternalToolTabTitle(
    fileAssociatedPreviewOrQueryTools,
    t,
    file?.metadata.type.value
  )

  useEffect(() => {
    setIsLoading(isLoading)
  }, [isLoading, setIsLoading])

  // To change active tab to external tool in case the file has associated tools
  useEffect(() => {
    if (file) {
      const defaultActiveTab = FilePageHelper.defineDefaultActiveTab(
        externalTools,
        file?.metadata.type.value
      )

      setActiveTab(defaultActiveTab)
    }
  }, [file, externalTools])

  if (isLoading) {
    return <FileSkeleton />
  }

  const handleTabSelect = (key: string | null) => {
    if (key) {
      setActiveTab(key)
    }
  }

  if (!file) {
    return <NotFoundPage dvObjectNotFoundType="file" />
  }

  return (
    <>
      <BreadcrumbsGenerator hierarchy={file.hierarchy} />
      <article>
        <DraftAlert
          datasetPersistentId={file.datasetPersistentId}
          datasetVersion={file.datasetVersion}
        />
        <header className={styles.header}>
          <h1>{file.name}</h1>
          <p className={styles.subtext}>
            {t('subtext', { datasetTitle: file.datasetVersion.title })}
          </p>
          <div className={styles.labels}>
            {file.access.restricted && (
              <div className={styles['restricted-icon']}>
                <FileAccessRestrictedIcon
                  restricted={file.access.restricted}
                  canDownloadFile={file.permissions.canDownloadFile}
                />
              </div>
            )}
            <DatasetLabels labels={file.datasetVersion.labels} />
          </div>
        </header>
        <div className={styles.container}>
          <Row>
            <Col sm={9}>
              <span className={styles['citation-title']}>{t('fileCitationTitle')}</span>
              <FileCitation citation={file.citation} datasetVersion={file.datasetVersion} />
              <span className={styles['citation-title']}>{t('datasetCitationTitle')}</span>
              <DatasetCitation
                version={file.datasetVersion}
                withoutThumbnail
                datasetRepository={datasetRepository}
                datasetId={file.datasetPersistentId}
              />
            </Col>
            <Col sm={3}>
              <ButtonGroup aria-label={t('actionButtons.title')} vertical className={styles.group}>
                <AccessFileMenu
                  id={file.id}
                  access={file.access}
                  userHasDownloadPermission={file.permissions.canDownloadFile}
                  metadata={file.metadata}
                  ingestInProgress={file.ingest.isInProgress}
                  isDeaccessioned={
                    file.datasetVersion.publishingStatus === DatasetPublishingStatus.DEACCESSIONED
                  }
                  isDraft={file.datasetVersion.publishingStatus === DatasetPublishingStatus.DRAFT}
                />
                {file.permissions.canEditOwnerDataset && (
                  <EditFileMenu
                    fileId={file.id}
                    fileRepository={repository}
                    isRestricted={file.access.restricted}
                    datasetInfo={{
                      persistentId: file.datasetPersistentId,
                      releasedVersionExists: file.datasetVersion.someDatasetVersionHasBeenReleased,
                      versionNumber: file.datasetVersion.number.toSearchParam(),
                      termsOfAccessForRestrictedFiles:
                        file.datasetVersion.termsOfAccess?.termsOfAccessForRestrictedFiles,
                      requestAccess: file.datasetVersion.termsOfAccess?.fileAccessRequest
                    }}
                    storageIdentifier={file.metadata.storageIdentifier}
                    existingLabels={file.metadata.labels}
                    isTabularFile={file.metadata.isTabular}
                    datasetRepository={datasetRepository}
                  />
                )}
              </ButtonGroup>
            </Col>
          </Row>
          <Tabs activeKey={activeTab} onSelect={handleTabSelect}>
            {fileAssociatedPreviewOrQueryTools.length > 0 && (
              <Tabs.Tab eventKey={FilePageHelper.EXT_TOOL_TAB_KEY} title={externalToolTabTitle}>
                <div className={styles['tab-container']} style={{ paddingTop: '3rem' }}>
                  <FileEmbededExternalTool
                    file={file}
                    associdatedTools={fileAssociatedPreviewOrQueryTools}
                  />
                </div>
              </Tabs.Tab>
            )}
            <Tabs.Tab eventKey="metadata" title={t('tabs.metadata')}>
              <div className={styles['tab-container']}>
                <FileMetadata
                  name={file.name}
                  metadata={file.metadata}
                  permissions={file.permissions}
                  datasetPublishingStatus={file.datasetVersion.publishingStatus}
                />
              </div>
            </Tabs.Tab>
            <Tabs.Tab eventKey="fileVersion" title={t('tabs.versions')}>
              <div className={styles['tab-container']}>
                <FileVersions
                  fileId={file.id}
                  datasetVersionNumber={datasetVersionNumber}
                  fileRepository={repository}
                  canEditOwnerDataset={file.permissions.canEditOwnerDataset}
                  isInView={activeTab === 'fileVersion'}
                />
              </div>
            </Tabs.Tab>
          </Tabs>
          <div className={styles['separation-line']}></div>
        </div>
      </article>
    </>
  )
}
