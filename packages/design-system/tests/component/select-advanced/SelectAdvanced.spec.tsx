import { useState } from 'react'
import {
  SelectAdvanced,
  SELECT_MENU_SEARCH_DEBOUNCE_TIME
} from '../../../src/lib/components/select-advanced/SelectAdvanced'

function toggleOptionsMenu() {
  cy.findByLabelText('Toggle options menu').click()
}

describe('SelectAdvanced', () => {
  describe('should render correctly', () => {
    it('on single selection', () => {
      cy.mount(
        <SelectAdvanced
          options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
        />
      )

      cy.findByText('Select...').should('exist')
    })
    it('on multiple selection', () => {
      cy.mount(
        <SelectAdvanced
          isMultiple
          options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
        />
      )
      cy.findByText('Select...').should('exist')
    })
  })

  describe('should render correct options', () => {
    it('on single selection', () => {
      cy.mount(
        <SelectAdvanced
          options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
        />
      )

      toggleOptionsMenu()

      cy.findByText('Reading').should('exist')
      cy.findByText('Reading').should('exist')
      cy.findByText('Swimming').should('exist')
      cy.findByText('Running').should('exist')
      cy.findByText('Cycling').should('exist')
      cy.findByText('Cooking').should('exist')
      cy.findByText('Gardening').should('exist')

      // 6 Options + 1 Select... option
      cy.findAllByRole('option').should('have.length', 7)
    })
    it('on multiple selection', () => {
      cy.mount(
        <SelectAdvanced
          isMultiple
          options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
        />
      )
      toggleOptionsMenu()

      cy.findByText('Reading').should('exist')
      cy.findByText('Swimming').should('exist')
      cy.findByText('Running').should('exist')
      cy.findByText('Cycling').should('exist')
      cy.findByText('Cooking').should('exist')
      cy.findByText('Gardening').should('exist')

      cy.findAllByRole('option').should('have.length', 6)
    })
  })

  describe('should render with default values', () => {
    it('on single selection', () => {
      cy.mount(
        <SelectAdvanced
          options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
          defaultValue={'Running'}
        />
      )

      cy.findByText('Running').should('exist')
    })
    it('on multiple selection', () => {
      cy.mount(
        <SelectAdvanced
          isMultiple
          options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
          defaultValue={['Reading', 'Running']}
        />
      )
      cy.findByText('Reading').should('exist')
      cy.findByText('Running').should('exist')
    })
  })

  describe('should call onChange when an option is selected', () => {
    it('on single selection', () => {
      const onChange = cy.stub().as('onChange')

      cy.mount(
        <SelectAdvanced
          options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
          onChange={onChange}
        />
      )

      toggleOptionsMenu()
      cy.findByText('Reading').click()

      cy.get('@onChange').should('have.been.calledOnce')
      cy.get('@onChange').should('have.been.calledWith', 'Reading')
    })

    it('on multiple selection', () => {
      const onChange = cy.stub().as('onChange')

      cy.mount(
        <SelectAdvanced
          isMultiple
          options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
          onChange={onChange}
        />
      )
      toggleOptionsMenu()
      cy.findByLabelText('Reading').click()

      cy.get('@onChange').should('have.been.calledOnce')
      cy.get('@onChange').should('have.been.calledWith', ['Reading'])
    })
  })

  describe('should call onChange when an option is deselected', () => {
    // Only on multiple selection as in single selection mode we can't deselect an option just change it to another
    it('on multiple selection', () => {
      const onChange = cy.stub().as('onChange')

      cy.mount(
        <SelectAdvanced
          isMultiple
          options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
          onChange={onChange}
        />
      )
      toggleOptionsMenu()
      cy.findByLabelText('Reading').click()
      cy.get('@onChange').should('have.been.calledWith', ['Reading'])

      cy.findByLabelText('Reading').click()
      cy.get('@onChange').should('have.been.calledWith', [])

      cy.get('@onChange').should('have.been.calledTwice')
    })
    it('on multiple selection with default value', () => {
      const onChange = cy.stub().as('onChange')

      cy.mount(
        <SelectAdvanced
          isMultiple
          options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
          defaultValue={['Reading', 'Running']}
          onChange={onChange}
        />
      )
      toggleOptionsMenu()
      cy.findByLabelText('Reading').click()

      cy.get('@onChange').should('have.been.calledOnce')
      cy.get('@onChange').should('have.been.calledWith', ['Running'])
    })
  })

  describe('should not call onChange when passing defaultValues and rendering for first time', () => {
    it('on single selection', () => {
      const onChange = cy.stub().as('onChange')

      cy.mount(
        <SelectAdvanced
          options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
          defaultValue={'Reading'}
          onChange={onChange}
        />
      )

      cy.get('@onChange').should('not.have.been.called')
    })
    it('on multiple selection', () => {
      const onChange = cy.stub().as('onChange')

      cy.mount(
        <SelectAdvanced
          isMultiple
          options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
          defaultValue={['Reading', 'Running']}
          onChange={onChange}
        />
      )
      cy.get('@onChange').should('not.have.been.called')
    })
  })

  describe('should call onChange correct times after multiple types of selections', () => {
    it('on single selection', () => {
      const onChange = cy.stub().as('onChange')

      cy.mount(
        <SelectAdvanced
          options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
          onChange={onChange}
        />
      )

      toggleOptionsMenu()

      // 6 different individual selections
      cy.findByText('Reading').click()

      toggleOptionsMenu()
      cy.findByText('Swimming').click()

      toggleOptionsMenu()
      cy.findByText('Running').click()

      toggleOptionsMenu()
      cy.findByText('Cycling').click()

      toggleOptionsMenu()
      cy.findByText('Reading').click()

      toggleOptionsMenu()
      cy.findByText('Swimming').click()

      cy.get('@onChange').should('have.callCount', 6)
      cy.get('@onChange').should('have.been.calledWith', 'Reading')
      cy.get('@onChange').should('have.been.calledWith', 'Swimming')
      cy.get('@onChange').should('have.been.calledWith', 'Running')
      cy.get('@onChange').should('have.been.calledWith', 'Cycling')
    })

    it('on multiple selection', () => {
      const onChange = cy.stub().as('onChange')

      cy.mount(
        <SelectAdvanced
          isMultiple
          options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
          onChange={onChange}
        />
      )

      toggleOptionsMenu()

      // 4 individual selections
      cy.findByLabelText('Reading').click()
      cy.findByLabelText('Swimming').click()
      cy.findByLabelText('Running').click()
      cy.findByLabelText('Cycling').click()

      // Select all options
      cy.findByLabelText('Toggle all options').click()

      // Now deselect 1 option individually
      cy.findByLabelText('Cooking').click()

      cy.get('@onChange').should('have.callCount', 6)
      cy.get('@onChange').should('have.been.calledWith', ['Reading'])
      cy.get('@onChange').should('have.been.calledWith', ['Reading', 'Swimming'])
      cy.get('@onChange').should('have.been.calledWith', ['Reading', 'Swimming', 'Running'])
      cy.get('@onChange').should('have.been.calledWith', [
        'Reading',
        'Swimming',
        'Running',
        'Cycling'
      ])
      // When selecting all
      cy.get('@onChange').should('have.been.calledWith', [
        'Reading',
        'Swimming',
        'Running',
        'Cycling',
        'Cooking',
        'Gardening'
      ])
      // When deselecting Cooking
      cy.get('@onChange').should('have.been.calledWith', [
        'Reading',
        'Swimming',
        'Running',
        'Cycling',
        'Gardening'
      ])
    })
  })

  describe('should select an option and be shown as selected both in the menu as well as in the selected options', () => {
    it('on single selection', () => {
      cy.mount(
        <SelectAdvanced
          options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
        />
      )
      toggleOptionsMenu()
      cy.findByText('Reading').click()
      cy.findAllByText('Reading').spread((_selectedItem, selectedListOption) => {
        const element = cy.get(selectedListOption)
        element.should('have.class', 'active')
      })

      cy.findByTestId('toggle-inner-content')
        .should('exist')
        .within(() => {
          cy.findByText('Reading').should('exist')
        })
    })
    it('on multiple selection', () => {
      cy.mount(
        <SelectAdvanced
          isMultiple
          options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
        />
      )

      toggleOptionsMenu()
      cy.findByLabelText('Reading').click()
      cy.findByLabelText('Reading').should('be.checked')

      cy.findByTestId('toggle-inner-content')
        .should('exist')
        .within(() => {
          cy.findByText('Reading').should('exist')
        })
    })
  })

  it('should change the selected option when selecting another option in single selection mode', () => {
    cy.mount(
      <SelectAdvanced
        options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
      />
    )

    toggleOptionsMenu()
    cy.findByText('Reading').click()
    cy.findAllByText('Reading')
      .should('have.length', 2)
      .spread((_selectedItem, selectedListOption) => {
        const element = cy.get(selectedListOption)
        element.should('have.class', 'active')
        element.should('have.attr', 'aria-selected', 'true')
      })

    toggleOptionsMenu()

    cy.findByText('Swimming').click()

    cy.findAllByText('Swimming')
      .should('have.length', 2)
      .spread((_selectedItem, selectedListOption) => {
        const element = cy.get(selectedListOption)
        element.should('have.class', 'active')
        element.should('have.attr', 'aria-selected', 'true')
      })
    cy.findByText('Reading')
      .should('not.have.class', 'active')
      .should('have.attr', 'aria-selected', 'false')
  })

  it('should not change the selected option when clicking on the selected option in single selection mode', () => {
    cy.mount(
      <SelectAdvanced
        options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
      />
    )

    toggleOptionsMenu()
    cy.findByText('Reading').click()

    toggleOptionsMenu()

    cy.findAllByText('Reading')
      .should('have.length', 2)
      .spread((_selectedItem, selectedListOption) => {
        const element = cy.get(selectedListOption)
        element.should('have.class', 'active')
      })

    cy.findAllByText('Reading').spread((_selectedItem, selectedListOption) => {
      const element = cy.get(selectedListOption)
      element.click()
    })

    toggleOptionsMenu()

    cy.findAllByText('Reading')
      .should('have.length', 2)
      .spread((_selectedItem, selectedListOption) => {
        const element = cy.get(selectedListOption)
        element.should('have.class', 'active')
      })
  })

  it('should remove a selected option by clicking on an X icon of an item in the selected options in multiple selection mode', () => {
    cy.mount(
      <SelectAdvanced
        isMultiple
        options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
      />
    )

    toggleOptionsMenu()
    cy.findByLabelText('Reading').click()

    cy.findByTestId('toggle-inner-content').within(() => {
      cy.findByLabelText('Remove Reading option').click()
      cy.findByText('Reading').should('not.exist')
    })
  })

  it('selects all options on multiple selection mode', () => {
    cy.mount(
      <SelectAdvanced
        isMultiple
        options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
      />
    )

    toggleOptionsMenu()
    cy.findByLabelText('Toggle all options').click()

    cy.findByLabelText('Reading').should('be.checked')
    cy.findByLabelText('Swimming').should('be.checked')
    cy.findByLabelText('Running').should('be.checked')
    cy.findByLabelText('Cycling').should('be.checked')
    cy.findByLabelText('Cooking').should('be.checked')
    cy.findByLabelText('Gardening').should('be.checked')

    cy.findByTestId('toggle-inner-content')
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

  it('deselects all options on multiple selection mode', () => {
    cy.mount(
      <SelectAdvanced
        isMultiple
        options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
      />
    )

    toggleOptionsMenu()
    cy.findByLabelText('Toggle all options').click()
    cy.findByLabelText('Toggle all options').click()

    cy.findByLabelText('Reading').should('not.be.checked')
    cy.findByLabelText('Swimming').should('not.be.checked')
    cy.findByLabelText('Running').should('not.be.checked')
    cy.findByLabelText('Cycling').should('not.be.checked')
    cy.findByLabelText('Cooking').should('not.be.checked')
    cy.findByLabelText('Gardening').should('not.be.checked')

    cy.findByTestId('toggle-inner-content')
      .should('exist')
      .within(() => {
        cy.findByText('Reading').should('not.exist')
        cy.findByText('Swimming').should('not.exist')
        cy.findByText('Running').should('not.exist')
        cy.findByText('Cycling').should('not.exist')
        cy.findByText('Cooking').should('not.exist')
        cy.findByText('Gardening').should('not.exist')
      })
    cy.findByText('Select...').should('exist')
  })

  it('should select all filtered options on multiple selection mode', () => {
    cy.mount(
      <SelectAdvanced
        isMultiple
        options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
      />
    )
    cy.clock()

    toggleOptionsMenu()
    cy.findByPlaceholderText('Search...').type('Read')

    cy.tick(SELECT_MENU_SEARCH_DEBOUNCE_TIME)

    cy.findByLabelText('Reading').should('exist')
    cy.findByLabelText('Swimming').should('not.exist')
    cy.findByLabelText('Running').should('not.exist')
    cy.findByLabelText('Cycling').should('not.exist')
    cy.findByLabelText('Cooking').should('not.exist')
    cy.findByLabelText('Gardening').should('not.exist')

    cy.findByLabelText('Toggle all options').click()

    cy.findByTestId('toggle-inner-content')
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

  it('should unselect only filtered options on multiple selection mode', () => {
    cy.mount(
      <SelectAdvanced
        isMultiple
        options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
      />
    )
    cy.clock()

    toggleOptionsMenu()
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

    cy.findByTestId('toggle-inner-content')
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

  describe('should show correct filtered options when searching for a value', () => {
    it('on single selection', () => {
      cy.mount(
        <SelectAdvanced
          options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
        />
      )

      toggleOptionsMenu()
      cy.findByPlaceholderText('Search...').type('Read')

      cy.findByText('Reading').should('exist')
      cy.findByText('Swimming').should('not.exist')
      cy.findByText('Running').should('not.exist')
      cy.findByText('Cycling').should('not.exist')
      cy.findByText('Cooking').should('not.exist')
      cy.findByText('Gardening').should('not.exist')
    })
    it('on multiple selection', () => {
      cy.mount(
        <SelectAdvanced
          isMultiple
          options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
        />
      )

      toggleOptionsMenu()
      cy.findByPlaceholderText('Search...').type('Read')

      cy.findByLabelText('Reading').should('exist')
      cy.findByLabelText('Swimming').should('not.exist')
      cy.findByLabelText('Running').should('not.exist')
      cy.findByLabelText('Cycling').should('not.exist')
      cy.findByLabelText('Cooking').should('not.exist')
      cy.findByLabelText('Gardening').should('not.exist')
    })
  })

  it('should debounce the search input correctly', () => {
    cy.mount(
      <SelectAdvanced
        isMultiple
        options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
      />
    )

    cy.clock()

    toggleOptionsMenu()
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

  it('should show count of selected options when isSearchable is false on multiple selection mode', () => {
    cy.mount(
      <SelectAdvanced
        isMultiple
        isSearchable={false}
        options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
      />
    )

    toggleOptionsMenu()
    cy.findByLabelText('Reading').click()
    cy.findByLabelText('Swimming').click()

    cy.findByText('2 selected').should('exist')
  })

  describe('should not show search when isSearchable is false', () => {
    it('on single selection', () => {
      cy.mount(
        <SelectAdvanced
          isSearchable={false}
          options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
        />
      )

      toggleOptionsMenu()

      cy.findByTestId('select-advanced-searchable-input').should('not.exist')
    })

    it('on multiple selection', () => {
      cy.mount(
        <SelectAdvanced
          isMultiple
          isSearchable={false}
          options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
        />
      )

      toggleOptionsMenu()

      cy.findByTestId('select-advanced-searchable-input').should('not.exist')
    })
  })

  it('should not show Selection Count on single selection when isSearchable is false', () => {
    cy.mount(
      <SelectAdvanced
        isSearchable={false}
        options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
      />
    )

    toggleOptionsMenu()
    cy.findByText('Reading').click()

    cy.findByTestId('select-advanced-searchable-input').should('not.exist')
    cy.findByTestId('select-advanced-selected-count').should('not.exist')
  })

  it('should show Selection Count on multiple selection when isSearchable is false', () => {
    cy.mount(
      <SelectAdvanced
        isMultiple
        isSearchable={false}
        options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
      />
    )

    toggleOptionsMenu()
    cy.findByLabelText('Reading').click()
    cy.findByLabelText('Swimming').click()

    cy.findByTestId('select-advanced-searchable-input').should('not.exist')
    cy.findByTestId('select-advanced-selected-count')
      .should('exist')
      .should('have.text', '2 selected')
  })

  describe('should show No Options Found when search does not match any option', () => {
    it('on single selection', () => {
      cy.mount(
        <SelectAdvanced
          options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
        />
      )

      toggleOptionsMenu()
      cy.findByPlaceholderText('Search...').type('Yoga')

      cy.findByText('No options found').should('exist')
    })
    it('on multiple selection', () => {
      cy.mount(
        <SelectAdvanced
          isMultiple
          options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
        />
      )
      toggleOptionsMenu()
      cy.findByPlaceholderText('Search...').type('Yoga')

      cy.findByText('No options found').should('exist')
      cy.findByLabelText('Toggle all options').should('be.disabled')
    })
  })

  describe('should be disabled when isDisabled is true', () => {
    it('on single selection', () => {
      cy.mount(
        <SelectAdvanced
          options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
          isDisabled
        />
      )

      cy.findByLabelText('Toggle options menu').should('be.disabled')
    })
    it('on multiple selection', () => {
      cy.mount(
        <SelectAdvanced
          isMultiple
          options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
          isDisabled
        />
      )

      cy.findByLabelText('Toggle options menu').should('be.disabled')
    })
  })

  describe('should be invalid when isInvalid is true', () => {
    it('on single selection', () => {
      cy.mount(
        <SelectAdvanced
          options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
          isInvalid
        />
      )

      cy.findByLabelText('Toggle options menu').should('have.attr', 'aria-invalid', 'true')
    })
    it('on multiple selection', () => {
      cy.mount(
        <SelectAdvanced
          isMultiple
          options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
          isInvalid
        />
      )

      cy.findByLabelText('Toggle options menu').should('have.attr', 'aria-invalid', 'true')
    })
  })

  describe('when options props changes', () => {
    const ADD_OPTION_BUTTON_TEST_ID = 'add-option-button'
    const CHANGE_ALL_OPTIONS_BUTTON_TEST_ID = 'change-all-options-button'
    const CHANGE_ALL_ONE_KEEP_OPTION_BUTTON_TEST_ID = 'chage-all-one-keep-option-button'
    const ALL_NEW_OPTIONS = ['Foo', 'Bar', 'Ron', 'Hermione']
    const NEW_OPTIONS_BUT_ONE_REMAIN_THE_SAME = ['Foo', 'Reading', 'Ron', 'Hermione', 'Harry']

    const SelectWithButtonsToChangeOptions = ({
      isMultiple,
      withDefaultValues,
      onChange
    }: {
      isMultiple: boolean
      withDefaultValues: boolean
      onChange?: (value: string | string[]) => void
    }) => {
      const [availableOptions, setAvailableOptions] = useState(['Reading', 'Swimming', 'Running'])

      return (
        <>
          <button
            data-testid={ADD_OPTION_BUTTON_TEST_ID}
            onClick={() => setAvailableOptions((current) => [...current, 'Gardening'])}>
            Add Gardening option
          </button>

          <button
            data-testid={CHANGE_ALL_OPTIONS_BUTTON_TEST_ID}
            onClick={() => setAvailableOptions(ALL_NEW_OPTIONS)}>
            Change all options
          </button>
          <button
            data-testid={CHANGE_ALL_ONE_KEEP_OPTION_BUTTON_TEST_ID}
            onClick={() => setAvailableOptions(NEW_OPTIONS_BUT_ONE_REMAIN_THE_SAME)}>
            Change all new options but leave one
          </button>
          {/* @ts-expect-error type boolean is not assignable to type true */}
          <SelectAdvanced
            isMultiple={isMultiple}
            options={availableOptions}
            onChange={onChange}
            defaultValue={
              withDefaultValues ? (isMultiple ? ['Reading', 'Running'] : 'Reading') : undefined
            }
          />
        </>
      )
    }
    describe('adds one option correctly', () => {
      it('on single selection', () => {
        cy.mount(<SelectWithButtonsToChangeOptions isMultiple={false} withDefaultValues={false} />)

        toggleOptionsMenu()
        cy.findByText('Reading').should('exist')
        cy.findByText('Swimming').should('exist')
        cy.findByText('Running').should('exist')
        cy.findByText('Gardening').should('not.exist')

        cy.findByTestId(ADD_OPTION_BUTTON_TEST_ID).click()

        cy.findByText('Reading').should('exist')
        cy.findByText('Swimming').should('exist')
        cy.findByText('Running').should('exist')
        cy.findByText('Gardening').should('exist')
      })

      it('on single selection with default value', () => {
        cy.mount(<SelectWithButtonsToChangeOptions isMultiple={false} withDefaultValues={true} />)

        toggleOptionsMenu()
        cy.findAllByText('Reading').should('exist').should('have.length', 2)
        cy.findByText('Swimming').should('exist')
        cy.findByText('Running').should('exist')
        cy.findByText('Gardening').should('not.exist')

        cy.findByTestId(ADD_OPTION_BUTTON_TEST_ID).click()

        cy.findAllByText('Reading').should('exist').should('have.length', 2)
        cy.findByText('Swimming').should('exist')
        cy.findByText('Running').should('exist')
        cy.findByText('Gardening').should('exist')
      })

      it('on multiple selection', () => {
        cy.mount(<SelectWithButtonsToChangeOptions isMultiple={true} withDefaultValues={false} />)

        toggleOptionsMenu()
        cy.findByLabelText('Reading').should('exist')
        cy.findByLabelText('Swimming').should('exist')
        cy.findByLabelText('Running').should('exist')
        cy.findByLabelText('Gardening').should('not.exist')

        cy.findByTestId(ADD_OPTION_BUTTON_TEST_ID).click()

        cy.findByLabelText('Reading').should('exist')
        cy.findByLabelText('Swimming').should('exist')
        cy.findByLabelText('Running').should('exist')
        cy.findByLabelText('Gardening').should('exist')
      })
      it('on multiple selection with default values', () => {
        cy.mount(<SelectWithButtonsToChangeOptions isMultiple={true} withDefaultValues={true} />)

        toggleOptionsMenu()
        cy.findByLabelText('Reading').should('exist')
        cy.findByLabelText('Swimming').should('exist')
        cy.findByLabelText('Running').should('exist')
        cy.findByLabelText('Gardening').should('not.exist')

        cy.findByTestId(ADD_OPTION_BUTTON_TEST_ID).click()

        cy.findByLabelText('Reading').should('exist')
        cy.findByLabelText('Swimming').should('exist')
        cy.findByLabelText('Running').should('exist')
        cy.findByLabelText('Gardening').should('exist')
      })
    })

    describe('adds completely new options correctly', () => {
      it('on single selection', () => {
        cy.mount(<SelectWithButtonsToChangeOptions isMultiple={false} withDefaultValues={false} />)

        toggleOptionsMenu()
        cy.findByText('Reading').should('exist')
        cy.findByText('Swimming').should('exist')
        cy.findByText('Running').should('exist')

        cy.findByTestId(CHANGE_ALL_OPTIONS_BUTTON_TEST_ID).click()

        cy.findByText('Reading').should('not.exist')
        cy.findByText('Swimming').should('not.exist')
        cy.findByText('Running').should('not.exist')

        ALL_NEW_OPTIONS.forEach((option) => {
          cy.findByText(option).should('exist')
        })
      })

      it('on single selection with default value', () => {
        const onChange = cy.stub().as('onChange')

        cy.mount(
          <SelectWithButtonsToChangeOptions
            isMultiple={false}
            withDefaultValues={true}
            onChange={onChange}
          />
        )

        toggleOptionsMenu()
        cy.findAllByText('Reading').should('exist').should('have.length', 2)
        cy.findByText('Swimming').should('exist')
        cy.findByText('Running').should('exist')

        cy.findByTestId(CHANGE_ALL_OPTIONS_BUTTON_TEST_ID).click()

        cy.findByText('Reading').should('not.exist')
        cy.findByText('Swimming').should('not.exist')
        cy.findByText('Running').should('not.exist')

        ALL_NEW_OPTIONS.forEach((option) => {
          cy.findByText(option).should('exist')
        })

        cy.get('@onChange').should('have.been.calledOnce')
      })

      it('on multiple selection', () => {
        const onChange = cy.stub().as('onChange')

        cy.mount(
          <SelectWithButtonsToChangeOptions
            isMultiple={true}
            withDefaultValues={false}
            onChange={onChange}
          />
        )

        toggleOptionsMenu()
        cy.findByLabelText('Reading').should('exist')
        cy.findByLabelText('Reading').should('exist')
        cy.findByLabelText('Running').should('exist')

        cy.findByTestId(CHANGE_ALL_OPTIONS_BUTTON_TEST_ID).click()

        cy.findByText('Reading').should('not.exist')
        cy.findByText('Swimming').should('not.exist')
        cy.findByText('Running').should('not.exist')

        ALL_NEW_OPTIONS.forEach((option) => {
          cy.findByText(option).should('exist')
        })

        cy.get('@onChange').should('have.been.not.called')
      })

      it('on multiple selection with default values', () => {
        const onChange = cy.stub().as('onChange')
        cy.mount(
          <SelectWithButtonsToChangeOptions
            isMultiple={true}
            withDefaultValues={true}
            onChange={onChange}
          />
        )

        toggleOptionsMenu()
        cy.findAllByText('Reading').should('exist').should('have.length', 2)
        cy.findAllByText('Reading').should('exist').should('have.length', 2)
        cy.findByLabelText('Running').should('exist')

        cy.findByTestId(CHANGE_ALL_OPTIONS_BUTTON_TEST_ID).click()

        cy.findByText('Reading').should('not.exist')
        cy.findByText('Swimming').should('not.exist')
        cy.findByText('Running').should('not.exist')

        ALL_NEW_OPTIONS.forEach((option) => {
          cy.findByText(option).should('exist')
        })

        cy.get('@onChange').should('have.been.calledOnce')
      })
    })

    describe('adds new options but keeps one option the same correctly', () => {
      it('on single selection', () => {
        const onChange = cy.stub().as('onChange')

        cy.mount(
          <SelectWithButtonsToChangeOptions
            isMultiple={false}
            withDefaultValues={false}
            onChange={onChange}
          />
        )

        toggleOptionsMenu()
        cy.findByText('Reading').should('exist')
        cy.findByText('Swimming').should('exist')
        cy.findByText('Running').should('exist')

        cy.findByTestId(CHANGE_ALL_ONE_KEEP_OPTION_BUTTON_TEST_ID).click()
        // This option remains
        cy.findByText('Reading').should('exist')
        cy.findByText('Swimming').should('not.exist')
        cy.findByText('Running').should('not.exist')

        NEW_OPTIONS_BUT_ONE_REMAIN_THE_SAME.filter((option) => option !== 'Reading').forEach(
          (option) => {
            cy.findByText(option).should('exist')
          }
        )

        cy.get('@onChange').should('have.been.not.called')
      })

      it('on single selection with default value', () => {
        const onChange = cy.stub().as('onChange')

        cy.mount(
          <SelectWithButtonsToChangeOptions
            isMultiple={false}
            withDefaultValues={true}
            onChange={onChange}
          />
        )

        toggleOptionsMenu()
        cy.findAllByText('Reading').should('exist').should('have.length', 2)
        cy.findByText('Swimming').should('exist')
        cy.findByText('Running').should('exist')

        cy.findByTestId(CHANGE_ALL_ONE_KEEP_OPTION_BUTTON_TEST_ID).click()

        // This option remains
        cy.findAllByText('Reading').should('exist').should('have.length', 2)
        cy.findByText('Swimming').should('not.exist')
        cy.findByText('Running').should('not.exist')

        NEW_OPTIONS_BUT_ONE_REMAIN_THE_SAME.filter((option) => option !== 'Reading').forEach(
          (option) => {
            cy.findByText(option).should('exist')
          }
        )

        cy.get('@onChange').should('have.been.not.called')
      })

      it('on multiple selection', () => {
        const onChange = cy.stub().as('onChange')

        cy.mount(
          <SelectWithButtonsToChangeOptions
            isMultiple={true}
            withDefaultValues={false}
            onChange={onChange}
          />
        )

        toggleOptionsMenu()
        cy.findByText('Reading').should('exist')
        cy.findByText('Running').should('exist')
        cy.findByText('Swimming').should('exist')

        cy.findByTestId(CHANGE_ALL_ONE_KEEP_OPTION_BUTTON_TEST_ID).click()

        // This option remains
        cy.findByText('Reading').should('exist')
        cy.findByText('Swimming').should('not.exist')
        cy.findByText('Running').should('not.exist')

        NEW_OPTIONS_BUT_ONE_REMAIN_THE_SAME.filter((option) => option !== 'Reading').forEach(
          (option) => {
            cy.findByLabelText(option).should('exist')
          }
        )

        cy.get('@onChange').should('have.been.not.called')
      })
      it('on multiple selection with default values', () => {
        const onChange = cy.stub().as('onChange')

        cy.mount(
          <SelectWithButtonsToChangeOptions
            isMultiple={true}
            withDefaultValues={true}
            onChange={onChange}
          />
        )

        toggleOptionsMenu()
        cy.findAllByText('Reading').should('exist').should('have.length', 2)
        cy.findAllByText('Running').should('exist').should('have.length', 2)
        cy.findByLabelText('Swimming').should('exist')

        cy.findByTestId(CHANGE_ALL_ONE_KEEP_OPTION_BUTTON_TEST_ID).click()

        // This option remains
        cy.findAllByText('Reading').should('exist').should('have.length', 2)
        cy.findByText('Swimming').should('not.exist')
        cy.findByText('Running').should('not.exist')

        NEW_OPTIONS_BUT_ONE_REMAIN_THE_SAME.filter((option) => option !== 'Reading').forEach(
          (option) => {
            cy.findByLabelText(option).should('exist')
          }
        )
        cy.get('@onChange').should('have.been.calledOnce')
      })
    })
  })

  it('selects the "Select..." option correctly', () => {
    cy.mount(
      <SelectAdvanced
        options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
      />
    )

    toggleOptionsMenu()
    cy.findByText('Swimming').click()

    toggleOptionsMenu()
    cy.findAllByText('Swimming').should('have.length', 2)

    cy.findByText('Select...').click()

    toggleOptionsMenu()
    cy.findAllByText('Select...').should('have.length', 2)
  })

  it('selects the custom Select word option correctly', () => {
    cy.mount(
      <SelectAdvanced
        locales={{ select: 'Selezionare...' }}
        options={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
      />
    )

    toggleOptionsMenu()
    cy.findByText('Swimming').click()

    toggleOptionsMenu()
    cy.findAllByText('Swimming').should('have.length', 2)

    cy.findByText('Selezionare...').click()

    toggleOptionsMenu()
    cy.findAllByText('Selezionare...').should('have.length', 2)
  })
})
