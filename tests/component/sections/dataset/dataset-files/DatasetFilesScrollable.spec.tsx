import { FileMetadataMother } from '../../../files/domain/models/FileMetadataMother'
import { FileRepository } from '../../../../../src/files/domain/repositories/FileRepository'
import {
  FileAccessOption,
  FileCriteria,
  FileSortByOption,
  FileTag
} from '../../../../../src/files/domain/models/FileCriteria'
import { FilesCountInfoMother } from '../../../files/domain/models/FilesCountInfoMother'
import {
  FileSize,
  FileSizeUnit,
  FileType
} from '../../../../../src/files/domain/models/FileMetadata'
import styles from '../../../../../src/sections/dataset/dataset-files/files-table/FilesTable.module.scss'
import { DatasetMother } from '../../../dataset/domain/models/DatasetMother'
import { SettingMother } from '../../../settings/domain/models/SettingMother'
import { ZipDownloadLimit } from '../../../../../src/settings/domain/models/ZipDownloadLimit'
import { SettingsProvider } from '../../../../../src/sections/settings/SettingsProvider'
import { FilePaginationInfo } from '../../../../../src/files/domain/models/FilePaginationInfo'
import { FilePreviewMother } from '../../../files/domain/models/FilePreviewMother'
import { DatasetFilesScrollable } from '../../../../../src/sections/dataset/dataset-files/DatasetFilesScrollable'
import { FilesWithCount } from '../../../../../src/files/domain/models/FilesWithCount'
import { getCellStyle } from '../../../../../src/sections/dataset/dataset-files/files-table/FilesTableScrollable'
import { DataverseInfoRepository } from '@/info/domain/repositories/DataverseInfoRepository'

const TOTAL_FILES_COUNT = 200
const ONLY_4_FILES_COUNT = 4
const allFiles = FilePreviewMother.createMany(TOTAL_FILES_COUNT)
const first10Files = allFiles.slice(0, 10)

const testFiles: FilesWithCount = {
  files: first10Files,
  totalFilesCount: TOTAL_FILES_COUNT
}

const only4Files: FilesWithCount = {
  files: allFiles.slice(0, ONLY_4_FILES_COUNT),
  totalFilesCount: ONLY_4_FILES_COUNT
}

const datasetPersistentId = 'test-dataset-persistent-id'
const datasetVersion = DatasetMother.create().version
const fileRepository: FileRepository = {} as FileRepository
const testFilesCountInfo = FilesCountInfoMother.create({
  total: 200,
  perFileType: [
    {
      type: new FileType('text/plain'),
      count: 5
    },
    {
      type: new FileType('image/png'),
      count: 485
    }
  ],
  perAccess: [
    { access: FileAccessOption.PUBLIC, count: 222 },
    { access: FileAccessOption.RESTRICTED, count: 10 }
  ],
  perFileTag: [
    { tag: new FileTag('document'), count: 5 },
    { tag: new FileTag('code'), count: 10 }
  ]
})
const dataverseInfoRepository = {} as DataverseInfoRepository

describe('DatasetFilesScrollable', () => {
  beforeEach(() => {
    cy.viewport(1280, 720)
    fileRepository.getAllByDatasetPersistentIdWithCount = cy.stub().resolves(testFiles)
    fileRepository.getFilesCountInfoByDatasetPersistentId = cy.stub().resolves(testFilesCountInfo)
    fileRepository.getFilesTotalDownloadSizeByDatasetPersistentId = cy.stub().resolves(19900)

    dataverseInfoRepository.getZipDownloadLimit = cy
      .stub()
      .resolves(SettingMother.createZipDownloadLimit(new ZipDownloadLimit(1, FileSizeUnit.BYTES)))
    dataverseInfoRepository.getMaxEmbargoDurationInMonths = cy
      .stub()
      .resolves(SettingMother.createMaxEmbargoDurationInMonths(12))
    dataverseInfoRepository.getHasPublicStore = cy.stub().resolves({})
    dataverseInfoRepository.getExternalStatusesAllowed = cy.stub().resolves({})
  })

  it('renders the scrollable files table', () => {
    cy.customMount(
      <DatasetFilesScrollable
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )

    cy.wait(1000)
    cy.findByRole('table').should('exist')
    cy.findByRole('columnheader', { name: /Files/ }).should('exist')
  })

  it('renders the scrollable files table when user has no edit permission', () => {
    cy.customMount(
      <DatasetFilesScrollable
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
        canUpdateDataset={false}
      />
    )

    cy.wait(1000)
    cy.findByRole('table').should('exist')
    cy.findByRole('columnheader', { name: /Files/ }).should('exist')
  })

  it('renders the first 10 files', () => {
    cy.customMount(
      <DatasetFilesScrollable
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )

    cy.findByText('10 of 200 Files displayed').should('exist')
    first10Files.forEach((file) => {
      cy.findByText(file.name)
        .should('exist')
        .should('have.attr', 'href', `/files?id=${file.id}&datasetVersion=1.0`)
    })
  })

  it('renders the no files message when there are no files', () => {
    fileRepository.getAllByDatasetPersistentIdWithCount = cy.stub().resolves({
      files: [],
      totalFilesCount: 0
    })
    cy.customMount(
      <DatasetFilesScrollable
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )

    cy.findByText('There are no files in this dataset.').should('exist')
  })

  describe('Infinite Scrolling', () => {
    it('renders 4 files with no more to load, correct results in header, and no bottom skeleton loader', () => {
      fileRepository.getAllByDatasetPersistentIdWithCount = cy.stub().resolves(only4Files)

      cy.customMount(
        <DatasetFilesScrollable
          filesRepository={fileRepository}
          datasetPersistentId={datasetPersistentId}
          datasetVersion={datasetVersion}
        />
      )

      cy.findByText(`${ONLY_4_FILES_COUNT} Files`).should('exist')
      only4Files.files.forEach((file) => {
        cy.findByText(file.name)
          .should('exist')
          .should('have.attr', 'href', `/files?id=${file.id}&datasetVersion=1.0`)
      })
      cy.findByTestId('table-row-loading-skeleton').should('not.exist')
    })

    it('loads more files when scrolling to the bottom ', () => {
      cy.customMount(
        <DatasetFilesScrollable
          filesRepository={fileRepository}
          datasetPersistentId={datasetPersistentId}
          datasetVersion={datasetVersion}
        />
      )

      cy.findByText('10 of 200 Files displayed').should('exist')

      cy.findByTestId('scrollable-files-container').as('scrollableFilesContainer')
      cy.get('@scrollableFilesContainer').scrollTo('bottom')

      cy.findByText('20 of 200 Files displayed').should('exist')

      cy.get('@scrollableFilesContainer').scrollTo('bottom')

      cy.findByText('30 of 200 Files displayed').should('exist')
    })

    it('scrolls to the top when criteria changes', () => {
      cy.customMount(
        <DatasetFilesScrollable
          filesRepository={fileRepository}
          datasetPersistentId={datasetPersistentId}
          datasetVersion={datasetVersion}
        />
      )

      cy.findByText('10 of 200 Files displayed').should('exist')
      cy.findByTestId('scrollable-files-container').as('scrollableFilesContainer')
      cy.get('@scrollableFilesContainer').scrollTo('bottom')

      cy.findByText('20 of 200 Files displayed').should('exist')

      cy.findByRole('button', { name: /Sort/ }).click()
      cy.findByText('Name (Z-A)').should('exist').click()

      cy.get('@scrollableFilesContainer').then(($el) => {
        expect($el[0].scrollTop).to.equal(0)
      })
    })

    describe('Sticky elements', () => {
      it('should stick the header table when scrolling down', () => {
        cy.customMount(
          <DatasetFilesScrollable
            filesRepository={fileRepository}
            datasetPersistentId={datasetPersistentId}
            datasetVersion={datasetVersion}
          />
        )

        cy.findByText('10 of 200 Files displayed').should('exist')

        cy.findByTestId('scrollable-files-container').as('scrollableFilesContainer')
        cy.get('@scrollableFilesContainer').scrollTo('bottom')

        cy.findByText('20 of 200 Files displayed').should('exist')

        cy.get('@scrollableFilesContainer').scrollTo('bottom')

        cy.findByText('30 of 200 Files displayed').should('exist')

        cy.get('@scrollableFilesContainer').scrollTo('top')

        cy.get('thead').should('have.css', 'position', 'sticky').should('be.visible')
      })

      it('should stick the table top messages on top of the table header when scrolling down with selected files', () => {
        cy.customMount(
          <SettingsProvider dataverseInfoRepository={dataverseInfoRepository}>
            <DatasetFilesScrollable
              filesRepository={fileRepository}
              datasetPersistentId={datasetPersistentId}
              datasetVersion={datasetVersion}
            />
          </SettingsProvider>
        )

        cy.findByText('10 of 200 Files displayed').should('exist')

        cy.get('table > tbody > tr:nth-child(2) > td:nth-child(1) > input[type=checkbox]').click()
        cy.findByText('1 file is currently selected.').should('exist')

        cy.findByTestId('scrollable-files-container').as('scrollableFilesContainer')
        cy.get('@scrollableFilesContainer').scrollTo('bottom')

        cy.findByText('20 of 200 Files displayed').should('exist')

        cy.get('@scrollableFilesContainer').scrollTo('bottom')

        cy.findByText('30 of 200 Files displayed').should('exist')

        cy.get('@scrollableFilesContainer').scrollTo('top')

        cy.findByTestId('table-top-messages')
          .should('have.css', 'position', 'sticky')
          .should('be.visible')
        cy.get('thead').should('have.css', 'position', 'sticky').should('be.visible')
      })

      it('table header should have css top value according to criteria container height', () => {
        cy.customMount(
          <SettingsProvider dataverseInfoRepository={dataverseInfoRepository}>
            <DatasetFilesScrollable
              filesRepository={fileRepository}
              datasetPersistentId={datasetPersistentId}
              datasetVersion={datasetVersion}
            />
          </SettingsProvider>
        )

        cy.findByText('10 of 200 Files displayed').should('exist')

        cy.findByTestId('scrollable-files-container').as('scrollableFilesContainer')
        cy.get('@scrollableFilesContainer').scrollTo('bottom')

        cy.findByText('20 of 200 Files displayed').should('exist')

        cy.get('@scrollableFilesContainer').scrollTo('bottom')

        cy.findByText('30 of 200 Files displayed').should('exist')

        cy.get('@scrollableFilesContainer').scrollTo('top')

        cy.findByTestId('criteria-form-container').as('criteriaFormContainer')
        cy.get('@criteriaFormContainer').then(($el) => {
          const criteriaContainerHeight = $el[0].clientHeight

          cy.get('thead').then(($el) => {
            const tableHeaderTopValue = $el[0].getBoundingClientRect().top

            expect(tableHeaderTopValue).to.closeTo(criteriaContainerHeight, 1)
          })
        })
      })

      it('table header should have css top value according to criteria container height + top messages container height when selected files ,top messages container should have top value only according to criteria container height', () => {
        cy.customMount(
          <SettingsProvider dataverseInfoRepository={dataverseInfoRepository}>
            <DatasetFilesScrollable
              filesRepository={fileRepository}
              datasetPersistentId={datasetPersistentId}
              datasetVersion={datasetVersion}
            />
          </SettingsProvider>
        )

        cy.findByRole('columnheader', { name: '10 of 200 Files displayed' }).should('exist')
        cy.findByTestId('header-checkbox').should('be.visible').click({ force: true })
        cy.findByText(/^\d+ files are currently selected\.$/)
          .invoke('text')
          .then((text) => {
            const count = parseInt(text.split(' ')[0], 10)
            expect(count).to.be.gte(10)
          })

        cy.findByTestId('scrollable-files-container').as('scrollableFilesContainer')
        cy.get('@scrollableFilesContainer').scrollTo('bottom')

        cy.findByText('20 of 200 Files displayed').should('exist')

        cy.get('@scrollableFilesContainer').scrollTo('bottom')

        cy.findByText('30 of 200 Files displayed').should('exist')

        cy.get('@scrollableFilesContainer').scrollTo('top')

        cy.findByTestId('criteria-form-container').as('criteriaFormContainer')
        cy.get('@criteriaFormContainer')
          .then(($el) => {
            const criteriaContainerHeight = $el[0].clientHeight

            return criteriaContainerHeight
          })
          .then((criteriaContainerHeight) => {
            cy.findByTestId('table-top-messages').should(
              'have.css',
              'top',
              `${criteriaContainerHeight}px`
            )

            cy.findByTestId('table-top-messages')
              .then(($el) => {
                const tableTopMessagesHeight = $el[0].clientHeight

                return tableTopMessagesHeight
              })
              .then((tableTopMessagesHeight) => {
                const totalTopHeight = criteriaContainerHeight + tableTopMessagesHeight

                cy.get('thead').then(($el) => {
                  const tableHeaderTopValue = $el[0].getBoundingClientRect().top

                  expect(tableHeaderTopValue).to.be.closeTo(totalTopHeight, 1)
                })
              })
          })
      })
    })
  })

  describe('File selection', () => {
    it('selects first 10 files when clicking the top header checkbox', () => {
      cy.customMount(
        <DatasetFilesScrollable
          filesRepository={fileRepository}
          datasetPersistentId={datasetPersistentId}
          datasetVersion={datasetVersion}
        />
      )
      cy.findByRole('columnheader', { name: '10 of 200 Files displayed' }).should('exist')
      cy.findByTestId('header-checkbox').should('be.visible').check({ force: true })
      cy.findByText(/^\d+ files are currently selected\.$/)
        .invoke('text')
        .then((text) => {
          const count = parseInt(text.split(' ')[0], 10)
          expect(count).to.be.gte(10)
        })
    })

    it('selects all files when clicking the select all button', () => {
      cy.customMount(
        <DatasetFilesScrollable
          filesRepository={fileRepository}
          datasetPersistentId={datasetPersistentId}
          datasetVersion={datasetVersion}
        />
      )
      cy.findByRole('columnheader', { name: '10 of 200 Files displayed' }).should('exist')
      cy.findByTestId('header-checkbox').should('be.visible').check({ force: true })
      cy.findByText(/^\d+ files are currently selected\.$/)
        .invoke('text')
        .then((text) => {
          const count = parseInt(text.split(' ')[0], 10)
          expect(count).to.be.gte(10)
        })
      cy.findByRole('button', { name: 'Select all 200 files in this dataset.' }).click({
        force: true
      })
      cy.findByText('200 files are currently selected.').should('exist')
    })

    it('selects all files when clicking the select all button and mantains selection when loading more on scroll to bottom', () => {
      cy.customMount(
        <DatasetFilesScrollable
          filesRepository={fileRepository}
          datasetPersistentId={datasetPersistentId}
          datasetVersion={datasetVersion}
        />
      )
      cy.findByRole('columnheader', { name: '10 of 200 Files displayed' }).should('exist')
      cy.findByTestId('header-checkbox').should('be.visible').check({ force: true })
      cy.findByText(/^\d+ files are currently selected\.$/)
        .invoke('text')
        .then((text) => {
          const count = parseInt(text.split(' ')[0], 10)
          expect(count).to.be.gte(10)
        })
      cy.findByRole('button', { name: 'Select all 200 files in this dataset.' }).click()
      cy.findByText('200 files are currently selected.').should('exist')

      // Scroll to bottom to load more files
      cy.findByTestId('scrollable-files-container').as('scrollableFilesContainer')
      cy.get('@scrollableFilesContainer').scrollTo('bottom')

      cy.findByText('200 files are currently selected.').should('exist')
      cy.findByRole('columnheader', { name: '20 of 200 Files displayed' }).should('exist')

      // Scroll to bottom to load more files
      cy.get('@scrollableFilesContainer').scrollTo('bottom')

      cy.findByText('200 files are currently selected.').should('exist')
      cy.findByRole('columnheader', { name: '30 of 200 Files displayed' }).should('exist')

      // Scroll to bottom to load more files
      cy.get('@scrollableFilesContainer').scrollTo('bottom')

      cy.findByText('200 files are currently selected.').should('exist')
      cy.findByRole('columnheader', { name: '40 of 200 Files displayed' }).should('exist')
    })

    it('maintains the selection when scrolling to bottom and loading more files', () => {
      cy.customMount(
        <DatasetFilesScrollable
          filesRepository={fileRepository}
          datasetPersistentId={datasetPersistentId}
          datasetVersion={datasetVersion}
        />
      )
      cy.findByRole('columnheader', { name: '10 of 200 Files displayed' }).should('exist')
      cy.get('table > tbody > tr:nth-child(2) > td:nth-child(1) > input[type=checkbox]').click()
      cy.get('table > tbody > tr:nth-child(2)').should('have.class', styles['selected-row'])
      cy.findByText('1 file is currently selected.').should('exist')

      // Scroll to bottom to load more files
      cy.findByTestId('scrollable-files-container').as('scrollableFilesContainer')
      cy.get('@scrollableFilesContainer').scrollTo('bottom')

      cy.findByRole('columnheader', { name: '20 of 200 Files displayed' }).should('exist')

      cy.get('table > tbody > tr:nth-child(2)').should('have.class', styles['selected-row'])
      cy.findByText('1 file is currently selected.').should('exist')

      // Scroll to bottom to load more files
      cy.get('@scrollableFilesContainer').scrollTo('bottom')

      cy.findByRole('columnheader', { name: '30 of 200 Files displayed' }).should('exist')
      cy.get('table > tbody > tr:nth-child(2)').should('have.class', styles['selected-row'])
      cy.findByText('1 file is currently selected.').should('exist')

      // Scroll to bottom to load more files
      cy.get('@scrollableFilesContainer').scrollTo('bottom')

      cy.findByRole('columnheader', { name: '40 of 200 Files displayed' }).should('exist')
      cy.get('table > tbody > tr:nth-child(2)').should('have.class', styles['selected-row'])
      cy.findByText('1 file is currently selected.').should('exist')

      // Scroll to bottom to load more files
      cy.get('@scrollableFilesContainer').scrollTo('bottom')

      cy.findByRole('columnheader', { name: '50 of 200 Files displayed' }).should('exist')
      cy.get('table > tbody > tr:nth-child(2)').should('have.class', styles['selected-row'])
      cy.findByText('1 file is currently selected.').should('exist')
    })

    it('removes the selection when the header checkbox is clicked again', () => {
      cy.customMount(
        <DatasetFilesScrollable
          filesRepository={fileRepository}
          datasetPersistentId={datasetPersistentId}
          datasetVersion={datasetVersion}
        />
      )
      cy.findByRole('columnheader', { name: '10 of 200 Files displayed' }).should('exist')
      cy.findByTestId('header-checkbox').should('be.visible').check({ force: true })
      cy.findByText(/^\d+ files are currently selected\.$/)
        .invoke('text')
        .then((text) => {
          const count = parseInt(text.split(' ')[0], 10)
          expect(count).to.be.gte(10)
        })
      cy.findByTestId('header-checkbox').should('be.visible').uncheck({ force: true })
      cy.wait(300)
      cy.findByText('10 files are currently selected.').should('not.exist')
    })

    it('selects all loaded by scroll files when clicking the header checkbox', () => {
      cy.customMount(
        <DatasetFilesScrollable
          filesRepository={fileRepository}
          datasetPersistentId={datasetPersistentId}
          datasetVersion={datasetVersion}
        />
      )

      cy.findByText('10 of 200 Files displayed').should('exist')

      cy.findByTestId('scrollable-files-container').as('scrollableFilesContainer')
      cy.get('@scrollableFilesContainer').scrollTo('bottom')

      cy.findByText('20 of 200 Files displayed').should('exist')

      cy.findByTestId('header-checkbox').should('be.visible').as('headerCheckbox')
      cy.get('@headerCheckbox').check({ force: true })

      cy.findByText(/^\d+ files are currently selected\.$/)
        .invoke('text')
        .then((text) => {
          const count = parseInt(text.split(' ')[0], 10)
          expect(count).to.be.gte(20)
        })
    })

    it('all new loaded files should be checked if selecting all files when only displayed 10 and then scrolling to bottom to load 10 more files', () => {
      cy.customMount(
        <DatasetFilesScrollable
          filesRepository={fileRepository}
          datasetPersistentId={datasetPersistentId}
          datasetVersion={datasetVersion}
        />
      )
      cy.findByRole('columnheader', { name: '10 of 200 Files displayed' }).should('exist')
      cy.findByTestId('header-checkbox').should('be.visible').check({ force: true })
      cy.findByText(/^\d+ files are currently selected\.$/)
        .invoke('text')
        .then((text) => {
          const count = parseInt(text.split(' ')[0], 10)
          expect(count).to.be.gte(10)
        })
      cy.findByRole('button', { name: 'Select all 200 files in this dataset.' }).click({
        force: true
      })
      cy.findByText('200 files are currently selected.').should('exist')

      cy.findByTestId('scrollable-files-container').as('scrollableFilesContainer')
      cy.get('@scrollableFilesContainer').scrollTo('bottom')

      cy.findByRole('columnheader', { name: '20 of 200 Files displayed' }).should('exist')

      cy.get('table > tbody > tr').each(() => {
        cy.get('table > tbody > tr > td:nth-child(1) > input[type=checkbox]').should('be.checked')
      })
    })

    it('removes the selection when the filters change', () => {
      cy.customMount(
        <DatasetFilesScrollable
          filesRepository={fileRepository}
          datasetPersistentId={datasetPersistentId}
          datasetVersion={datasetVersion}
        />
      )
      cy.findByRole('columnheader', { name: '10 of 200 Files displayed' }).should('exist')
      cy.get('table > tbody > tr:nth-child(2) > td:nth-child(1) > input[type=checkbox]').click()
      cy.findByText('1 file is currently selected.').should('exist')
      cy.findByRole('button', { name: 'File Type: All' }).click()
      cy.findByText('PNG Image (485)').should('exist').click()
      cy.findByText('1 file is currently selected.').should('not.exist')
    })

    it('removes the selection when the Sort by changes', () => {
      cy.customMount(
        <DatasetFilesScrollable
          filesRepository={fileRepository}
          datasetPersistentId={datasetPersistentId}
          datasetVersion={datasetVersion}
        />
      )
      cy.findByRole('columnheader', { name: '10 of 200 Files displayed' }).should('exist')
      cy.get('table > tbody > tr:nth-child(2) > td:nth-child(1) > input[type=checkbox]').click()
      cy.findByText('1 file is currently selected.').should('exist')
      cy.findByRole('button', { name: /Sort/ }).click()
      cy.findByText('Name (Z-A)').should('exist').click()
      cy.findByText('1 file is currently selected.').should('not.exist')
    })

    it('removes the selection when the Search bar is used', () => {
      cy.customMount(
        <DatasetFilesScrollable
          filesRepository={fileRepository}
          datasetPersistentId={datasetPersistentId}
          datasetVersion={datasetVersion}
        />
      )
      cy.findByRole('columnheader', { name: '10 of 200 Files displayed' }).should('exist')
      cy.get('table > tbody > tr:nth-child(2) > td:nth-child(1) > input[type=checkbox]').click()
      cy.findByText('1 file is currently selected.').should('exist')
      cy.findByLabelText('Search').type('test{enter}')
      cy.findByText('1 file is currently selected.').should('not.exist')
    })

    it('removes the selection when the clear all button is clicked', () => {
      cy.customMount(
        <DatasetFilesScrollable
          filesRepository={fileRepository}
          datasetPersistentId={datasetPersistentId}
          datasetVersion={datasetVersion}
        />
      )
      cy.findByRole('columnheader', { name: '10 of 200 Files displayed' }).should('exist')
      cy.get('table > tbody > tr:nth-child(2) > td:nth-child(1) > input[type=checkbox]').click()
      cy.findByText('1 file is currently selected.').should('exist')
      cy.findByRole('button', { name: 'Clear selection.' }).click()
      cy.findByText('1 file is currently selected.').should('not.exist')
    })

    it('renders the zip download limit message when selecting rows from different scroll loadings', () => {
      testFiles.files[1] = FilePreviewMother.create({
        metadata: FileMetadataMother.create({
          size: new FileSize(1, FileSizeUnit.BYTES)
        })
      })
      testFiles.files[2] = FilePreviewMother.create({
        metadata: FileMetadataMother.create({ size: new FileSize(2, FileSizeUnit.BYTES) })
      })
      cy.customMount(
        <SettingsProvider dataverseInfoRepository={dataverseInfoRepository}>
          <DatasetFilesScrollable
            filesRepository={fileRepository}
            datasetPersistentId={datasetPersistentId}
            datasetVersion={datasetVersion}
          />
        </SettingsProvider>
      )
      cy.get('table > tbody > tr:nth-child(2) > td:nth-child(1) > input[type=checkbox]').click()

      cy.findByTestId('scrollable-files-container').as('scrollableFilesContainer')
      cy.get('@scrollableFilesContainer').scrollTo('bottom')

      cy.get('table > tbody > tr:nth-child(3) > td:nth-child(1) > input[type=checkbox]').click()
      cy.findByText(
        'The overall size of the files selected (3.0 B) for download exceeds the zip limit of 1.0 B. Please unselect some files to continue.'
      ).should('exist')
      cy.get('table > tbody > tr:nth-child(3) > td:nth-child(1) > input[type=checkbox]').click()
      cy.findByText(
        /exceeds the zip limit of 1.0 B. Please unselect some files to continue./
      ).should('not.exist')
    })

    it('renders the zip download limit message when selecting all rows', () => {
      cy.customMount(
        <SettingsProvider dataverseInfoRepository={dataverseInfoRepository}>
          <DatasetFilesScrollable
            filesRepository={fileRepository}
            datasetPersistentId={datasetPersistentId}
            datasetVersion={datasetVersion}
          />
        </SettingsProvider>
      )

      cy.findByRole('columnheader', { name: '10 of 200 Files displayed' }).should('exist')
      cy.findByTestId('header-checkbox').click({ force: true })
      cy.findByRole('button', { name: 'Select all 200 files in this dataset.' }).click()
      cy.findByText(
        'The overall size of the files selected (19.4 KB) for download exceeds the zip limit of 1.0 B. Please unselect some files to continue.'
      ).should('exist')
    })

    it('renders the zip download limit message when selecting all rows and then scrolling to bottom to load more files', () => {
      cy.customMount(
        <SettingsProvider dataverseInfoRepository={dataverseInfoRepository}>
          <DatasetFilesScrollable
            filesRepository={fileRepository}
            datasetPersistentId={datasetPersistentId}
            datasetVersion={datasetVersion}
          />
        </SettingsProvider>
      )

      cy.findByRole('columnheader', { name: '10 of 200 Files displayed' }).should('exist')
      cy.findByTestId('header-checkbox').should('be.visible').check({ force: true })
      cy.findByRole('button', { name: 'Select all 200 files in this dataset.' }).click({
        force: true
      })

      cy.findByTestId('scrollable-files-container').as('scrollableFilesContainer')
      cy.get('@scrollableFilesContainer').scrollTo('bottom')

      cy.findByText(
        'The overall size of the files selected (19.4 KB) for download exceeds the zip limit of 1.0 B. Please unselect some files to continue.'
      ).should('exist')
    })
  })

  describe('Calling use cases', () => {
    it('calls the useGetAccumulatedFiles hook with the correct parameters', () => {
      cy.customMount(
        <DatasetFilesScrollable
          filesRepository={fileRepository}
          datasetPersistentId={datasetPersistentId}
          datasetVersion={datasetVersion}
        />
      )
      cy.wrap(fileRepository.getAllByDatasetPersistentIdWithCount).should(
        'be.calledWith',
        datasetPersistentId,
        datasetVersion
      )
      cy.wrap(fileRepository.getFilesCountInfoByDatasetPersistentId).should(
        'be.calledWith',
        datasetPersistentId,
        datasetVersion.number
      )
    })
    it('calls the useGetAccumulatedFiles hook with the correct parameters when sortBy criteria changes', () => {
      cy.customMount(
        <DatasetFilesScrollable
          filesRepository={fileRepository}
          datasetPersistentId={datasetPersistentId}
          datasetVersion={datasetVersion}
        />
      )
      cy.findByRole('button', { name: /Sort/ }).click()
      cy.findByText('Name (Z-A)').should('exist').click()
      cy.wrap(fileRepository.getAllByDatasetPersistentIdWithCount).should(
        'be.calledWith',
        datasetPersistentId,
        datasetVersion,
        new FilePaginationInfo(1, 10, 0),
        new FileCriteria().withSortBy(FileSortByOption.NAME_ZA)
      )
    })
    it('calls the useGetAccumulatedFiles hook with the correct parameters when filterByType criteria changes', () => {
      cy.customMount(
        <DatasetFilesScrollable
          filesRepository={fileRepository}
          datasetPersistentId={datasetPersistentId}
          datasetVersion={datasetVersion}
        />
      )
      cy.findByRole('button', { name: 'File Type: All' }).click()
      cy.findByText('PNG Image (485)').should('exist').click()
      cy.wrap(fileRepository.getAllByDatasetPersistentIdWithCount).should(
        'be.calledWith',
        datasetPersistentId,
        datasetVersion,
        new FilePaginationInfo(1, 10, 0),
        new FileCriteria().withFilterByType('image/png')
      )
    })
    it('calls the useGetAccumulatedFiles hook with the correct parameters when filterByAccess criteria changes', () => {
      cy.customMount(
        <DatasetFilesScrollable
          filesRepository={fileRepository}
          datasetPersistentId={datasetPersistentId}
          datasetVersion={datasetVersion}
        />
      )
      cy.findByRole('button', { name: 'Access: All' }).click()
      cy.findByText('Public (222)').should('exist').click()
      cy.wrap(fileRepository.getAllByDatasetPersistentIdWithCount).should(
        'be.calledWith',
        datasetPersistentId,
        datasetVersion,
        new FilePaginationInfo(1, 10, 0),
        new FileCriteria().withFilterByAccess(FileAccessOption.PUBLIC)
      )
    })
    it('calls the useGetAccumulatedFiles hook with the correct parameters when filterByTag criteria changes', () => {
      cy.customMount(
        <DatasetFilesScrollable
          filesRepository={fileRepository}
          datasetPersistentId={datasetPersistentId}
          datasetVersion={datasetVersion}
        />
      )
      cy.findByRole('button', { name: 'File Tags: All' }).click()
      cy.findByText('Document (5)').should('exist').click()
      cy.wrap(fileRepository.getAllByDatasetPersistentIdWithCount).should(
        'be.calledWith',
        datasetPersistentId,
        datasetVersion,
        new FilePaginationInfo(1, 10, 0),
        new FileCriteria().withFilterByTag('document')
      )
    })
    it('calls the useGetAccumulatedFiles hook with the correct parameters when searchText criteria changes', () => {
      cy.customMount(
        <DatasetFilesScrollable
          filesRepository={fileRepository}
          datasetPersistentId={datasetPersistentId}
          datasetVersion={datasetVersion}
        />
      )
      cy.findByLabelText('Search').type('test{enter}')
      cy.wrap(fileRepository.getAllByDatasetPersistentIdWithCount).should(
        'be.calledWith',
        datasetPersistentId,
        datasetVersion,
        new FilePaginationInfo(1, 10, 0),
        new FileCriteria().withSearchText('test')
      )
    })
    it('calls the useGetAccumulatedFiles hook with the correct parameters when scrolling to bottom', () => {
      cy.customMount(
        <DatasetFilesScrollable
          filesRepository={fileRepository}
          datasetPersistentId={datasetPersistentId}
          datasetVersion={datasetVersion}
        />
      )

      cy.wrap(fileRepository.getAllByDatasetPersistentIdWithCount).should(
        'be.calledWith',
        datasetPersistentId,
        datasetVersion,
        new FilePaginationInfo(1, 10, 0),
        new FileCriteria()
      )

      cy.wait(1_000)

      cy.findByTestId('scrollable-files-container').as('scrollableFilesContainer')
      cy.get('@scrollableFilesContainer').scrollTo('bottom')

      cy.wrap(fileRepository.getAllByDatasetPersistentIdWithCount).should(
        'be.calledWith',
        datasetPersistentId,
        datasetVersion,
        new FilePaginationInfo(2, 10, 200),
        new FileCriteria().withSortBy(FileSortByOption.NAME_AZ)
      )
    })
    it('calls getFilesTotalDownloadSizeByDatasetPersistentId with the correct parameters when applying search file criteria', () => {
      cy.customMount(
        <SettingsProvider dataverseInfoRepository={dataverseInfoRepository}>
          <DatasetFilesScrollable
            filesRepository={fileRepository}
            datasetPersistentId={datasetPersistentId}
            datasetVersion={datasetVersion}
          />
        </SettingsProvider>
      )

      cy.findByRole('button', { name: 'File Type: All' }).click()
      cy.findByText('PNG Image (485)').should('exist').click()
      cy.findByTestId('header-checkbox').should('be.visible').check({ force: true })
      cy.findByRole('button', { name: 'Select all 200 files in this dataset.' }).click()

      cy.findByText(
        'The overall size of the files selected (19.4 KB) for download exceeds the zip limit of 1.0 B. Please unselect some files to continue.'
      ).should('exist')

      cy.wrap(fileRepository.getFilesTotalDownloadSizeByDatasetPersistentId).should(
        'be.calledWith',
        datasetPersistentId,
        datasetVersion.number,
        new FileCriteria().withFilterByType('image/png')
      )
    })
  })

  describe('Error handling', () => {
    it('shows error banner if there is an error getting files', () => {
      fileRepository.getAllByDatasetPersistentIdWithCount = cy
        .stub()
        .rejects(new Error('Some error on getAllByDatasetPersistentIdWithCount'))

      cy.customMount(
        <DatasetFilesScrollable
          filesRepository={fileRepository}
          datasetPersistentId={datasetPersistentId}
          datasetVersion={datasetVersion}
        />
      )
      cy.findByText('Error').should('exist')
    })

    it('shows fallback error message if there is an unknown error getting files', () => {
      fileRepository.getAllByDatasetPersistentIdWithCount = cy.stub().rejects(new Error())

      cy.customMount(
        <DatasetFilesScrollable
          filesRepository={fileRepository}
          datasetPersistentId={datasetPersistentId}
          datasetVersion={datasetVersion}
        />
      )
      cy.findByText(/There was an error getting the files total download size/).should('exist')
    })

    it('shows error banner if there is an error getting total download size', () => {
      fileRepository.getFilesTotalDownloadSizeByDatasetPersistentId = cy
        .stub()
        .rejects(new Error('Some error on getFilesTotalDownloadSizeByDatasetPersistentId'))

      cy.customMount(
        <DatasetFilesScrollable
          filesRepository={fileRepository}
          datasetPersistentId={datasetPersistentId}
          datasetVersion={datasetVersion}
        />
      )
      cy.findByText('Error').should('exist')
    })

    it('shows fallback error message if there is an unknown error getting total download size', () => {
      fileRepository.getFilesTotalDownloadSizeByDatasetPersistentId = cy.stub().rejects(new Error())

      cy.customMount(
        <DatasetFilesScrollable
          filesRepository={fileRepository}
          datasetPersistentId={datasetPersistentId}
          datasetVersion={datasetVersion}
        />
      )
      cy.findByText(/There was an error getting the files total download size/).should('exist')
    })

    it('shows error banner if there is an error getting files info count', () => {
      fileRepository.getFilesCountInfoByDatasetPersistentId = cy
        .stub()
        .rejects(new Error('Some error on getFilesCountInfoByDatasetPersistentId'))

      cy.customMount(
        <DatasetFilesScrollable
          filesRepository={fileRepository}
          datasetPersistentId={datasetPersistentId}
          datasetVersion={datasetVersion}
        />
      )
      cy.findByText('Error').should('exist')
    })

    it('shows fallback error message if there is an unknown error getting files info count', () => {
      fileRepository.getFilesCountInfoByDatasetPersistentId = cy.stub().rejects(new Error())

      cy.customMount(
        <DatasetFilesScrollable
          filesRepository={fileRepository}
          datasetPersistentId={datasetPersistentId}
          datasetVersion={datasetVersion}
        />
      )
      cy.findByText(/There was an error getting the files count info/).should('exist')
    })
  })

  describe('getCellStyle function', () => {
    it('should return the correct style for status cell', () => {
      const cellId = 'status'
      cy.wrap(getCellStyle(cellId)).should('deep.equal', { borderWidth: '0 1px 0 0' })
    })

    it('should return the correct style for info cell', () => {
      const cellId = 'info'
      cy.wrap(getCellStyle(cellId)).should('deep.equal', { borderWidth: '0 0 0 1px' })
    })

    it('should return undefined for unknown cell', () => {
      const cellId = 'unknown'
      cy.wrap(getCellStyle(cellId)).should('be.undefined')
    })

    it('should return the correct style for the select cell', () => {
      const cellId = 'select'
      cy.wrap(getCellStyle(cellId)).should('deep.equal', { verticalAlign: 'middle' })
    })
  })
})
