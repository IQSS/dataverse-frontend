import { useReducer } from 'react'
import { Dropdown as DropdownBS } from 'react-bootstrap'
import { selectMultipleInitialState, selectMultipleReducer } from './selectMultipleReducer'
import { SelectMultipleToggle } from './SelectMultipleToggle'
import { SelectMultipleMenu } from './SelectMultipleMenu'
import { debounce } from './utils'
// import styles from './SelectMultiple.module.scss'

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
  TODO: Set max selected options to show, default to 6.
*/

export const SelectMultiple = ({
  options,
  defaultValue,
  isSearchable = true,
  isClearable = true,
  isDisabled = false,
  isInvalid = false
}: SelectMultipleProps) => {
  const [{ selectedOptions, filteredOptions }, dispatch] = useReducer(selectMultipleReducer, {
    ...selectMultipleInitialState,
    options: options,
    filteredOptions: options,
    selectedOptions: defaultValue || []
  })

  const handleSearch = debounce((e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target
    dispatch({ type: 'SEARCH', payload: value })
  }, 400)

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value, checked } = e.target

    if (checked) {
      dispatch({ type: 'SELECT_OPTION', payload: value })
    } else {
      dispatch({ type: 'REMOVE_OPTION', payload: value })
    }
  }

  const handleRemoveSelectedOption = (option: string): void => {
    dispatch({ type: 'REMOVE_OPTION', payload: option })
  }

  const handleToggleAllOptions = (): void => {
    dispatch({ type: 'TOGGLE_ALL_OPTIONS' })
  }

  console.log({ selectedOptions })

  return (
    <div>
      <DropdownBS autoClose="outside">
        <SelectMultipleToggle
          selectedOptions={selectedOptions}
          handleRemoveSelectedOption={handleRemoveSelectedOption}
          isInvalid={isInvalid}
        />
        <SelectMultipleMenu
          options={options}
          selectedOptions={selectedOptions}
          filteredOptions={filteredOptions}
          handleToggleAllOptions={handleToggleAllOptions}
          handleSearch={handleSearch}
          handleCheck={handleCheck}
          isSearchable={isSearchable}
        />
      </DropdownBS>
    </div>
  )
}
