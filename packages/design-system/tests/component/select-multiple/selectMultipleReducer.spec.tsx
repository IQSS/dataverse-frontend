import {
  selectMultipleInitialState,
  selectMultipleReducer
} from '../../../src/lib/components/select-multiple/selectMultipleReducer'

describe('selectMultipleReducer', () => {
  it('should return state if bad action type is passed', () => {
    const state = selectMultipleReducer(selectMultipleInitialState, {
      // @ts-expect-error - Testing bad action type
      type: 'BAD_ACTION'
    })

    expect(state).deep.equal(selectMultipleInitialState)
  })

  it('should select an option', () => {
    const state = selectMultipleReducer(selectMultipleInitialState, {
      type: 'SELECT_OPTION',
      payload: 'Reading'
    })

    expect(state.selectedOptions).to.include('Reading')
  })

  it('should remove an option', () => {
    const state = selectMultipleReducer(
      { ...selectMultipleInitialState, selectedOptions: ['Reading'] },
      {
        type: 'REMOVE_OPTION',
        payload: 'Reading'
      }
    )

    expect(state.selectedOptions).to.not.include('Reading')
  })

  it('should select all available options when there are no current filtered options', () => {
    const state = selectMultipleReducer(
      { ...selectMultipleInitialState, options: ['Reading', 'Swimming'] },
      {
        type: 'SELECT_ALL_OPTIONS'
      }
    )

    expect(state.selectedOptions).to.deep.equal(['Reading', 'Swimming'])
  })

  it('should deselect all available options when there are no current filtered options', () => {
    const state = selectMultipleReducer(
      {
        ...selectMultipleInitialState,
        options: ['Reading', 'Swimming'],
        selectedOptions: ['Reading', 'Swimming']
      },
      {
        type: 'DESELECT_ALL_OPTIONS'
      }
    )

    expect(state.selectedOptions).to.be.empty
  })

  it('should select all filtered options', () => {
    const state = selectMultipleReducer(
      {
        ...selectMultipleInitialState,
        options: ['Reading', 'Swimming', 'Running'],
        filteredOptions: ['Reading', 'Swimming']
      },
      {
        type: 'SELECT_ALL_OPTIONS'
      }
    )

    expect(state.selectedOptions).to.deep.equal(['Reading', 'Swimming'])
  })

  it('should deselect all filtered options', () => {
    const state = selectMultipleReducer(
      {
        ...selectMultipleInitialState,
        options: ['Reading', 'Swimming', 'Running'],
        selectedOptions: ['Reading', 'Swimming'],
        filteredOptions: ['Reading', 'Swimming']
      },
      {
        type: 'DESELECT_ALL_OPTIONS'
      }
    )

    expect(state.selectedOptions).to.be.empty
  })

  it('should add filtered options to selected options when selecting all if filtered options are present', () => {
    const state = selectMultipleReducer(
      {
        ...selectMultipleInitialState,
        options: ['Reading', 'Swimming', 'Running'],
        selectedOptions: ['Reading', 'Swimming'],
        filteredOptions: ['Running']
      },
      {
        type: 'SELECT_ALL_OPTIONS'
      }
    )

    expect(state.selectedOptions).to.deep.equal(['Reading', 'Swimming', 'Running'])
  })

  it('should filter options', () => {
    const state = selectMultipleReducer(
      { ...selectMultipleInitialState, options: ['Reading', 'Swimming', 'Running'] },
      {
        type: 'SEARCH',
        payload: 'read'
      }
    )

    expect(state.filteredOptions).to.include('Reading')
    expect(state.filteredOptions).to.not.include('Swimming', 'Running')
  })

  it('should reset search value when empty string is passed', () => {
    const state = selectMultipleReducer(
      { ...selectMultipleInitialState, searchValue: 'read' },
      {
        type: 'SEARCH',
        payload: ''
      }
    )

    expect(state.searchValue).to.equal('')
  })
})
