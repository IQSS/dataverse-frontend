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
      type: 'TOGGLE_ALL_OPTIONS'
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
    case 'TOGGLE_ALL_OPTIONS':
      return {
        ...state,
        selectedOptions: state.selectedOptions.length === state.options.length ? [] : state.options
      }
    case 'SEARCH':
      return {
        ...state,
        filteredOptions: action.payload
          ? state.options.filter((option) =>
              option.toLowerCase().includes(action.payload.toLowerCase())
            )
          : state.options,
        searchValue: action.payload
      }
    default:
      return state
  }
}
