export const selectMultipleInitialState: SelectMultipleState = {
  options: [],
  selectedOptions: [],
  filteredOptions: [],
  searchValue: '',
  isMenuOpen: false
}

interface SelectMultipleState {
  options: string[]
  selectedOptions: string[]
  filteredOptions: string[]
  searchValue: string
  isMenuOpen: boolean
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
      type: 'SEARCH'
      payload: string
    }
  | {
      type: 'TOGGLE_MENU'
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
        options: state.selectedOptions.filter((option) => option !== action.payload)
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
    case 'TOGGLE_MENU':
      return {
        ...state,
        isMenuOpen: !state.isMenuOpen
      }
    default:
      return state
  }
}
