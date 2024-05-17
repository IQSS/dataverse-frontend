import {
  SELECT_MENU_SEARCH_DEBOUNCE_TIME,
  SelectMultiple
} from '../../../src/lib/components/select-multiple/SelectMultiple'

describe('SelectMultiple', () => {
  it('should render correctly', () => {
    cy.mount(
      <SelectMultiple
        options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
      />
    )

    cy.findByText('Select...').should('exist')
  })

  it('should render correct options', () => {
    cy.mount(
      <SelectMultiple
        options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
      />
    )

    cy.findByLabelText('Toggle options menu').click()

    cy.findByText('Reading').should('exist')
    cy.findByText('Swimming').should('exist')
    cy.findByText('Running').should('exist')
    cy.findByText('Cycling').should('exist')
    cy.findByText('Cooking').should('exist')
    cy.findByText('Gardening').should('exist')
  })

  it('should render with default values', () => {
    cy.mount(
      <SelectMultiple
        options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
        defaultValue={['Reading', 'Running']}
      />
    )

    cy.findByText('Reading').should('exist')
    cy.findByText('Running').should('exist')
  })

  it('should call onChange when an option is selected', () => {
    const onChange = cy.stub().as('onChange')

    cy.mount(
      <SelectMultiple
        options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
        onChange={onChange}
      />
    )

    cy.findByLabelText('Toggle options menu').click()
    cy.findByLabelText('Reading').click()

    cy.get('@onChange').should('have.been.calledOnce')
  })

  it('should call onChange when an option is deselected', () => {
    const onChange = cy.stub().as('onChange')

    cy.mount(
      <SelectMultiple
        options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
        defaultValue={['Reading', 'Running']}
        onChange={onChange}
      />
    )

    cy.findByLabelText('Toggle options menu').click()
    cy.findByLabelText('Reading').click()

    cy.get('@onChange').should('have.been.calledOnce')
  })

  it('should not call onChange when passing defaultValues and rendering for first time', () => {
    const onChange = cy.stub().as('onChange')

    cy.mount(
      <SelectMultiple
        options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
        defaultValue={['Reading', 'Running']}
        onChange={onChange}
      />
    )

    cy.get('@onChange').should('not.have.been.called')
  })

  it('should select an option and be shown as selected both in the menu as well as in the selected options', () => {
    cy.mount(
      <SelectMultiple
        options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
      />
    )

    cy.findByLabelText('Toggle options menu').click()
    cy.findByLabelText('Reading').click()
    cy.findByLabelText('Reading').should('be.checked')

    cy.findByLabelText('List of selected options')
      .should('exist')
      .within(() => {
        cy.findByText('Reading').should('exist')
      })
  })

  it('should remove a selected option by clicking on an item in the selected options', () => {
    cy.mount(
      <SelectMultiple
        options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
      />
    )

    cy.findByLabelText('Toggle options menu').click()
    cy.findByLabelText('Reading').click()

    cy.findByLabelText('List of selected options').within(() => {
      cy.findByLabelText('Remove Reading option').click()
      cy.findByText('Reading').should('not.exist')
    })
  })

  it('selects all options', () => {
    cy.mount(
      <SelectMultiple
        options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
      />
    )

    cy.findByLabelText('Toggle options menu').click()
    cy.findByLabelText('Toggle all options').click()

    cy.findByLabelText('Reading').should('be.checked')
    cy.findByLabelText('Swimming').should('be.checked')
    cy.findByLabelText('Running').should('be.checked')
    cy.findByLabelText('Cycling').should('be.checked')
    cy.findByLabelText('Cooking').should('be.checked')
    cy.findByLabelText('Gardening').should('be.checked')

    cy.findByLabelText('List of selected options')
      .should('exist')
      .within(() => {
        cy.findByText('Reading').should('exist')
        cy.findByText('Swimming').should('exist')
        cy.findByText('Running').should('exist')
        cy.findByText('Cycling').should('exist')
        cy.findByText('Cooking').should('exist')
        cy.findByText('Gardening').should('exist')
      })
    cy.findByText('Select...').should('not.exist')
  })

  it('deselects all options', () => {
    cy.mount(
      <SelectMultiple
        options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
      />
    )

    cy.findByLabelText('Toggle options menu').click()
    cy.findByLabelText('Toggle all options').click()
    cy.findByLabelText('Toggle all options').click()

    cy.findByLabelText('Reading').should('not.be.checked')
    cy.findByLabelText('Swimming').should('not.be.checked')
    cy.findByLabelText('Running').should('not.be.checked')
    cy.findByLabelText('Cycling').should('not.be.checked')
    cy.findByLabelText('Cooking').should('not.be.checked')
    cy.findByLabelText('Gardening').should('not.be.checked')

    cy.findByLabelText('List of selected options').should('not.exist')
    cy.findByText('Select...').should('exist')
  })

  it('should select all filtered options', () => {
    cy.mount(
      <SelectMultiple
        options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
      />
    )
    cy.clock()

    cy.findByLabelText('Toggle options menu').click()
    cy.findByPlaceholderText('Search...').type('Read')

    cy.tick(SELECT_MENU_SEARCH_DEBOUNCE_TIME)

    cy.findByLabelText('Reading').should('exist')
    cy.findByLabelText('Swimming').should('not.exist')
    cy.findByLabelText('Running').should('not.exist')
    cy.findByLabelText('Cycling').should('not.exist')
    cy.findByLabelText('Cooking').should('not.exist')
    cy.findByLabelText('Gardening').should('not.exist')

    cy.findByLabelText('Toggle all options').click()

    cy.findByLabelText('List of selected options')
      .should('exist')
      .within(() => {
        cy.findByText('Reading').should('exist')
        cy.findByText('Swimming').should('not.exist')
        cy.findByText('Running').should('not.exist')
        cy.findByText('Cycling').should('not.exist')
        cy.findByText('Cooking').should('not.exist')
        cy.findByText('Gardening').should('not.exist')
      })
    cy.findByText('Select...').should('not.exist')
  })

  it('should unselect only filtered options', () => {
    cy.mount(
      <SelectMultiple
        options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
      />
    )
    cy.clock()

    cy.findByLabelText('Toggle options menu').click()
    cy.findByLabelText('Toggle all options').click()

    cy.findByLabelText('Reading').should('be.checked')
    cy.findByLabelText('Swimming').should('be.checked')
    cy.findByLabelText('Running').should('be.checked')
    cy.findByLabelText('Cycling').should('be.checked')
    cy.findByLabelText('Cooking').should('be.checked')
    cy.findByLabelText('Gardening').should('be.checked')

    cy.findByPlaceholderText('Search...').type('Read')

    cy.tick(SELECT_MENU_SEARCH_DEBOUNCE_TIME)

    cy.findByLabelText('Reading').should('exist')
    cy.findByLabelText('Swimming').should('not.exist')
    cy.findByLabelText('Running').should('not.exist')
    cy.findByLabelText('Cycling').should('not.exist')
    cy.findByLabelText('Cooking').should('not.exist')
    cy.findByLabelText('Gardening').should('not.exist')

    cy.findByLabelText('Toggle all options').click()

    cy.findByLabelText('List of selected options')
      .should('exist')
      .within(() => {
        cy.findByText('Reading').should('not.exist')
        cy.findByText('Swimming').should('exist')
        cy.findByText('Running').should('exist')
        cy.findByText('Cycling').should('exist')
        cy.findByText('Cooking').should('exist')
        cy.findByText('Gardening').should('exist')
      })
  })

  it('should show correct filtered options when searching for a value', () => {
    cy.mount(
      <SelectMultiple
        options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
      />
    )

    cy.findByLabelText('Toggle options menu').click()
    cy.findByPlaceholderText('Search...').type('Read')

    cy.findByLabelText('Reading').should('exist')
    cy.findByLabelText('Swimming').should('not.exist')
    cy.findByLabelText('Running').should('not.exist')
    cy.findByLabelText('Cycling').should('not.exist')
    cy.findByLabelText('Cooking').should('not.exist')
    cy.findByLabelText('Gardening').should('not.exist')
  })

  it('should debounce the search input correctly', () => {
    cy.mount(
      <SelectMultiple
        options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
      />
    )

    cy.clock()

    cy.findByLabelText('Toggle options menu').click()
    cy.findByPlaceholderText('Search...').type('Read')
    cy.findByLabelText('Swimming').should('exist')

    cy.tick(SELECT_MENU_SEARCH_DEBOUNCE_TIME)

    cy.findByLabelText('Reading').should('exist')
    cy.findByLabelText('Swimming').should('not.exist')

    cy.get('input[aria-label="Search for an option"]').clear()

    cy.tick(SELECT_MENU_SEARCH_DEBOUNCE_TIME)

    cy.findByLabelText('Reading').should('exist')
    cy.findByLabelText('Swimming').should('exist')
    cy.findByLabelText('Running').should('exist')
    cy.findByLabelText('Cycling').should('exist')
    cy.findByLabelText('Cooking').should('exist')
    cy.findByLabelText('Gardening').should('exist')

    cy.clock().then((clock) => clock.restore())
  })

  it('should show count of selected options when isSearchable is false', () => {
    cy.mount(
      <SelectMultiple
        options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
        isSearchable={false}
      />
    )

    cy.findByLabelText('Toggle options menu').click()
    cy.findByLabelText('Reading').click()
    cy.findByLabelText('Swimming').click()

    cy.findByText('2 selected').should('exist')
  })

  it('should show No Options Found and toggle all chebox be disabled when search does not match any option', () => {
    cy.mount(
      <SelectMultiple
        options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
      />
    )

    cy.findByLabelText('Toggle options menu').click()
    cy.findByPlaceholderText('Search...').type('Yoga')

    cy.findByText('No options found').should('exist')
    cy.findByLabelText('Toggle all options').should('be.disabled')
  })

  it('should be disabled when isDisabled is true', () => {
    cy.mount(
      <SelectMultiple
        options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
        isDisabled
      />
    )

    cy.findByLabelText('Toggle options menu').should('be.disabled')
  })

  it('should be invalid when isInvalid is true', () => {
    cy.mount(
      <SelectMultiple
        options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
        isInvalid
      />
    )

    cy.findByLabelText('Toggle options menu').should('have.attr', 'aria-invalid', 'true')
  })
})
