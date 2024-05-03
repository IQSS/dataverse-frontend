export const selectMultipleInitialState: SelectMultipleState = {
  options: [],
  selectedOptions: [],
  filteredOptions: [],
  searchValue: ''
}

interface SelectMultipleState {
  options: string[]
  selectedOptions: string[]
  filteredOptions: string[]
  searchValue: string
}

type SelectMultipleActions =
  | {
      type: 'SELECT_OPTION'
      payload: string
    }
  | {
      type: 'REMOVE_OPTION'
      payload: string
    }
  | {
      type: 'SELECT_ALL_OPTIONS'
    }
  | {
      type: 'DESELECT_ALL_OPTIONS'
    }
  | {
      type: 'SEARCH'
      payload: string
    }

export const selectMultipleReducer = (
  state: SelectMultipleState,
  action: SelectMultipleActions
) => {
  switch (action.type) {
    case 'SELECT_OPTION':
      return {
        ...state,
        selectedOptions: [...state.selectedOptions, action.payload]
      }
    case 'REMOVE_OPTION':
      return {
        ...state,
        selectedOptions: state.selectedOptions.filter((option) => option !== action.payload)
      }
    case 'SELECT_ALL_OPTIONS':
      return {
        ...state,
        selectedOptions:
          state.filteredOptions.length > 0
            ? Array.from(new Set([...state.selectedOptions, ...state.filteredOptions]))
            : state.options
      }
    case 'DESELECT_ALL_OPTIONS':
      return {
        ...state,
        selectedOptions:
          state.filteredOptions.length > 0
            ? state.selectedOptions.filter((option) => !state.filteredOptions.includes(option))
            : []
      }

    case 'SEARCH':
      return {
        ...state,
        filteredOptions:
          action.payload !== ''
            ? state.options.filter((option) =>
                option.toLowerCase().includes(action.payload.toLowerCase())
              )
            : [],
        searchValue: action.payload
      }
    default:
      return state
  }
}

export const selectOption = /* istanbul ignore next */ (option: string): SelectMultipleActions => ({
  type: 'SELECT_OPTION',
  payload: option
})

export const removeOption = /* istanbul ignore next */ (option: string): SelectMultipleActions => ({
  type: 'REMOVE_OPTION',
  payload: option
})

export const selectAllOptions = /* istanbul ignore next */ (): SelectMultipleActions => ({
  type: 'SELECT_ALL_OPTIONS'
})

export const deselectAllOptions = /* istanbul ignore next */ (): SelectMultipleActions => ({
  type: 'DESELECT_ALL_OPTIONS'
})

export const searchOptions = /* istanbul ignore next */ (value: string): SelectMultipleActions => ({
  type: 'SEARCH',
  payload: value
})
