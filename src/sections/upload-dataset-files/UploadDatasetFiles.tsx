import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
// import { md5 } from 'js-md5'
// import { Semaphore } from 'async-mutex'
import { useNavigate } from 'react-router-dom'
import { Tabs } from '@iqss/dataverse-design-system'
import { FileRepository } from '../../files/domain/repositories/FileRepository'
import { useLoading } from '../loading/LoadingContext'
import { useDataset } from '../dataset/DatasetContext'
import { PageNotFound } from '../page-not-found/PageNotFound'
import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'
import { FileUploader, OperationType } from '../shared/file-uploader/FileUploader'
import styles from './UploadDatasetFiles.module.scss'
// import { FileUploader } from './FileUploader'
// import { FileUploadState, FileUploadTools } from '../../files/domain/models/FileUploadState'
// import { uploadFile } from '../../files/domain/useCases/uploadFile'
// import { UploadedFiles } from './uploaded-files-list/UploadedFiles'
// import { addUploadedFiles } from '../../files/domain/useCases/addUploadedFiles'
// import { Route } from '../Route.enum'
// import { Stack } from '@iqss/dataverse-design-system'

interface UploadDatasetFilesProps {
  fileRepository: FileRepository
}

export const UploadDatasetFiles = ({ fileRepository: fileRepository }: UploadDatasetFilesProps) => {
  const { setIsLoading } = useLoading()
  const { dataset, isLoading } = useDataset()
  const { t } = useTranslation('uploadDatasetFiles')
  const { t: tFiles } = useTranslation('files')
  const navigate = useNavigate()
  // const [fileUploaderState, setState] = useState(FileUploadTools.createNewState([]))
  // const [uploadingToCancelMap, setUploadingToCancelMap] = useState(new Map<string, () => void>())

  // const limit = 6
  // const semaphore = new Semaphore(limit)

  // const fileUploadFailed = (file: File) => {
  //   setUploadingToCancelMap((x) => {
  //     x.delete(FileUploadTools.key(file))
  //     return x
  //   })
  //   semaphore.release(1)
  // }

  // const fileUploadFinished = (file: File) => {
  //   const hash = md5.create()
  //   const reader = file.stream().getReader()
  //   reader
  //     .read()
  //     .then(async function updateHash({ done, value }) {
  //       if (done) {
  //         FileUploadTools.checksum(file, hash.hex(), fileUploaderState)
  //       } else {
  //         hash.update(value)
  //         await updateHash(await reader.read())
  //       }
  //     })
  //     .finally(() => {
  //       setUploadingToCancelMap((x) => {
  //         x.delete(FileUploadTools.key(file))
  //         return x
  //       })
  //       semaphore.release(1)
  //     })
  // }

  // const canUpload = (file: File) =>
  //   !uploadingToCancelMap.has(FileUploadTools.key(file)) &&
  //   !FileUploadTools.get(file, fileUploaderState).failed &&
  //   !FileUploadTools.get(file, fileUploaderState).done

  // const uploadOneFile = (file: File) => {
  //   // sanity check: should not happen
  //   /* istanbul ignore next */
  //   if (!canUpload(file)) {
  //     return
  //   }
  //   const key = FileUploadTools.key(file)
  //   setState(FileUploadTools.showProgressBar(file, fileUploaderState))
  //   const cancel = uploadFile(
  //     fileRepository,
  //     dataset?.persistentId as string,
  //     file,
  //     () => {
  //       setState(FileUploadTools.done(file, fileUploaderState))
  //       fileUploadFinished(file)
  //     },
  //     () => {
  //       setState(FileUploadTools.failed(file, fileUploaderState))
  //       fileUploadFailed(file)
  //     },
  //     (now) => setState(FileUploadTools.progress(file, now, fileUploaderState)),
  //     (storageId) => setState(FileUploadTools.storageId(file, storageId, fileUploaderState))
  //   )
  //   setUploadingToCancelMap((x) => x.set(key, cancel))
  // }

  // const upload = async (file: File) => {
  //   await semaphore.acquire(1)
  //   uploadOneFile(file)
  // }

  // const cleanup = (file: File) => {
  //   const key = FileUploadTools.key(file)
  //   const cancel = uploadingToCancelMap.get(key)
  //   if (cancel) {
  //     cancel()
  //   }
  //   setUploadingToCancelMap((x) => {
  //     x.delete(key)
  //     return x
  //   })
  // }

  // const cancelUpload = (file: File) => {
  //   cleanup(file)
  //   setState(FileUploadTools.removed(file, fileUploaderState))
  // }

  // const updateFiles = (fileUploadState: FileUploadState[]) => {
  //   setState((x) => {
  //     fileUploadState.forEach((file) => {
  //       x.state.set(file.key, file)
  //     })
  //     return { state: x.state, uploaded: x.uploaded }
  //   })
  // }

  // const cleanFileState = (file: File) => {
  //   cleanup(file)
  //   setState(FileUploadTools.delete(file, fileUploaderState))
  // }

  // const cleanAllState = () => {
  //   setState((x) => {
  //     Array.from(x.state.values()).forEach((fileUploadState) => {
  //       fileUploadState.removed = true
  //     })
  //     return { state: x.state, uploaded: x.uploaded }
  //   })
  // }

  // const addFiles = (state: FileUploadState[]) => {
  //   setIsLoading(true)
  //   const done = () => {
  //     setIsLoading(false)
  //     navigate(`${Route.DATASETS}?persistentId=${dataset?.persistentId as string}&version=:draft`)
  //   }
  //   const uploadedFiles = FileUploadTools.mapToUploadedFilesDTOs(state)
  //   addUploadedFiles(fileRepository, dataset?.persistentId as string, uploadedFiles, done)
  //   cleanAllState()
  // }

  // const saveDisabled = () =>
  //   Array.from(fileUploaderState.state.values()).some((x) => !(x.failed || x.done || x.removed))

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
          <Tabs defaultActiveKey="files">
            <Tabs.Tab eventKey="files" title={tFiles('files')}>
              <div className={styles.tab_container}>
                <FileUploader
                  fileRepository={fileRepository}
                  datasetPersistentId={dataset.persistentId}
                  storageType="S3"
                  operationType={OperationType.ADD_FILES_TO_DATASET}
                />
              </div>
            </Tabs.Tab>
          </Tabs>
        </>
      )}
    </>
  )
}
