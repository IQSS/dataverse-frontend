export const getSelectAdvancedInitialState = (
  isMultiple: boolean,
  initialOptions: string[],
  defaultValue?: string | string[]
): SelectAdvancedState => ({
  options: initialOptions,
  selected: isMultiple
    ? (defaultValue as string[] | undefined) ?? []
    : (defaultValue as string | undefined) ?? '',
  filteredOptions: [],
  searchValue: '',
  isMultiple
})

interface SelectAdvancedState {
  isMultiple: boolean
  selected: string | string[]
  options: string[]
  filteredOptions: string[]
  searchValue: string
}

type SelectAdvancedActions =
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

export const selectAdvancedReducer = (
  state: SelectAdvancedState,
  action: SelectAdvancedActions
) => {
  switch (action.type) {
    case 'SELECT_OPTION':
      if (state.isMultiple) {
        return {
          ...state,
          selected: Array.isArray(state.selected)
            ? [...state.selected, action.payload]
            : [action.payload]
        }
      } else {
        return {
          ...state,
          selected: action.payload
        }
      }
    case 'REMOVE_OPTION':
      if (state.isMultiple && Array.isArray(state.selected)) {
        return {
          ...state,
          selected: state.selected.filter((option) => option !== action.payload)
        }
      } else {
        return {
          ...state,
          selected: ''
        }
      }
    case 'SELECT_ALL_OPTIONS':
      if (state.isMultiple) {
        return {
          ...state,
          selected:
            state.filteredOptions.length > 0
              ? Array.from(new Set([...state.selected, ...state.filteredOptions]))
              : state.options
        }
      } else {
        return state
      }
    case 'DESELECT_ALL_OPTIONS':
      return {
        ...state,
        selected: state.isMultiple ? [] : ''
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
    // case 'TOGGLE_SELECTION_MODE':
    //   return {
    //     ...state,
    //     isMultiple: action.payload,
    //     selected: action.payload ? [] : ''
    //   }
    default:
      return state
  }
}

// export const selectAdvancedReducer = (
//   state: SelectAdvancedState,
//   action: SelectAdvancedActions
// ) => {
//   switch (action.type) {
//     case 'SELECT_OPTION':
//       return {
//         ...state,
//         selected: [...state.selected, action.payload]
//       }
//     case 'REMOVE_OPTION':
//       return {
//         ...state,
//         selected: state.selected.filter((option) => option !== action.payload)
//       }
//     case 'SELECT_ALL_OPTIONS':
//       return {
//         ...state,
//         selected:
//           state.filteredOptions.length > 0
//             ? Array.from(new Set([...state.selected, ...state.filteredOptions]))
//             : state.options
//       }
//     case 'DESELECT_ALL_OPTIONS':
//       return {
//         ...state,
//         selected:
//           state.filteredOptions.length > 0
//             ? state.selected.filter((option) => !state.filteredOptions.includes(option))
//             : []
//       }

//     case 'SEARCH':
//       return {
//         ...state,
//         filteredOptions:
//           action.payload !== ''
//             ? state.options.filter((option) =>
//                 option.toLowerCase().includes(action.payload.toLowerCase())
//               )
//             : [],
//         searchValue: action.payload
//       }
//     default:
//       return state
//   }
// }

export const selectOption = /* istanbul ignore next */ (option: string): SelectAdvancedActions => ({
  type: 'SELECT_OPTION',
  payload: option
})

export const removeOption = /* istanbul ignore next */ (option: string): SelectAdvancedActions => ({
  type: 'REMOVE_OPTION',
  payload: option
})

export const selectAllOptions = /* istanbul ignore next */ (): SelectAdvancedActions => ({
  type: 'SELECT_ALL_OPTIONS'
})

export const deselectAllOptions = /* istanbul ignore next */ (): SelectAdvancedActions => ({
  type: 'DESELECT_ALL_OPTIONS'
})

export const searchOptions = /* istanbul ignore next */ (value: string): SelectAdvancedActions => ({
  type: 'SEARCH',
  payload: value
})
