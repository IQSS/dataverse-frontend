import {
  SelectAdvancedState,
  getSelectAdvancedInitialState,
  selectAdvancedReducer
} from '../../../src/lib/components/select-advanced/selectAdvancedReducer'

const options = ['Reading', 'Swimming', 'Running']
const selectWord = 'Select...'

describe('selectAdvancedReducer', () => {
  it('should return state if bad action type is passed', () => {
    const expectedInitialState: SelectAdvancedState = {
      options: options,
      selected: '',
      filteredOptions: [],
      searchValue: '',
      isMultiple: false,
      selectWord
    }

    const state = selectAdvancedReducer(getSelectAdvancedInitialState(false, options, selectWord), {
      // @ts-expect-error - Testing bad action type
      type: 'BAD_ACTION'
    })

    expect(state).deep.equal(expectedInitialState)
  })

  describe('should select an option', () => {
    it('on single select mode', () => {
      const state = selectAdvancedReducer(
        getSelectAdvancedInitialState(false, options, selectWord),
        {
          type: 'SELECT_OPTION',
          payload: 'Reading'
        }
      )

      expect(state.selected).to.include('Reading')
    })
    it('on multiple select mode', () => {
      const state = selectAdvancedReducer(
        getSelectAdvancedInitialState(true, options, selectWord),
        {
          type: 'SELECT_OPTION',
          payload: 'Reading'
        }
      )

      expect(state.selected).to.include('Reading')
    })
  })

  it('should remove an option', () => {
    const state = selectAdvancedReducer(
      { ...getSelectAdvancedInitialState(true, options, selectWord), selected: ['Reading'] },
      {
        type: 'REMOVE_OPTION',
        payload: 'Reading'
      }
    )

    expect(state.selected).to.not.include('Reading')
  })

  it('should select all available options when there are no current filtered options', () => {
    const state = selectAdvancedReducer(
      {
        ...getSelectAdvancedInitialState(true, options, selectWord),
        options: ['Reading', 'Swimming']
      },
      {
        type: 'SELECT_ALL_OPTIONS'
      }
    )

    expect(state.selected).to.deep.equal(['Reading', 'Swimming'])
  })

  it('should deselect all available options when there are no current filtered options', () => {
    const state = selectAdvancedReducer(
      {
        ...getSelectAdvancedInitialState(true, options, selectWord),
        options: ['Reading', 'Swimming'],
        selected: ['Reading', 'Swimming']
      },
      {
        type: 'DESELECT_ALL_OPTIONS'
      }
    )

    expect(state.selected).to.be.empty
  })

  it('should select all filtered options', () => {
    const state = selectAdvancedReducer(
      {
        ...getSelectAdvancedInitialState(true, options, selectWord),
        options: ['Reading', 'Swimming', 'Running'],
        filteredOptions: ['Reading', 'Swimming']
      },
      {
        type: 'SELECT_ALL_OPTIONS'
      }
    )

    expect(state.selected).to.deep.equal(['Reading', 'Swimming'])
  })

  it('should deselect all filtered options', () => {
    const state = selectAdvancedReducer(
      {
        ...getSelectAdvancedInitialState(true, options, selectWord),
        options: ['Reading', 'Swimming', 'Running'],
        selected: ['Reading', 'Swimming'],
        filteredOptions: ['Reading', 'Swimming']
      },
      {
        type: 'DESELECT_ALL_OPTIONS'
      }
    )

    expect(state.selected).to.be.empty
  })

  it('should add filtered options to selected options when selecting all if filtered options are present', () => {
    const state = selectAdvancedReducer(
      {
        ...getSelectAdvancedInitialState(true, options, selectWord),
        options: ['Reading', 'Swimming', 'Running'],
        selected: ['Reading', 'Swimming'],
        filteredOptions: ['Running']
      },
      {
        type: 'SELECT_ALL_OPTIONS'
      }
    )

    expect(state.selected).to.deep.equal(['Reading', 'Swimming', 'Running'])
  })

  it('should filter options', () => {
    const state = selectAdvancedReducer(
      {
        ...getSelectAdvancedInitialState(true, options, selectWord),
        options: ['Reading', 'Swimming', 'Running']
      },
      {
        type: 'SEARCH',
        payload: 'read'
      }
    )

    expect(state.filteredOptions).to.include('Reading')
    expect(state.filteredOptions).to.not.include('Swimming', 'Running')
  })

  it('should reset search value when empty string is passed', () => {
    const state = selectAdvancedReducer(
      { ...getSelectAdvancedInitialState(true, options, selectWord), searchValue: 'read' },
      {
        type: 'SEARCH',
        payload: ''
      }
    )

    expect(state.searchValue).to.equal('')
  })

  it('should update options', () => {
    const state = selectAdvancedReducer(
      { ...getSelectAdvancedInitialState(true, options, selectWord), options: ['Reading'] },
      {
        type: 'UPDATE_OPTIONS',
        payload: ['Reading', 'Swimming']
      }
    )

    expect(state.options).to.deep.equal(['Reading', 'Swimming'])
  })
})
