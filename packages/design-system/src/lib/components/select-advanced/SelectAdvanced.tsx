import { ForwardedRef, forwardRef, useEffect, useId, useReducer } from 'react'
import { Dropdown as DropdownBS } from 'react-bootstrap'
import {
  selectAdvancedReducer,
  selectOption,
  removeOption,
  selectAllOptions,
  deselectAllOptions,
  searchOptions,
  getSelectAdvancedInitialState
} from './selectAdvancedReducer'
import { SelectAdvancedToggle } from './SelectAdvancedToggle'
import { SelectAdvancedMenu } from './SelectAdvancedMenu'
import { debounce } from './utils'
import { useIsFirstRender } from './useIsFirstRender'

export const DEFAULT_LOCALES = {
  select: 'Select...'
}

export const SELECT_MENU_SEARCH_DEBOUNCE_TIME = 400

export type SelectAdvancedProps =
  | {
      isMultiple?: false
      initialOptions: string[]
      onChange?: (selected: string) => void
      defaultValue?: string
      isSearchable?: boolean
      isDisabled?: boolean
      isInvalid?: boolean
      inputButtonId?: string
      locales?: {
        select?: string
      }
    }
  | {
      isMultiple: true
      initialOptions: string[]
      onChange?: (selected: string[]) => void
      defaultValue?: string[]
      isSearchable?: boolean
      isDisabled?: boolean
      isInvalid?: boolean
      inputButtonId?: string
      locales?: {
        select?: string
      }
    }

export const SelectAdvanced = forwardRef(
  (
    {
      initialOptions,
      onChange,
      defaultValue,
      isMultiple,
      isSearchable = true,
      isDisabled = false,
      isInvalid = false,
      inputButtonId,
      locales
    }: SelectAdvancedProps,
    ref: ForwardedRef<HTMLInputElement | null>
  ) => {
    const dynamicInitialOptions = isMultiple
      ? initialOptions
      : [locales?.select ?? DEFAULT_LOCALES.select, ...initialOptions]

    const [{ selected, filteredOptions, searchValue, options }, dispatch] = useReducer(
      selectAdvancedReducer,
      getSelectAdvancedInitialState(Boolean(isMultiple), dynamicInitialOptions, defaultValue)
    )

    const isFirstRender = useIsFirstRender()
    const menuId = useId()

    useEffect(() => {
      if (!isFirstRender && onChange) {
        isMultiple ? onChange(selected as string[]) : onChange(selected as string)
      }
    }, [isMultiple, selected, isFirstRender, onChange])

    const handleSearch = debounce((e: React.ChangeEvent<HTMLInputElement>): void => {
      const { value } = e.target
      console.log({ value })
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

    const handleClickOption = (option: string): void => {
      if ((selected as string) === option) {
        return
      }
      dispatch(selectOption(option))
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
        <SelectAdvancedToggle
          isMultiple={Boolean(isMultiple)}
          selected={selected}
          handleRemoveSelectedOption={handleRemoveSelectedOption}
          isInvalid={isInvalid}
          isDisabled={isDisabled}
          inputButtonId={inputButtonId}
          menuId={menuId}
          selectWord={locales?.select ?? DEFAULT_LOCALES.select}
          ref={ref}
        />
        <SelectAdvancedMenu
          isMultiple={Boolean(isMultiple)}
          options={options}
          selected={selected}
          filteredOptions={filteredOptions}
          searchValue={searchValue}
          handleToggleAllOptions={handleToggleAllOptions}
          handleSearch={handleSearch}
          handleCheck={handleCheck}
          handleClickOption={handleClickOption}
          isSearchable={isSearchable}
          menuId={menuId}
          selectWord={locales?.select ?? DEFAULT_LOCALES.select}
        />
      </DropdownBS>
    )
  }
)

SelectAdvanced.displayName = 'SelectAdvanced'
