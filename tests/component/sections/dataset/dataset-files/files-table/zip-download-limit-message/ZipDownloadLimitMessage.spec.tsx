import { FileMother } from '../../../../../files/domain/models/FileMother'
import { ZipDownloadLimitMessage } from '../../../../../../../src/sections/dataset/dataset-files/files-table/zip-download-limit-message/ZipDownloadLimitMessage'
import { FileSize, FileSizeUnit } from '../../../../../../../src/files/domain/models/File'
import { SettingMother } from '../../../../../settings/domain/models/SettingMother'
import { ZipDownloadLimit } from '../../../../../../../src/settings/domain/models/ZipDownloadLimit'
import { SettingsContext } from '../../../../../../../src/sections/settings/SettingsContext'

const fileSelection = {
  '1': FileMother.create({ size: new FileSize(1024, FileSizeUnit.BYTES) }),
  '2': FileMother.create({ size: new FileSize(2048, FileSizeUnit.BYTES) })
}
const zipDownloadLimit = new ZipDownloadLimit(500, FileSizeUnit.BYTES)
describe('ZipDownloadLimitMessage', () => {
  it('should not render if there is less than 1 file selected', () => {
    const getSettingByName = cy
      .stub()
      .resolves(SettingMother.createZipDownloadLimit(zipDownloadLimit))

    cy.customMount(
      <SettingsContext.Provider value={{ getSettingByName }}>
        <ZipDownloadLimitMessage
          fileSelection={{
            '1': FileMother.create({ size: new FileSize(1024, FileSizeUnit.BYTES) })
          }}
        />
      </SettingsContext.Provider>
    )

    cy.findByText(/The overall size of the files selected/).should('not.exist')
  })

  it('should not render if the zipDownloadLimit is not exceeded', () => {
    const getSettingByName = cy
      .stub()
      .resolves(SettingMother.createZipDownloadLimit(zipDownloadLimit))

    cy.customMount(
      <SettingsContext.Provider value={{ getSettingByName }}>
        <ZipDownloadLimitMessage
          fileSelection={{
            '1': FileMother.create({ size: new FileSize(1, FileSizeUnit.BYTES) }),
            '2': FileMother.create({ size: new FileSize(1, FileSizeUnit.BYTES) })
          }}
        />
      </SettingsContext.Provider>
    )

    cy.findByText(/The overall size of the files selected/).should('not.exist')
  })

  it('should render if there is more than 1 file and they exceed the zipDownloadLimit', () => {
    const getSettingByName = cy
      .stub()
      .resolves(SettingMother.createZipDownloadLimit(zipDownloadLimit))
    cy.customMount(
      <SettingsContext.Provider value={{ getSettingByName }}>
        <ZipDownloadLimitMessage fileSelection={fileSelection} />
      </SettingsContext.Provider>
    )

    cy.findByText(
      'The overall size of the files selected (3.0 KB) for download exceeds the zip limit of 500.0 B. Please unselect some files to continue.'
    ).should('exist')
  })

  it('should show the more than 1024 PB message if the total size is too big', () => {
    const getSettingByName = cy
      .stub()
      .resolves(SettingMother.createZipDownloadLimit(zipDownloadLimit))
    const fileSelection = {
      '1': FileMother.create({ size: new FileSize(1000000, FileSizeUnit.PETABYTES) }),
      '2': FileMother.create({ size: new FileSize(1000000, FileSizeUnit.PETABYTES) })
    }
    cy.customMount(
      <SettingsContext.Provider value={{ getSettingByName }}>
        <ZipDownloadLimitMessage fileSelection={fileSelection} />
      </SettingsContext.Provider>
    )

    cy.findByText(
      'The overall size of the files selected (more than 1024.0 PB) for download exceeds the zip limit of 500.0 B. Please unselect some files to continue.'
    ).should('exist')
  })
})
