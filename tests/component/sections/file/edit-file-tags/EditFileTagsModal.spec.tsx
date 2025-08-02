import { EditFileTagsModal } from '@/sections/file/file-action-buttons/edit-file-menu/edit-file-tags/edit-file-tags-modal/EditFileTagsModal'
import { FileLabelType } from '@/files/domain/models/FileMetadata'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'

describe('EditFileTagsModal', () => {
  let datasetRepository: DatasetRepository
  beforeEach(() => {
    datasetRepository = {} as DatasetRepository

    const categoriesMock = ['Documentation', 'Code', 'Data', 'Category4']
    datasetRepository.getDatasetAvailableCategories = cy.stub().resolves(categoriesMock)
    cy.customMount(
      <EditFileTagsModal
        show={true}
        handleClose={() => {}}
        fileId={1}
        handleUpdateCategories={cy.stub().as('handleUpdateCategories')}
        isUpdatingFileCategories={false}
        errorUpdatingFileCategories={null}
        handleUpdateTabularTags={cy.stub().as('handleUpdateTabularTags')}
        isUpdatingTabularTags={false}
        errorUpdatingTabularTags={null}
        isTabularFile={true}
        datasetRepository={datasetRepository}
        datasetPersistentId={'1'}
      />
    )
  })

  it('should render the available categories as File Tags', () => {
    cy.get('#file-tags-select').should('exist')
    cy.get('#file-tags-select').click()
    cy.findByText('Data').should('exist')
    cy.findByText('Code').should('exist')
    cy.findByText('Documentation').should('exist')
    cy.findByText('Category4').should('exist')
  })

  it('renders the modal with correct title and content', () => {
    cy.findByText('Edit Tags').should('exist')
    cy.findByText(
      'Select existing file tags or create new tags to describe your files. Each file can have more than one tag.'
    ).should('exist')
    cy.findByText('File Tags').should('exist')
    cy.findByText('Custom File Tag').should('exist')
    cy.findByText('Tabular Data Tags').should('exist')
  })

  it('should update file categories successfully', () => {
    cy.get('#file-tags-select').click()
    cy.findByText('Data').click()
    cy.findByText('Code').click()
    cy.findByRole('button', { name: 'Save Changes' }).click()
  })

  it('should update file tabular tags successfully', () => {
    cy.get('#tabular-tags-select').click()
    cy.findByText('Survey').click()
    cy.findByText('Panel').click()
    cy.findByRole('button', { name: 'Save Changes' }).click()
  })

  it('should add a custom file tag successfully', () => {
    cy.findByTestId('custom-file-tag-input').should('exist')
    cy.findByTestId('custom-file-tag-input').type('Custom Tag')
    cy.findByRole('button', { name: 'Apply' }).click()
    cy.findByTestId('custom-file-tag-input').should('have.value', '')
    cy.findByRole('button', { name: 'Save Changes' }).click()
  })

  it('should not called handleUpdateCategories if the input is empty', () => {
    cy.findByTestId('custom-file-tag-input').should('exist')
    cy.findByRole('button', { name: 'Apply' }).click()
    cy.findByTestId('custom-file-tag-input').should('have.value', '')
    cy.findByRole('button', { name: 'Save Changes' }).click()
  })

  it('should not called handleUpdateTabularTags if the input is empty', () => {
    cy.findByTestId('custom-file-tag-input').should('exist')
    cy.findByRole('button', { name: 'Apply' }).click()
    cy.findByTestId('custom-file-tag-input').should('have.value', '')
    cy.findByRole('button', { name: 'Save Changes' }).click()
  })

  it('should not add a custom file tag if the input is empty', () => {
    cy.findByTestId('custom-file-tag-input').should('exist')
    cy.findByRole('button', { name: 'Apply' }).click()
    cy.findByTestId('custom-file-tag-input').should('have.value', '')
    cy.findByRole('button', { name: 'Save Changes' }).click()
  })

  it('should handle Enter key press in custom file tag input', () => {
    cy.findByTestId('custom-file-tag-input').should('exist')
    cy.findByTestId('custom-file-tag-input').type('Custom Tag{enter}')
    cy.findByTestId('custom-file-tag-input').should('have.value', '')
    cy.findByRole('button', { name: 'Save Changes' }).click()
  })

  it('should make the file tags checked', () => {
    cy.get('#file-tags-select').click()
    cy.findByText('Data').click()
    cy.findByText('Code').click()
    cy.findByText('Documentation').click()
    cy.findByRole('button', { name: 'Save Changes' }).click()

    cy.get('[data-testid="file-labels"]').within(() => {
      cy.findByText('Data').should('exist')
      cy.findByText('Code').should('exist')
      cy.findByText('Documentation').should('exist')
    })
  })

  it('should make the file tabular tags checked', () => {
    cy.get('#tabular-tags-select').click()
    cy.findByText('Survey').click()
    cy.findByText('Panel').click()
    cy.findByRole('button', { name: 'Save Changes' }).click()

    cy.get('[data-testid="file-labels"]').within(() => {
      cy.findByText('Survey').should('exist')
      cy.findByText('Panel').should('exist')
    })
  })

  it('should hide tabular tags section when file is not tabular', () => {
    cy.customMount(
      <EditFileTagsModal
        show={true}
        handleClose={() => {}}
        fileId={1}
        handleUpdateCategories={cy.stub().as('handleUpdateCategories')}
        isUpdatingFileCategories={false}
        errorUpdatingFileCategories={null}
        handleUpdateTabularTags={cy.stub().as('handleUpdateTabularTags')}
        isUpdatingTabularTags={false}
        errorUpdatingTabularTags={null}
        isTabularFile={false}
        datasetRepository={datasetRepository}
        datasetPersistentId={'1'}
      />
    )

    cy.get('#file-tags-select').should('exist')
    cy.get('#tabular-tags-select').should('not.exist')
    cy.findByText('Tabular Data Tags').should('not.exist')
    cy.findByText('Select one or more tabular data tags to describe the file.').should('not.exist')
  })

  it('should only update file categories and not tabular tags when file is not tabular', () => {
    cy.customMount(
      <EditFileTagsModal
        show={true}
        handleClose={() => {}}
        fileId={1}
        handleUpdateCategories={cy.stub().as('handleUpdateCategories')}
        isUpdatingFileCategories={false}
        errorUpdatingFileCategories={null}
        handleUpdateTabularTags={cy.stub().as('handleUpdateTabularTags')}
        isUpdatingTabularTags={false}
        errorUpdatingTabularTags={null}
        isTabularFile={false}
        datasetRepository={datasetRepository}
        datasetPersistentId={'1'}
      />
    )

    cy.get('#file-tags-select').click()
    cy.findByText('Data').click()
    cy.findByRole('button', { name: 'Save Changes' }).click()
  })

  it('should call both update handlers if both file tags and tabular tags change', () => {
    cy.get('#file-tags-select').click()
    cy.findByText('Data').click()
    cy.get('#tabular-tags-select').click()
    cy.findByText('Survey').click()
    cy.findByRole('button', { name: 'Save Changes' }).click()
  })

  const existingLabels = [
    { value: 'Data', type: FileLabelType.CATEGORY },
    { value: 'Code', type: FileLabelType.CATEGORY },
    { value: 'Survey', type: FileLabelType.TAG },
    { value: 'Panel', type: FileLabelType.TAG }
  ]

  it('should not call update handlers if no changes are made', () => {
    cy.customMount(
      <EditFileTagsModal
        show={true}
        handleClose={() => {}}
        fileId={1}
        handleUpdateCategories={cy.stub().as('handleUpdateCategories')}
        isUpdatingFileCategories={false}
        errorUpdatingFileCategories={null}
        handleUpdateTabularTags={cy.stub().as('handleUpdateTabularTags')}
        isUpdatingTabularTags={false}
        errorUpdatingTabularTags={null}
        isTabularFile={true}
        existingLabels={existingLabels}
        datasetRepository={datasetRepository}
        datasetPersistentId={'1'}
      />
    )

    cy.findByRole('button', { name: 'Save Changes' }).click()
  })

  it('should show error message if duplicated customized tag exists', () => {
    cy.customMount(
      <EditFileTagsModal
        show={true}
        handleClose={() => {}}
        fileId={1}
        handleUpdateCategories={cy.stub().as('handleUpdateCategories')}
        isUpdatingFileCategories={false}
        errorUpdatingFileCategories={null}
        handleUpdateTabularTags={cy.stub().as('handleUpdateTabularTags')}
        isUpdatingTabularTags={false}
        errorUpdatingTabularTags={null}
        isTabularFile={true}
        existingLabels={existingLabels}
        datasetRepository={datasetRepository}
        datasetPersistentId={'1'}
      />
    )
    cy.findByTestId('custom-file-tag-input').type('duplicated tag')
    cy.findByRole('button', { name: 'Apply' }).click()
    cy.findByTestId('custom-file-tag-input').type('duplicated tag')
    cy.findByRole('button', { name: 'Apply' }).click()
    cy.findByText('This tag already exists.').should('exist')
  })

  it('should call handleModalClose when clicking cancel button', () => {
    const existingLabels = [
      { value: 'Data', type: FileLabelType.CATEGORY },
      { value: 'Survey', type: FileLabelType.TAG }
    ]

    const handleCloseSpy = cy.stub().as('handleClose')

    cy.customMount(
      <EditFileTagsModal
        show={true}
        handleClose={handleCloseSpy}
        fileId={1}
        handleUpdateCategories={cy.stub().as('handleUpdateCategories')}
        isUpdatingFileCategories={false}
        errorUpdatingFileCategories={null}
        handleUpdateTabularTags={cy.stub().as('handleUpdateTabularTags')}
        isUpdatingTabularTags={false}
        errorUpdatingTabularTags={null}
        isTabularFile={true}
        existingLabels={existingLabels}
        datasetRepository={datasetRepository}
        datasetPersistentId={'1'}
      />
    )

    cy.findByRole('button', { name: 'Cancel' }).click()
    cy.get('@handleClose').should('have.been.called')
  })

  it('should call handleModalClose when clicking the X button', () => {
    const existingLabels = [{ value: 'Documentation', type: FileLabelType.CATEGORY }]

    const handleCloseSpy = cy.stub().as('handleClose')

    cy.customMount(
      <EditFileTagsModal
        show={true}
        handleClose={handleCloseSpy}
        fileId={1}
        handleUpdateCategories={cy.stub().as('handleUpdateCategories')}
        isUpdatingFileCategories={false}
        errorUpdatingFileCategories={null}
        handleUpdateTabularTags={cy.stub().as('handleUpdateTabularTags')}
        isUpdatingTabularTags={false}
        errorUpdatingTabularTags={null}
        isTabularFile={true}
        existingLabels={existingLabels}
        datasetRepository={datasetRepository}
        datasetPersistentId={'1'}
      />
    )

    cy.get('.modal-header .btn-close').click()
    cy.get('@handleClose').should('have.been.called')
  })

  describe('Error or Loading States', () => {
    it('should display file categories error message', () => {
      const errorMessage = 'Failed to update file categories'
      cy.customMount(
        <EditFileTagsModal
          show={true}
          handleClose={() => {}}
          fileId={1}
          handleUpdateCategories={cy.stub().as('handleUpdateCategories')}
          isUpdatingFileCategories={false}
          errorUpdatingFileCategories={errorMessage}
          handleUpdateTabularTags={cy.stub().as('handleUpdateTabularTags')}
          isUpdatingTabularTags={false}
          errorUpdatingTabularTags={null}
          isTabularFile={true}
          datasetRepository={datasetRepository}
          datasetPersistentId={'1'}
        />
      )

      cy.findByRole('alert').should('have.class', 'alert-danger')
    })

    it('should display tabular tags error message', () => {
      const errorMessage = 'Failed to update tabular tags'
      cy.customMount(
        <EditFileTagsModal
          show={true}
          handleClose={() => {}}
          fileId={1}
          handleUpdateCategories={cy.stub().as('handleUpdateCategories')}
          isUpdatingFileCategories={false}
          errorUpdatingFileCategories={null}
          handleUpdateTabularTags={cy.stub().as('handleUpdateTabularTags')}
          isUpdatingTabularTags={false}
          errorUpdatingTabularTags={errorMessage}
          isTabularFile={true}
          datasetRepository={datasetRepository}
          datasetPersistentId={'1'}
        />
      )

      cy.findByRole('alert').should('have.class', 'alert-danger')
    })

    it('should display error if getCategoriesError is error', () => {
      const errorMessage = 'Failed to load categories'
      datasetRepository.getDatasetAvailableCategories = cy.stub().rejects(new Error(errorMessage))

      cy.customMount(
        <EditFileTagsModal
          show={true}
          handleClose={() => {}}
          fileId={1}
          handleUpdateCategories={cy.stub().as('handleUpdateCategories')}
          isUpdatingFileCategories={false}
          errorUpdatingFileCategories={null}
          handleUpdateTabularTags={cy.stub().as('handleUpdateTabularTags')}
          isUpdatingTabularTags={false}
          errorUpdatingTabularTags={null}
          isTabularFile={true}
          datasetRepository={datasetRepository}
          datasetPersistentId={'1'}
        />
      )

      cy.findByRole('alert').should('have.class', 'alert-danger')
    })

    it('should not display error messages when errors are null', () => {
      cy.customMount(
        <EditFileTagsModal
          show={true}
          handleClose={() => {}}
          fileId={1}
          handleUpdateCategories={cy.stub().as('handleUpdateCategories')}
          isUpdatingFileCategories={false}
          errorUpdatingFileCategories={null}
          handleUpdateTabularTags={cy.stub().as('handleUpdateTabularTags')}
          isUpdatingTabularTags={false}
          errorUpdatingTabularTags={null}
          isTabularFile={true}
          datasetRepository={datasetRepository}
          datasetPersistentId={'1'}
        />
      )

      cy.get('.text-danger').should('not.exist')
    })

    it('should disable save button when updating file categories', () => {
      cy.customMount(
        <EditFileTagsModal
          show={true}
          handleClose={() => {}}
          fileId={1}
          handleUpdateCategories={cy.stub().as('handleUpdateCategories')}
          isUpdatingFileCategories={true}
          errorUpdatingFileCategories={null}
          handleUpdateTabularTags={cy.stub().as('handleUpdateTabularTags')}
          isUpdatingTabularTags={false}
          errorUpdatingTabularTags={null}
          isTabularFile={true}
          datasetRepository={datasetRepository}
          datasetPersistentId={'1'}
        />
      )

      cy.findByRole('button', { name: 'Saving' }).should('be.disabled')
      cy.findByRole('button', { name: 'Cancel' }).should('be.disabled')
    })
  })
})
