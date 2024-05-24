import { useEffect, useState } from 'react'
import { FileRepository } from '../../files/domain/repositories/FileRepository'
import { useLoading } from '../loading/LoadingContext'
import { useDataset } from '../dataset/DatasetContext'
import { PageNotFound } from '../page-not-found/PageNotFound'
import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'
import { FileUploader } from './FileUploader'
import { FileUploadTools } from '../../files/domain/models/FileUploadState'
import { uploadFile } from '../../files/domain/useCases/uploadFile'
import { useTranslation } from 'react-i18next'

interface UploadDatasetFilesProps {
  fileRepository: FileRepository
}

export const UploadDatasetFiles = ({ fileRepository: fileRepository }: UploadDatasetFilesProps) => {
  const { t } = useTranslation('files')
  const { setIsLoading } = useLoading()
  const { dataset, isLoading } = useDataset()
  const [fileUploaderState, setState] = useState(FileUploadTools.createNewState([]))
  const [uploadingToCancelMap, setUploadingToCancelMap] = useState(new Map<string, () => void>())
  const [uploadFinished, setUploadFinished] = useState(new Set<string>())
  const [semaphore, setSemaphore] = useState(new Set<string>())

  const timeout = (delay: number) => new Promise((res) => setTimeout(res, delay))
  const limit = 10

  const acquireSemaphore = async (file: File) => {
    const key = FileUploadTools.key(file)
    setSemaphore((x) => (x.size >= limit ? x : x.add(key)))
    while (!semaphore.has(key)) {
      await timeout(500)
      setSemaphore((x) => (x.size >= limit ? x : x.add(key)))
    }
  }

  const releaseSemaphore = (file: File) => {
    setSemaphore((x) => {
      x.delete(FileUploadTools.key(file))
      return x
    })
  }

  const fileUploadFinished = (file: File) => {
    const key = FileUploadTools.key(file)
    setUploadFinished((x) => x.add(key))
    setUploadingToCancelMap((x) => {
      x.delete(key)
      return x
    })
    releaseSemaphore(file)
  }

  const uploadOneFile = (file: File) => {
    if (!dataset) {
      throw new Error('upload failed: dataset undefined')
    }
    const key = FileUploadTools.key(file)
    if (uploadingToCancelMap.has(key) || uploadFinished.has(key)) {
      return
    }
    const cancel = uploadFile(
      fileRepository,
      dataset.persistentId,
      file,
      () => {
        setState(FileUploadTools.done(file, fileUploaderState))
        fileUploadFinished(file)
      },
      () => {
        setState(FileUploadTools.failed(file, fileUploaderState))
        fileUploadFinished(file)
      },
      (now) => setState(FileUploadTools.progress(file, now, fileUploaderState))
    )
    setUploadingToCancelMap((x) => x.set(key, cancel))
  }

  const upload = async (files: File[]) => {
    for (const file of files) {
      const key = FileUploadTools.key(file)
      if (!uploadingToCancelMap.has(key) && !uploadFinished.has(key)) {
        await acquireSemaphore(file)
        uploadOneFile(file)
      }
    }
  }

  const cancelUpload = (file: File) => {
    const key = FileUploadTools.key(file)
    const cancel = uploadingToCancelMap.get(key)
    if (cancel) {
      cancel()
      releaseSemaphore(file)
    }
    setUploadingToCancelMap((x) => {
      x.delete(key)
      return x
    })
    setState(FileUploadTools.removed(file, fileUploaderState))
  }

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
            <FileUploader
              upload={upload}
              cancelTitle={t('upload.cancel')}
              info={t('upload.info')}
              selectText={t('upload.select')}
              fileUploaderState={fileUploaderState}
              cancelUpload={cancelUpload}
            />
          </article>
        </>
      )}
    </>
  )
}
