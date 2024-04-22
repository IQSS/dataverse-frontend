import { useReducer } from 'react'
import { selectMultipleInitialState, selectMultipleReducer } from './selectMultipleReducer'
import { debounce } from './utils'

interface SelectMultipleProps {
  options: string[]
  defaultValue?: string[]
  isSearchable?: boolean
  isClearable?: boolean
  isDisabled?: boolean
  isInvalid?: boolean
  closeOnSelection?: boolean
}

/*
  TODO: Create Input Container with open on click on it or button arrow.
  TODO: Create Options List Container, that listens to the isMenuOpen state.
  TODO: Add search inside Options List Container.
  TODO: Addd List of Options inside Options List Container.
  TODO: Render every selected option inside the Input Container.
  TODO: Add button to remove selected option.
  TODO: Remove selected option from the list of options.
  TODO: Add close on selection.
*/

export const SelectMultiple = ({
  options,
  defaultValue,
  isSearchable = true,
  isClearable = true,
  isDisabled = false,
  isInvalid = false,
  closeOnSelection = true
}: SelectMultipleProps) => {
  const [{ selectedOptions, filteredOptions, searchValue, isMenuOpen }, dispatch] = useReducer(
    selectMultipleReducer,
    {
      ...selectMultipleInitialState,
      options: options,
      filteredOptions: options,
      selectedOptions: defaultValue || []
    }
  )

  const handleSearch = debounce((e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target
    dispatch({ type: 'SEARCH', payload: value })
  }, 400)

  return (
    <div>
      {/* Input container */}
      <div className="input-container">
        {/* Input search */}
        <input
          type="text"
          placeholder="Search..."
          className="input-search"
          onChange={handleSearch}
        />
      </div>

      {/* Options list */}
      <ul className="options-list">
        {options.map((option) => (
          <li key={option} onClick={() => dispatch({ type: 'SELECT_OPTION', payload: option })}>
            {option}
          </li>
        ))}
      </ul>
    </div>
  )
}
