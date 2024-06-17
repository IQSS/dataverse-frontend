import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FileRepository } from '../../files/domain/repositories/FileRepository'
import { useLoading } from '../loading/LoadingContext'
import { useDataset } from '../dataset/DatasetContext'
import { PageNotFound } from '../page-not-found/PageNotFound'
import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'
import { FileUploader } from './FileUploader'
import { FileUploadState, FileUploadTools } from '../../files/domain/models/FileUploadState'
import { uploadFile } from '../../files/domain/useCases/uploadFile'
import { UploadedFiles } from './UploadedFiles'
import { addUploadedFile } from '../../files/domain/useCases/addUploadedFile'

interface UploadDatasetFilesProps {
  fileRepository: FileRepository
}

export const UploadDatasetFiles = ({ fileRepository: fileRepository }: UploadDatasetFilesProps) => {
  const { setIsLoading } = useLoading()
  const { dataset, isLoading } = useDataset()
  const { t } = useTranslation('uploadDatasetFiles')
  const [fileUploaderState, setState] = useState(FileUploadTools.createNewState([]))
  const [uploadingToCancelMap, setUploadingToCancelMap] = useState(new Map<string, () => void>())
  const [semaphore, setSemaphore] = useState(new Set<string>())

  const sleep = (delay: number) => new Promise((res) => setTimeout(res, delay))
  const limit = 6

  const acquireSemaphore = async (file: File) => {
    const key = FileUploadTools.key(file)
    setSemaphore((x) => (x.size >= limit ? x : x.add(key)))
    while (!semaphore.has(key)) {
      await sleep(500)
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
    setUploadingToCancelMap((x) => {
      x.delete(key)
      return x
    })
    releaseSemaphore(file)
  }

  const canUpload = (file: File) =>
    !uploadingToCancelMap.has(FileUploadTools.key(file)) &&
    !FileUploadTools.get(file, fileUploaderState).failed &&
    !FileUploadTools.get(file, fileUploaderState).done

  const uploadOneFile = (file: File) => {
    const key = FileUploadTools.key(file)
    if (!canUpload(file)) {
      return
    }
    setState(FileUploadTools.showProgressBar(file, fileUploaderState))
    const cancel = uploadFile(
      fileRepository,
      dataset?.persistentId as string,
      file,
      () => {
        setState(FileUploadTools.done(file, fileUploaderState))
        fileUploadFinished(file)
      },
      () => {
        setState(FileUploadTools.failed(file, fileUploaderState))
        fileUploadFinished(file)
      },
      (now) => setState(FileUploadTools.progress(file, now, fileUploaderState)),
      (storageId) => setState(FileUploadTools.storageId(file, storageId, fileUploaderState))
    )
    setUploadingToCancelMap((x) => x.set(key, cancel))
  }

  const upload = async (files: File[]) => {
    for (const file of files) {
      if (canUpload(file)) {
        await acquireSemaphore(file)
        uploadOneFile(file)
      }
    }
  }

  const cleanup = (file: File) => {
    const key = FileUploadTools.key(file)
    const cancel = uploadingToCancelMap.get(key)
    if (cancel) {
      cancel()
    }
    setUploadingToCancelMap((x) => {
      x.delete(key)
      return x
    })
    releaseSemaphore(file)
  }

  const cancelUpload = (file: File) => {
    cleanup(file)
    setState(FileUploadTools.removed(file, fileUploaderState))
  }

  const deleteFile = (fileUploadState: FileUploadState) => {
    setState((x) => {
      fileUploadState.removed = true
      return { state: x.state, uploaded: x.uploaded }
    })
  }

  const cleanFileState = (file: File) => {
    cleanup(file)
    setState(FileUploadTools.delete(file, fileUploaderState))
  }

  type MutableFile = {
    -readonly [K in keyof File]: File[K]
  }

  const stateToFiles = (state: FileUploadState[]) =>
    state.map((x) => {
      const f = new File([], x.fileName, { type: x.fileType })
      const mutable: MutableFile = f
      mutable.webkitRelativePath = x.fileDir
      const res: File = mutable
      return res
    })

  const cleanAllState = () => {
    stateToFiles(Array.from(fileUploaderState.state.values())).forEach((file) => {
      cleanup(file)
      setState(FileUploadTools.delete(file, fileUploaderState))
    })
  }

  const addFiles = (state: FileUploadState[]) => {
    stateToFiles(state).forEach((file, index) =>
      addUploadedFile(
        fileRepository,
        dataset?.persistentId as string,
        file,
        state[index].storageId as string
      )
    )
  }

  useEffect(() => {
    setIsLoading(isLoading)
  }, [isLoading, setIsLoading])

  if (isLoading) {
    return <p>Temporary Loading until having shape of skeleton</p>
  }

  return (
    <>
      {!dataset ? (
        <PageNotFound />
      ) : (
        <>
          <BreadcrumbsGenerator
            hierarchy={dataset.hierarchy}
            withActionItem
            actionItemText={t('breadcrumbActionItem')}
          />
          <article>
            <FileUploader
              upload={upload}
              cancelTitle={t('cancel')}
              info={t('info')}
              selectText={t('select')}
              fileUploaderState={fileUploaderState}
              cancelUpload={cancelUpload}
              cleanFileState={cleanFileState}
            />
            <UploadedFiles
              fileUploadState={fileUploaderState.uploaded}
              cancelTitle={t('cancel')}
              deleteFile={deleteFile}
              cleanup={cleanAllState}
              addFiles={addFiles}
            />
          </article>
        </>
      )}
    </>
  )
}
