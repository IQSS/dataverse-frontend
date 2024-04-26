import { ForwardedRef, forwardRef, useId, useReducer } from 'react'
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

export interface SelectMultipleProps {
  options: string[]
  defaultValue?: string[]
  isSearchable?: boolean
  isDisabled?: boolean
  isInvalid?: boolean
  inputButtonId?: string
}

export const SelectMultiple = forwardRef(
  (
    {
      options,
      defaultValue,
      isSearchable = true,
      isDisabled = false,
      isInvalid = false,
      inputButtonId
    }: SelectMultipleProps,
    ref: ForwardedRef<HTMLInputElement | null>
  ) => {
    const menuId = useId()

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
          inputButtonId={inputButtonId}
          menuId={menuId}
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
          menuId={menuId}
        />
      </DropdownBS>
    )
  }
)

SelectMultiple.displayName = 'SelectMultiple'
