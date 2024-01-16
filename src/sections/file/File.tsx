import { useTranslation } from 'react-i18next'
import { PageNotFound } from '../page-not-found/PageNotFound'
import styles from './File.module.scss'
import { Tabs } from '@iqss/dataverse-design-system'
import { FileRepository } from '../../files/domain/repositories/FileRepository'
import { useFile } from './useFile'
import { useEffect } from 'react'
import { useLoading } from '../loading/LoadingContext'
import { FileSkeleton } from './FileSkeleton'
import { DatasetLabels } from '../dataset/dataset-labels/DatasetLabels'
import { FileAccessRestrictedIcon } from './file-access/FileAccessRestrictedIcon'
import { FileMetadata } from './file-metadata/FileMetadata'

interface FileProps {
  repository: FileRepository
  id: number
}
export function File({ repository, id }: FileProps) {
  const { setIsLoading } = useLoading()
  const { t } = useTranslation('file')
  const { file, isLoading } = useFile(repository, id)

  useEffect(() => {
    setIsLoading(isLoading)
  }, [isLoading])

  if (isLoading) {
    return <FileSkeleton />
  }

  return (
    <>
      {!file ? (
        <PageNotFound />
      ) : (
        <article>
          <header className={styles.header}>
            <h1>{file.name}</h1>
            <p className={styles.subtext}>
              {t('subtext', { datasetTitle: file.datasetVersion.title })}
            </p>
            <div className={styles.labels}>
              {file.restricted && (
                <div className={styles['restricted-icon']}>
                  <FileAccessRestrictedIcon
                    restricted={file.restricted}
                    canDownloadFile={file.permissions.canDownloadFile}
                  />
                </div>
              )}
              <DatasetLabels labels={file.datasetVersion.labels} />
            </div>
          </header>
          <div className={styles.container}>
            <Tabs defaultActiveKey="metadata">
              <Tabs.Tab eventKey="metadata" title={t('tabs.metadata')}>
                <div className={styles['tab-container']}>
                  <FileMetadata file={file} />
                </div>
              </Tabs.Tab>
            </Tabs>
            <div className={styles['separation-line']}></div>
          </div>
        </article>
      )}
    </>
  )
}