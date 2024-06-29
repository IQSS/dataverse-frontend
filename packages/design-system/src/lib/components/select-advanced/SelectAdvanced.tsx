import { useEffect, useMemo, useId, useReducer, forwardRef, ForwardedRef, useCallback } from 'react'
import { Dropdown as DropdownBS } from 'react-bootstrap'
import {
  selectAdvancedReducer,
  selectOption,
  removeOption,
  selectAllOptions,
  deselectAllOptions,
  searchOptions,
  getSelectAdvancedInitialState,
  updateOptions
} from './selectAdvancedReducer'
import { SelectAdvancedToggle } from './SelectAdvancedToggle'
import { SelectAdvancedMenu } from './SelectAdvancedMenu'
import { areArraysEqual, debounce } from './utils'
import { useIsFirstRender } from './useIsFirstRender'

export const DEFAULT_LOCALES = {
  select: 'Select...'
}

export const SELECT_MENU_SEARCH_DEBOUNCE_TIME = 400

export type SelectAdvancedProps =
  | {
      isMultiple?: false
      options: string[]
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
      options: string[]
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
      options: propsOption,
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
    const dynamicInitialOptions = useMemo(() => {
      return isMultiple ? propsOption : [locales?.select ?? DEFAULT_LOCALES.select, ...propsOption]
    }, [isMultiple, propsOption, locales])

    const [{ selected, filteredOptions, searchValue, options }, dispatch] = useReducer(
      selectAdvancedReducer,
      getSelectAdvancedInitialState(
        Boolean(isMultiple),
        dynamicInitialOptions,
        locales?.select ?? DEFAULT_LOCALES.select,
        defaultValue
      )
    )

    const isFirstRender = useIsFirstRender()
    const menuId = useId()

    const callOnChage = useCallback(
      (newSelected: string | string[]): void => {
        if (!onChange) return
        //@ts-expect-error - types differs
        onChange(newSelected)
      },
      [onChange]
    )

    useEffect(() => {
      const optionsRemainTheSame = areArraysEqual(dynamicInitialOptions, options)

      // If the options remain the same, do nothing
      if (optionsRemainTheSame) return

      const selectedOptionsThatAreNotInNewOptions = isMultiple
        ? (selected as string[]).filter((option) => !dynamicInitialOptions.includes(option))
        : []

      // If there are selected options that are not in the new options, remove them
      if (isMultiple && selectedOptionsThatAreNotInNewOptions.length > 0) {
        selectedOptionsThatAreNotInNewOptions.forEach((option) => dispatch(removeOption(option)))

        const newSelected = (selected as string[]).filter((option) =>
          dynamicInitialOptions.includes(option)
        )

        callOnChage(newSelected)
      }

      // If the selected option is not in the new options replace it with the default empty value
      if (
        !isMultiple &&
        selected !== '' &&
        !dynamicInitialOptions.some((option) => option === (selected as string))
      ) {
        dispatch(selectOption(''))
        callOnChage('')
      }
      dispatch(updateOptions(dynamicInitialOptions))
    }, [dynamicInitialOptions, options, selected, isFirstRender, dispatch, callOnChage, isMultiple])

    const handleSearch = debounce((e: React.ChangeEvent<HTMLInputElement>): void => {
      const { value } = e.target
      dispatch(searchOptions(value))
    }, SELECT_MENU_SEARCH_DEBOUNCE_TIME)

    // ONLY FOR MULTIPLE SELECT 👇
    const handleCheck = (e: React.ChangeEvent<HTMLInputElement>): void => {
      const { value, checked } = e.target

      if (checked) {
        const newSelected = [...(selected as string[]), value]
        callOnChage(newSelected)

        dispatch(selectOption(value))
      } else {
        const newSelected = (selected as string[]).filter((option) => option !== value)
        callOnChage(newSelected)

        dispatch(removeOption(value))
      }
    }

    // ONLY FOR SINGLE SELECT 👇
    const handleClickOption = (option: string): void => {
      if ((selected as string) === option) {
        return
      }
      callOnChage(option)

      dispatch(selectOption(option))
    }

    // ONLY FOR MULTIPLE SELECT 👇
    const handleRemoveSelectedOption = (option: string): void => {
      const newSelected = (selected as string[]).filter((selected) => selected !== option)
      callOnChage(newSelected)

      dispatch(removeOption(option))
    }

    // ONLY FOR MULTIPLE SELECT 👇
    const handleToggleAllOptions = (e: React.ChangeEvent<HTMLInputElement>): void => {
      if (e.target.checked) {
        const newSelected =
          filteredOptions.length > 0
            ? Array.from(new Set([...(selected as string[]), ...filteredOptions]))
            : options

        callOnChage(newSelected)

        dispatch(selectAllOptions())
      } else {
        const newSelected =
          filteredOptions.length > 0
            ? (selected as string[]).filter((option) => !filteredOptions.includes(option))
            : []

        callOnChage(newSelected)

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
