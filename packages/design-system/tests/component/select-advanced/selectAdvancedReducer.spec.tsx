import { type Option } from '../../../src/lib/components/select-advanced/SelectAdvanced'
import {
  SelectAdvancedState,
  getSelectAdvancedInitialState,
  selectAdvancedReducer
} from '../../../src/lib/components/select-advanced/selectAdvancedReducer'
import { normalizeOptions } from '../../../src/lib/components/select-advanced/utils'

const stringOptions = ['Reading', 'Swimming', 'Running']
const options: Option[] = normalizeOptions(stringOptions)
const selectWord = 'Select...'

describe('selectAdvancedReducer', () => {
  it('should return state if bad action type is passed', () => {
    const expectedInitialState: SelectAdvancedState = {
      options,
      selected: '',
      filteredOptions: [],
      searchValue: '',
      isMultiple: false,
      selectWord
    }

    const state = selectAdvancedReducer(
      getSelectAdvancedInitialState(false, options, selectWord),
      // @ts-expect-error - Testing bad action type
      { type: 'BAD_ACTION' }
    )

    expect(state).to.deep.equal(expectedInitialState)
  })

  describe('should select an option', () => {
    it('on single select mode', () => {
      const state = selectAdvancedReducer(
        getSelectAdvancedInitialState(false, options, selectWord),
        { type: 'SELECT_OPTION', payload: 'Reading' }
      )

      expect(state.selected).to.equal('Reading')
    })

    it('on multiple select mode', () => {
      const state = selectAdvancedReducer(
        getSelectAdvancedInitialState(true, options, selectWord),
        { type: 'SELECT_OPTION', payload: 'Reading' }
      )

      expect(state.selected).to.include('Reading')
    })
  })

  it('should remove an option', () => {
    const state = selectAdvancedReducer(
      { ...getSelectAdvancedInitialState(true, options, selectWord), selected: ['Reading'] },
      { type: 'REMOVE_OPTION', payload: 'Reading' }
    )

    expect(state.selected).to.not.include('Reading')
  })

  it('should select all available options when there are no current filtered options', () => {
    const localOptions = normalizeOptions(['Reading', 'Swimming'])
    const state = selectAdvancedReducer(
      { ...getSelectAdvancedInitialState(true, options, selectWord), options: localOptions },
      { type: 'SELECT_ALL_OPTIONS' }
    )

    expect(state.selected).to.deep.equal(['Reading', 'Swimming'])
  })

  it('should deselect all available options when there are no current filtered options', () => {
    const localOptions = normalizeOptions(['Reading', 'Swimming'])
    const state = selectAdvancedReducer(
      {
        ...getSelectAdvancedInitialState(true, options, selectWord),
        options: localOptions,
        selected: ['Reading', 'Swimming']
      },
      { type: 'DESELECT_ALL_OPTIONS' }
    )

    expect(state.selected).to.be.empty
  })

  it('should select all filtered options', () => {
    const localOptions = normalizeOptions(['Reading', 'Swimming', 'Running'])
    const filtered = normalizeOptions(['Reading', 'Swimming']) // reducer expects Option[]
    const state = selectAdvancedReducer(
      {
        ...getSelectAdvancedInitialState(true, options, selectWord),
        options: localOptions,
        filteredOptions: filtered
      },
      { type: 'SELECT_ALL_OPTIONS' }
    )

    expect(state.selected).to.deep.equal(['Reading', 'Swimming'])
  })

  it('should deselect all filtered options', () => {
    const localOptions = normalizeOptions(['Reading', 'Swimming', 'Running'])
    const filtered = normalizeOptions(['Reading', 'Swimming'])
    const state = selectAdvancedReducer(
      {
        ...getSelectAdvancedInitialState(true, options, selectWord),
        options: localOptions,
        selected: ['Reading', 'Swimming'],
        filteredOptions: filtered
      },
      { type: 'DESELECT_ALL_OPTIONS' }
    )

    expect(state.selected).to.be.empty
  })

  it('should add filtered options to selected options when selecting all if filtered options are present', () => {
    const localOptions = normalizeOptions(['Reading', 'Swimming', 'Running'])
    const filtered = normalizeOptions(['Running'])
    const state = selectAdvancedReducer(
      {
        ...getSelectAdvancedInitialState(true, options, selectWord),
        options: localOptions,
        selected: ['Reading', 'Swimming'],
        filteredOptions: filtered
      },
      { type: 'SELECT_ALL_OPTIONS' }
    )

    expect(state.selected).to.have.members(['Reading', 'Swimming', 'Running'])
    expect(state.selected).to.have.length(3)
  })

  it('should filter options', () => {
    const localOptions = normalizeOptions(['Reading', 'Swimming', 'Running'])
    const state = selectAdvancedReducer(
      {
        ...getSelectAdvancedInitialState(true, options, selectWord),
        options: localOptions
      },
      { type: 'SEARCH', payload: 'read' }
    )

    // filteredOptions es Option[], chequeamos por value
    const filteredValues = state.filteredOptions.map((o) => o.value)
    expect(filteredValues).to.include('Reading')
    expect(filteredValues).to.not.include('Swimming')
    expect(filteredValues).to.not.include('Running')
  })

  it('should reset search value when empty string is passed', () => {
    const state = selectAdvancedReducer(
      { ...getSelectAdvancedInitialState(true, options, selectWord), searchValue: 'read' },
      { type: 'SEARCH', payload: '' }
    )

    expect(state.searchValue).to.equal('')
    // Además, por implementación actual, filteredOptions vuelve a []
    expect(state.filteredOptions).to.deep.equal([])
  })

  it('should update options', () => {
    const initial = normalizeOptions(['Reading'])
    const updated = normalizeOptions(['Reading', 'Swimming'])
    const state = selectAdvancedReducer(
      { ...getSelectAdvancedInitialState(true, options, selectWord), options: initial },
      { type: 'UPDATE_OPTIONS', payload: updated }
    )

    expect(state.options).to.deep.equal(updated)
  })
})
