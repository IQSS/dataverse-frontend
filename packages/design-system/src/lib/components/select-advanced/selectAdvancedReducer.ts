import { Option } from './SelectAdvanced'

export const getSelectAdvancedInitialState = (
  isMultiple: boolean,
  initialOptions: Option[],
  selectWord: string,
  defaultValue?: string | string[]
): SelectAdvancedState => ({
  options: initialOptions,
  selected: isMultiple
    ? (defaultValue as string[] | undefined) ?? []
    : (defaultValue as string | undefined) ?? '',
  filteredOptions: [],
  searchValue: '',
  isMultiple,
  selectWord
})

export interface SelectAdvancedState {
  isMultiple: boolean
  selected: string | string[]
  options: Option[]
  filteredOptions: Option[]
  searchValue: string
  selectWord: string
}

type SelectAdvancedActions =
  | { type: 'SELECT_OPTION'; payload: string }
  | { type: 'REMOVE_OPTION'; payload: string }
  | { type: 'SELECT_ALL_OPTIONS' }
  | { type: 'DESELECT_ALL_OPTIONS' }
  | { type: 'SEARCH'; payload: string }
  | { type: 'UPDATE_OPTIONS'; payload: Option[] }

export const selectAdvancedReducer = (
  state: SelectAdvancedState,
  action: SelectAdvancedActions
): SelectAdvancedState => {
  switch (action.type) {
    case 'SELECT_OPTION':
      if (state.isMultiple) {
        return {
          ...state,
          selected: Array.from(new Set([...(state.selected as string[]), action.payload]))
        }
      }
      return { ...state, selected: action.payload }

    case 'REMOVE_OPTION':
      return {
        ...state,
        selected: (state.selected as string[]).filter((v) => v !== action.payload)
      }

    case 'SELECT_ALL_OPTIONS': {
      const source = state.filteredOptions.length > 0 ? state.filteredOptions : state.options
      const allValues = source.map((o) => o.value)
      return {
        ...state,
        selected: state.isMultiple
          ? Array.from(new Set([...(state.selected as string[]), ...allValues]))
          : (state.selected as string)
      }
    }

    case 'DESELECT_ALL_OPTIONS': {
      if (state.filteredOptions.length > 0) {
        const toRemove = new Set(state.filteredOptions.map((o) => o.value))
        return {
          ...state,
          selected: (state.selected as string[]).filter((v) => !toRemove.has(v))
        }
      }
      return { ...state, selected: [] }
    }

    case 'SEARCH':
      return {
        ...state,
        filteredOptions: filterOptions(state, action.payload),
        searchValue: action.payload
      }

    case 'UPDATE_OPTIONS':
      return { ...state, options: action.payload }

    default:
      return state
  }
}

const filterOptions = (state: SelectAdvancedState, query: string): Option[] => {
  if (query.trim() === '') return []
  const q = query.toLowerCase()
  return state.options.filter(
    (o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q)
  )
}

// Action creators
export const selectOption = (value: string): SelectAdvancedActions => ({
  type: 'SELECT_OPTION',
  payload: value
})
export const removeOption = (value: string): SelectAdvancedActions => ({
  type: 'REMOVE_OPTION',
  payload: value
})
export const selectAllOptions = (): SelectAdvancedActions => ({ type: 'SELECT_ALL_OPTIONS' })
export const deselectAllOptions = (): SelectAdvancedActions => ({ type: 'DESELECT_ALL_OPTIONS' })
export const searchOptions = (value: string): SelectAdvancedActions => ({
  type: 'SEARCH',
  payload: value
})
export const updateOptions = (options: Option[]): SelectAdvancedActions => ({
  type: 'UPDATE_OPTIONS',
  payload: options
})
