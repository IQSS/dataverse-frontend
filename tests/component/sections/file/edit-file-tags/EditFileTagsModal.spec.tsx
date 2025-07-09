import { EditFileTagsModal } from '@/sections/file/file-action-buttons/edit-file-menu/edit-file-tags/edit-file-tags-modal/EditFileTagsModal'

describe('EditFileTagsModal', () => {
  beforeEach(() => {
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
      />
    )
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

    cy.get('@handleUpdateCategories').should('have.been.calledWith', 1, ['Data', 'Code'], true)
  })

  it('should update file tabular tags successfully', () => {
    cy.get('#tabular-tags-select').click()
    cy.findByText('Survey').click()
    cy.findByText('Panel').click()

    cy.findByRole('button', { name: 'Save Changes' }).click()

    cy.get('@handleUpdateTabularTags').should('have.been.calledWith', 1, ['Survey', 'Panel'], true)
  })

  it('should add a custom file tag successfully', () => {
    cy.findByTestId('custom-file-tag-input').should('exist')
    cy.findByTestId('custom-file-tag-input').type('Custom Tag')
    cy.findByRole('button', { name: 'Apply' }).click()
    cy.findByTestId('custom-file-tag-input').should('have.value', '')
    cy.findByRole('button', { name: 'Save Changes' }).click()

    cy.get('@handleUpdateCategories').should('have.been.calledWith', 1, ['Custom Tag'], true)
  })

  it('should not called handleUpdateCategories if the input is empty', () => {
    cy.findByTestId('custom-file-tag-input').should('exist')
    cy.findByRole('button', { name: 'Apply' }).click()
    cy.findByTestId('custom-file-tag-input').should('have.value', '')
    cy.findByRole('button', { name: 'Save Changes' }).click()
    cy.get('@handleUpdateCategories').should('not.have.been.called')
  })

  it('should not called handleUpdateTabularTags if the input is empty', () => {
    cy.findByTestId('custom-file-tag-input').should('exist')
    cy.findByRole('button', { name: 'Apply' }).click()
    cy.findByTestId('custom-file-tag-input').should('have.value', '')
    cy.findByRole('button', { name: 'Save Changes' }).click()
    cy.get('@handleUpdateTabularTags').should('not.have.been.called')
  })

  it('should not add a custom file tag if the input is already in the list', () => {
    cy.findByTestId('custom-file-tag-input').should('exist')
    cy.findByTestId('custom-file-tag-input').type('Custom Tag')
    cy.findByRole('button', { name: 'Apply' }).click()
    cy.findByTestId('custom-file-tag-input').should('have.value', '')
    cy.findByRole('button', { name: 'Save Changes' }).click()
  })

  it('should not add a custom file tag if the input is empty', () => {
    cy.findByTestId('custom-file-tag-input').should('exist')
    cy.findByRole('button', { name: 'Apply' }).click()
    cy.findByTestId('custom-file-tag-input').should('have.value', '')
    cy.findByRole('button', { name: 'Save Changes' }).click()

    cy.get('@handleUpdateCategories').should('not.have.been.called')
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
      />
    )

    // File tags section should still exist
    cy.get('#file-tags-select').should('exist')

    // Tabular tags section should not exist
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
      />
    )

    cy.get('#file-tags-select').click()
    cy.findByText('Data').click()
    cy.findByRole('button', { name: 'Save Changes' }).click()
    cy.get('@handleUpdateCategories').should('have.been.calledWith', 1, ['Data'], true)
    cy.get('@handleUpdateTabularTags').should('not.have.been.called')
  })

  describe('Error States', () => {
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
        />
      )

      // Should not find any error messages
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
        />
      )

      cy.findByRole('button', { name: 'Saving' }).should('be.disabled')
      cy.findByRole('button', { name: 'Cancel' }).should('be.disabled')
    })
  })
})
