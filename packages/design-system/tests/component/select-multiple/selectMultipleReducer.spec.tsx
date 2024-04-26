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

  it('it should select an option', () => {
    const state = selectMultipleReducer(selectMultipleInitialState, {
      type: 'SELECT_OPTION',
      payload: 'Reading'
    })

    expect(state.selectedOptions).to.include('Reading')
  })

  it('it should remove an option', () => {
    const state = selectMultipleReducer(
      { ...selectMultipleInitialState, selectedOptions: ['Reading'] },
      {
        type: 'REMOVE_OPTION',
        payload: 'Reading'
      }
    )

    expect(state.selectedOptions).to.not.include('Reading')
  })

  it('it should toggle all options', () => {
    const state = selectMultipleReducer(
      { ...selectMultipleInitialState, options: ['Reading', 'Swimming'] },
      {
        type: 'TOGGLE_ALL_OPTIONS'
      }
    )

    expect(state.selectedOptions).to.include('Reading', 'Swimming')
  })

  it('it should unselect all options', () => {
    const state = selectMultipleReducer(
      {
        ...selectMultipleInitialState,
        options: ['Reading', 'Swimming'],
        selectedOptions: ['Reading', 'Swimming']
      },
      {
        type: 'TOGGLE_ALL_OPTIONS'
      }
    )

    expect(state.selectedOptions).to.be.empty
  })

  it('it should filter options', () => {
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
