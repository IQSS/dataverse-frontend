import { ReactNode } from 'react'
import { renderHook } from '@testing-library/react'
import { toast } from 'react-toastify'
import { useReplaceFile } from '@/sections/shared/file-uploader/useReplaceFile'
import { FileUploaderProvider } from '@/sections/shared/file-uploader/context/FileUploaderContext'
import {
  FileUploaderGlobalConfig,
  UploadedFile
} from '@/sections/shared/file-uploader/context/fileUploaderReducer'
import { OperationType } from '@/sections/shared/file-uploader/FileUploader'
import { UploaderFileRepository } from '@/sections/shared/file-uploader/types'
import { FixityAlgorithm } from '@/files/domain/models/FixityAlgorithm'
import { FileMother } from '@tests/component/files/domain/models/FileMother'

describe('useReplaceFile', () => {
  it('reports that replacing is unsupported when the repository cannot replace files', async () => {
    const toastError = cy.stub(toast, 'error')
    const standaloneRepository = {} as UploaderFileRepository
    const initialConfig = {
      checksumAlgorithm: FixityAlgorithm.MD5,
      storageType: 'S3',
      operationType: OperationType.REPLACE_FILE,
      originalFile: FileMother.create()
    } as FileUploaderGlobalConfig
    const wrapper = ({ children }: { children: ReactNode }) => (
      <FileUploaderProvider initialConfig={initialConfig}>{children}</FileUploaderProvider>
    )

    const { result } = renderHook(() => useReplaceFile(standaloneRepository), { wrapper })
    await result.current.submitReplaceFile(1, { fileName: 'new.txt' } as UploadedFile)

    expect(toastError).to.have.been.calledWith(
      'File replacement is not supported in standalone mode'
    )
  })
})
