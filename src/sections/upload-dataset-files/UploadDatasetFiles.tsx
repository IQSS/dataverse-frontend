import { useEffect } from 'react'
import { FileRepository } from '../../files/domain/repositories/FileRepository'
import { useLoading } from '../loading/LoadingContext'
import { useDataset } from '../dataset/DatasetContext'
import { PageNotFound } from '../page-not-found/PageNotFound'
import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'
import { Accordion, Form, Tabs } from '@iqss/dataverse-design-system'
import styles from '../dataset/Dataset.module.scss'
import { useTranslation } from 'react-i18next'

interface UploadDatasetFilesProps {
  fileRepository: FileRepository
}

export const UploadDatasetFiles = ({
  fileRepository: _fileRepository
}: UploadDatasetFilesProps) => {
  const { setIsLoading } = useLoading()
  const { dataset, isLoading } = useDataset()
  const { t } = useTranslation('uploadDatasetFiles')
  useEffect(() => {
    setIsLoading(isLoading)
  }, [isLoading])

  if (isLoading) {
    return <p>Temporary Loading until having shape of skeleton</p>
  }

  return (
    <>
      {!dataset ? (
        <PageNotFound />
      ) : (
        <>
          <BreadcrumbsGenerator hierarchy={dataset.hierarchy} />
          <article>
            <Tabs defaultActiveKey="files">
              <Tabs.Tab eventKey="files" title={t('filesTabTitle')}>
                <div className={styles['tab-container']}>
                  {t('fileTypeSupport')}
                  <Accordion defaultActiveKey="upload">
                    <Accordion.Item eventKey="upload" key="uploadKey">
                      <Accordion.Header>{t('accordionHeader')}</Accordion.Header>
                      <Accordion.Body>
                        <Form>
                          <Form.Group controlId="basic-form-username">
                            <Form.Group.Label>Select Files to Add</Form.Group.Label>
                            <Form.Group.Input type="file" placeholder="File" />
                          </Form.Group>
                        </Form>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </div>
              </Tabs.Tab>
            </Tabs>
          </article>
        </>
      )}
    </>
  )
}
