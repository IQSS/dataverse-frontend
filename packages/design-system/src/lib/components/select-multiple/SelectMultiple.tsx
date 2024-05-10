import { ForwardedRef, forwardRef, useEffect, useId, useReducer } from 'react'
import { Dropdown as DropdownBS } from 'react-bootstrap'
import {
  selectMultipleInitialState,
  selectMultipleReducer,
  selectOption,
  removeOption,
  selectAllOptions,
  deselectAllOptions,
  searchOptions
} from './selectMultipleReducer'
import { SelectMultipleToggle } from './SelectMultipleToggle'
import { SelectMultipleMenu } from './SelectMultipleMenu'
import { debounce } from './utils'
import { useIsFirstRender } from './useIsFirstRender'

export const SELECT_MENU_SEARCH_DEBOUNCE_TIME = 400

export interface SelectMultipleProps {
  options: string[]
  onChange?: (selectedOptions: string[]) => void
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
      onChange,
      defaultValue,
      isSearchable = true,
      isDisabled = false,
      isInvalid = false,
      inputButtonId
    }: SelectMultipleProps,
    ref: ForwardedRef<HTMLInputElement | null>
  ) => {
    const [{ selectedOptions, filteredOptions, searchValue }, dispatch] = useReducer(
      selectMultipleReducer,
      {
        ...selectMultipleInitialState,
        options: options,
        selectedOptions: defaultValue || []
      }
    )
    const isFirstRender = useIsFirstRender()
    const menuId = useId()

    useEffect(() => {
      if (!isFirstRender && onChange) {
        onChange(selectedOptions)
      }
    }, [selectedOptions])

    const handleSearch = debounce((e: React.ChangeEvent<HTMLInputElement>): void => {
      const { value } = e.target
      dispatch(searchOptions(value))
    }, SELECT_MENU_SEARCH_DEBOUNCE_TIME)

    const handleCheck = (e: React.ChangeEvent<HTMLInputElement>): void => {
      const { value, checked } = e.target

      if (checked) {
        dispatch(selectOption(value))
      } else {
        dispatch(removeOption(value))
      }
    }

    const handleRemoveSelectedOption = (option: string): void => dispatch(removeOption(option))

    const handleToggleAllOptions = (e: React.ChangeEvent<HTMLInputElement>): void => {
      if (e.target.checked) {
        dispatch(selectAllOptions())
      } else {
        dispatch(deselectAllOptions())
      }
    }

    return (
      <DropdownBS autoClose="outside" className={isInvalid ? 'is-invalid' : ''}>
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
          searchValue={searchValue}
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
