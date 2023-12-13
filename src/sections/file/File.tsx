import { useTranslation } from 'react-i18next'
import { PageNotFound } from '../page-not-found/PageNotFound'
import styles from './File.module.scss'
import { Tabs } from '@iqss/dataverse-design-system'
import { FileRepository } from '../../files/domain/repositories/FileRepository'
import { useFile } from './useFile'

interface FileProps {
  repository: FileRepository
  id: number
}
export function File({ repository, id }: FileProps) {
  const { t } = useTranslation('file')
  const { file } = useFile(repository, id)

  return (
    <>
      {!file ? (
        <PageNotFound />
      ) : (
        <article>
          <header className={styles.header}>
            <h1>{file.name}</h1>
            <span className={styles.subtext}>
              {t('subtext', { datasetTitle: file.datasetTitle })}
            </span>
          </header>
          <div className={styles.container}>
            <Tabs defaultActiveKey="files">
              <Tabs.Tab eventKey="files" title={t('tabs.metadata')}>
                <span></span>
              </Tabs.Tab>
            </Tabs>
            <div className={styles['separation-line']}></div>
          </div>
        </article>
      )}
    </>
  )
}
