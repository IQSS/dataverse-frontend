import { ForwardedRef, forwardRef, useReducer } from 'react'
import { Dropdown as DropdownBS } from 'react-bootstrap'
import {
  selectMultipleInitialState,
  selectMultipleReducer,
  selectOption,
  removeOption,
  toggleAllOptions,
  searchOptions
} from './selectMultipleReducer'
import { SelectMultipleToggle } from './SelectMultipleToggle'
import { SelectMultipleMenu } from './SelectMultipleMenu'
import { debounce } from './utils'
// import styles from './SelectMultiple.module.scss'

export interface SelectMultipleProps {
  options: string[]
  defaultValue?: string[]
  isSearchable?: boolean
  isDisabled?: boolean
  isInvalid?: boolean
  ariaLabelledby?: string
}

/*
  TODO:ME: How to focus on header element when label is clicked? Aria is ok but focus is not happening.
  TODO:ME: Set max selected options to show, default to 6.
*/

export const SelectMultiple = forwardRef(
  (
    {
      options,
      defaultValue,
      isSearchable = true,
      isDisabled = false,
      isInvalid = false,
      ariaLabelledby
    }: SelectMultipleProps,
    ref: ForwardedRef<HTMLElement | null>
  ) => {
    const [{ selectedOptions, filteredOptions }, dispatch] = useReducer(selectMultipleReducer, {
      ...selectMultipleInitialState,
      options: options,
      filteredOptions: options,
      selectedOptions: defaultValue || []
    })

    const handleSearch = debounce((e: React.ChangeEvent<HTMLInputElement>): void => {
      const { value } = e.target
      dispatch(searchOptions(value))
    }, 400)

    const handleCheck = (e: React.ChangeEvent<HTMLInputElement>): void => {
      const { value, checked } = e.target

      if (checked) {
        dispatch(selectOption(value))
      } else {
        dispatch(removeOption(value))
      }
    }

    const handleRemoveSelectedOption = (option: string): void => dispatch(removeOption(option))

    const handleToggleAllOptions = (): void => dispatch(toggleAllOptions())

    return (
      <DropdownBS autoClose="outside">
        <SelectMultipleToggle
          selectedOptions={selectedOptions}
          handleRemoveSelectedOption={handleRemoveSelectedOption}
          isInvalid={isInvalid}
          isDisabled={isDisabled}
          ariaLabelledby={ariaLabelledby}
          ref={ref}
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
    )
  }
)

SelectMultiple.displayName = 'SelectMultiple'
