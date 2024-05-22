import { useEffect, useState } from 'react'
import { FileRepository } from '../../files/domain/repositories/FileRepository'
import { useLoading } from '../loading/LoadingContext'
import { useDataset } from '../dataset/DatasetContext'
import { PageNotFound } from '../page-not-found/PageNotFound'
import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'
import { FileUploader } from './FileUploader'
import { FileUploadTools } from '../../files/domain/models/FileUploadState'

interface UploadDatasetFilesProps {
  fileRepository: FileRepository
}

export const UploadDatasetFiles = ({
  fileRepository: _fileRepository
}: UploadDatasetFilesProps) => {
  const { setIsLoading } = useLoading()
  const { dataset, isLoading } = useDataset()
  const [fileUploaderState, setState] = useState(FileUploadTools.createNewState([]))

  //TODO: implement with jsdv
  const upload = (files: File[]) => {
    console.log(files)
    /*let newState = fileUploaderState
    files.forEach((f) => {
      const now = FileUploadTools.get(f, newState).progress + 10
      newState = FileUploadTools.progress(f, now, newState)
    })
    setState(newState)*/
  }

  const cancelUpload = (file: File) => {
    //TODO: cancel upload with jsdv
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
              cancelTitle={'Cancel upload'}
              info={'Drag and drop files here.'}
              selectText={'Select Files to Add'}
              fileUploaderState={fileUploaderState}
              cancelUpload={cancelUpload}
            />
          </article>
        </>
      )}
    </>
  )
}
