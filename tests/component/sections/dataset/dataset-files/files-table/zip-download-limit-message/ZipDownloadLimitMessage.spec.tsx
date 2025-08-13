import { FileMetadataMother } from '../../../../../files/domain/models/FileMetadataMother'
import { ZipDownloadLimitMessage } from '../../../../../../../src/sections/dataset/dataset-files/files-table/zip-download-limit-message/ZipDownloadLimitMessage'
import { FileSize, FileSizeUnit } from '../../../../../../../src/files/domain/models/FileMetadata'
import { SettingMother } from '../../../../../settings/domain/models/SettingMother'
import { ZipDownloadLimit } from '../../../../../../../src/settings/domain/models/ZipDownloadLimit'
import { SettingsProvider } from '@/sections/settings/SettingsProvider'
import { FilePreviewMother } from '../../../../../files/domain/models/FilePreviewMother'
import { DataverseInfoRepository } from '@/info/domain/repositories/DataverseInfoRepository'

const fileSelection = {
  0: FilePreviewMother.create({
    metadata: FileMetadataMother.create({ size: new FileSize(1024, FileSizeUnit.BYTES) })
  }),
  1: FilePreviewMother.create({
    metadata: FileMetadataMother.create({ size: new FileSize(2048, FileSizeUnit.BYTES) })
  })
}
const zipDownloadLimit = new ZipDownloadLimit(500, FileSizeUnit.BYTES)
const filesTotalDownloadSize = 3072 // 3.0 KB

const dataverseInfoRepository = {} as DataverseInfoRepository

describe('ZipDownloadLimitMessage', () => {
  beforeEach(() => {
    dataverseInfoRepository.getZipDownloadLimit = cy
      .stub()
      .resolves(SettingMother.createZipDownloadLimit(zipDownloadLimit))
    dataverseInfoRepository.getHasPublicStore = cy.stub().resolves({})
    dataverseInfoRepository.getExternalStatusesAllowed = cy.stub().resolves({})
    dataverseInfoRepository.getMaxEmbargoDurationInMonths = cy.stub().resolves({})
  })

  it('should not render if there is less than 1 file selected', () => {
    cy.customMount(
      <SettingsProvider dataverseInfoRepository={dataverseInfoRepository}>
        <ZipDownloadLimitMessage
          fileSelection={{
            0: FilePreviewMother.create({
              metadata: FileMetadataMother.create({ size: new FileSize(1024, FileSizeUnit.BYTES) })
            })
          }}
          visitedFiles={{}}
          filesTotalDownloadSize={filesTotalDownloadSize}
        />
      </SettingsProvider>
    )

    cy.findByText(/The overall size of the files selected/).should('not.exist')
  })

  it('should not render if the zipDownloadLimit is not exceeded', () => {
    cy.customMount(
      <SettingsProvider dataverseInfoRepository={dataverseInfoRepository}>
        <ZipDownloadLimitMessage
          fileSelection={{
            0: FilePreviewMother.create({
              metadata: FileMetadataMother.create({ size: new FileSize(1, FileSizeUnit.BYTES) })
            }),
            1: FilePreviewMother.create({
              metadata: FileMetadataMother.create({ size: new FileSize(1, FileSizeUnit.BYTES) })
            })
          }}
          visitedFiles={{}}
          filesTotalDownloadSize={filesTotalDownloadSize}
        />
      </SettingsProvider>
    )

    cy.findByText(/The overall size of the files selected/).should('not.exist')
  })

  it('should render if there is more than 1 file and they exceed the zipDownloadLimit', () => {
    cy.customMount(
      <SettingsProvider dataverseInfoRepository={dataverseInfoRepository}>
        <ZipDownloadLimitMessage
          fileSelection={fileSelection}
          visitedFiles={{}}
          filesTotalDownloadSize={filesTotalDownloadSize}
        />
      </SettingsProvider>
    )

    cy.findByText(
      'The overall size of the files selected (3.0 KB) for download exceeds the zip limit of 500.0 B. Please unselect some files to continue.'
    ).should('exist')
  })

  it('should show the more than 1024 PB message if the total size is too big', () => {
    cy.customMount(
      <SettingsProvider dataverseInfoRepository={dataverseInfoRepository}>
        <ZipDownloadLimitMessage
          fileSelection={{
            0: FilePreviewMother.create({
              metadata: FileMetadataMother.create({
                size: new FileSize(1000000, FileSizeUnit.PETABYTES)
              })
            }),
            1: FilePreviewMother.create({
              metadata: FileMetadataMother.create({
                size: new FileSize(1000000, FileSizeUnit.PETABYTES)
              })
            })
          }}
          visitedFiles={{}}
          filesTotalDownloadSize={filesTotalDownloadSize}
        />
      </SettingsProvider>
    )

    cy.findByText(
      'The overall size of the files selected (more than 1024.0 PB) for download exceeds the zip limit of 500.0 B. Please unselect some files to continue.'
    ).should('exist')
  })

  it('should show the total size of the files selected when there is a unknown File in the fileSelection', () => {
    cy.customMount(
      <SettingsProvider dataverseInfoRepository={dataverseInfoRepository}>
        <ZipDownloadLimitMessage
          fileSelection={{
            0: FilePreviewMother.create({
              metadata: FileMetadataMother.create({
                size: new FileSize(1000000, FileSizeUnit.PETABYTES)
              })
            }),
            1: FilePreviewMother.create({
              metadata: FileMetadataMother.create({
                size: new FileSize(1000000, FileSizeUnit.PETABYTES)
              })
            }),
            2: undefined
          }}
          visitedFiles={{}}
          filesTotalDownloadSize={filesTotalDownloadSize}
        />
      </SettingsProvider>
    )

    cy.findByText(
      'The overall size of the files selected (3.0 KB) for download exceeds the zip limit of 500.0 B. Please unselect some files to continue.'
    ).should('exist')
  })

  it('should subtract the size of the files that are not in the fileSelection but they are in the visitedFiles when there is an unknown file', () => {
    const zipDownloadLimit = new ZipDownloadLimit(1, FileSizeUnit.BYTES)

    dataverseInfoRepository.getZipDownloadLimit = cy
      .stub()
      .resolves(SettingMother.createZipDownloadLimit(zipDownloadLimit))

    const filesTotalDownloadSize = 4
    cy.customMount(
      <SettingsProvider dataverseInfoRepository={dataverseInfoRepository}>
        <ZipDownloadLimitMessage
          fileSelection={{
            0: FilePreviewMother.create({
              metadata: FileMetadataMother.create({ size: new FileSize(1, FileSizeUnit.BYTES) })
            }),
            1: FilePreviewMother.create({
              metadata: FileMetadataMother.create({ size: new FileSize(1, FileSizeUnit.BYTES) })
            }),
            3: undefined
          }}
          visitedFiles={{
            0: FilePreviewMother.create({
              metadata: FileMetadataMother.create({ size: new FileSize(1, FileSizeUnit.BYTES) })
            }),
            1: FilePreviewMother.create({
              metadata: FileMetadataMother.create({ size: new FileSize(1, FileSizeUnit.BYTES) })
            }),
            2: FilePreviewMother.create({
              metadata: FileMetadataMother.create({ size: new FileSize(1, FileSizeUnit.BYTES) })
            }),
            3: undefined
          }}
          filesTotalDownloadSize={filesTotalDownloadSize}
        />
      </SettingsProvider>
    )

    cy.findByText(
      'The overall size of the files selected (3.0 B) for download exceeds the zip limit of 1.0 B. Please unselect some files to continue.'
    ).should('exist')
  })

  it('should show the total size of files when there are more files in the fileSelection than in the visitedFiles', () => {
    const zipDownloadLimit = new ZipDownloadLimit(1, FileSizeUnit.BYTES)
    dataverseInfoRepository.getZipDownloadLimit = cy
      .stub()
      .resolves(SettingMother.createZipDownloadLimit(zipDownloadLimit))

    const filesTotalDownloadSize = 4
    cy.customMount(
      <SettingsProvider dataverseInfoRepository={dataverseInfoRepository}>
        <ZipDownloadLimitMessage
          fileSelection={{
            0: FilePreviewMother.create({
              metadata: FileMetadataMother.create({ size: new FileSize(1, FileSizeUnit.BYTES) })
            }),
            1: FilePreviewMother.create({
              metadata: FileMetadataMother.create({ size: new FileSize(1, FileSizeUnit.BYTES) })
            }),
            2: FilePreviewMother.create({
              metadata: FileMetadataMother.create({ size: new FileSize(1, FileSizeUnit.BYTES) })
            }),
            3: undefined,
            4: FilePreviewMother.create({
              metadata: FileMetadataMother.create({ size: new FileSize(1, FileSizeUnit.BYTES) })
            })
          }}
          visitedFiles={{
            0: FilePreviewMother.create({
              metadata: FileMetadataMother.create({ size: new FileSize(1, FileSizeUnit.BYTES) })
            }),
            1: FilePreviewMother.create({
              metadata: FileMetadataMother.create({ size: new FileSize(1, FileSizeUnit.BYTES) })
            }),
            2: FilePreviewMother.create({
              metadata: FileMetadataMother.create({ size: new FileSize(1, FileSizeUnit.BYTES) })
            }),
            3: undefined
          }}
          filesTotalDownloadSize={filesTotalDownloadSize}
        />
      </SettingsProvider>
    )

    cy.findByText(
      'The overall size of the files selected (4.0 B) for download exceeds the zip limit of 1.0 B. Please unselect some files to continue.'
    ).should('exist')
  })
})
