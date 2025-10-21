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
import { areOptionArraysEqual, debounce, normalizeOptions } from './utils'
import { useIsFirstRender } from './useIsFirstRender'

export const DEFAULT_LOCALES = { select: 'Select...' }
export const SELECT_MENU_SEARCH_DEBOUNCE_TIME = 400

export type Option = { value: string; label: string }

export type InputOptions = string[] | Option[]

type BaseProps = {
  options: InputOptions
  isSearchable?: boolean
  isDisabled?: boolean
  isInvalid?: boolean
  inputButtonId?: string
  locales?: { select?: string }
}

type SingleProps = BaseProps & {
  isMultiple?: false
  onChange?: (selected: string) => void
  defaultValue?: string
}

type MultipleProps = BaseProps & {
  isMultiple: true
  onChange?: (selected: string[]) => void
  defaultValue?: string[]
}

export type SelectAdvancedProps = SingleProps | MultipleProps

export const SelectAdvanced = forwardRef(
  (
    {
      options: propsOptions,
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
    const normalizedOptions: Option[] = useMemo(
      () => normalizeOptions(propsOptions),
      [propsOptions]
    )

    const [{ selected, filteredOptions, searchValue, options }, dispatch] = useReducer(
      selectAdvancedReducer,
      getSelectAdvancedInitialState(
        Boolean(isMultiple),
        normalizedOptions,
        locales?.select ?? DEFAULT_LOCALES.select,
        defaultValue
      )
    )

    const isFirstRender = useIsFirstRender()
    const menuId = useId()

    const callOnChange = useCallback(
      (newSelected: string | string[]): void => {
        if (!onChange) return
        // @ts-expect-error - union narrowing en runtime
        onChange(newSelected)
      },
      [onChange]
    )

    useEffect(() => {
      const optionsRemainTheSame = areOptionArraysEqual(normalizedOptions, options)
      if (optionsRemainTheSame) return

      const optionValues = new Set(normalizedOptions.map((o) => o.value))

      if (isMultiple) {
        const selectedValues = selected as string[]
        const outOfNewOptions = selectedValues.filter((v) => !optionValues.has(v))
        if (outOfNewOptions.length > 0) {
          const newSelected = selectedValues.filter((v) => optionValues.has(v))
          callOnChange(newSelected)
          outOfNewOptions.forEach((v) => dispatch(removeOption(v)))
        }
      } else {
        const current = selected as string
        if (current !== '' && !optionValues.has(current)) {
          dispatch(selectOption(''))
          callOnChange('')
        }
      }

      dispatch(updateOptions(normalizedOptions))
    }, [normalizedOptions, options, selected, isFirstRender, callOnChange, isMultiple])

    const handleSearch = debounce((e: React.ChangeEvent<HTMLInputElement>): void => {
      const { value } = e.target
      dispatch(searchOptions(value))
    }, SELECT_MENU_SEARCH_DEBOUNCE_TIME)

    // MULTIPLE
    const handleCheck = (e: React.ChangeEvent<HTMLInputElement>): void => {
      const { value, checked } = e.target
      if (checked) {
        const newSelected = [...(selected as string[]), value]
        callOnChange(newSelected)
        dispatch(selectOption(value))
      } else {
        const newSelected = (selected as string[]).filter((v) => v !== value)
        callOnChange(newSelected)
        dispatch(removeOption(value))
      }
    }

    // SINGLE
    const handleClickOption = (value: string): void => {
      if ((selected as string) === value) return
      callOnChange(value)
      dispatch(selectOption(value))
    }

    // MULTIPLE
    const handleRemoveSelectedOption = (value: string): void => {
      const newSelected = (selected as string[]).filter((v) => v !== value)
      callOnChange(newSelected)
      dispatch(removeOption(value))
    }

    // MULTIPLE
    const handleToggleAllOptions = (e: React.ChangeEvent<HTMLInputElement>): void => {
      if (e.target.checked) {
        const source = filteredOptions.length > 0 ? filteredOptions : options
        const newSelected = Array.from(
          new Set([...(selected as string[]), ...source.map((o) => o.value)])
        )
        callOnChange(newSelected)
        dispatch(selectAllOptions())
      } else {
        const toRemove = new Set(
          (filteredOptions.length > 0 ? filteredOptions : options).map((o) => o.value)
        )
        const newSelected =
          filteredOptions.length > 0 ? (selected as string[]).filter((v) => !toRemove.has(v)) : []
        callOnChange(newSelected)
        dispatch(deselectAllOptions())
      }
    }

    return (
      <DropdownBS
        autoClose={isMultiple ? 'outside' : true}
        className={isInvalid ? 'is-invalid' : ''}>
        <SelectAdvancedToggle
          isMultiple={Boolean(isMultiple)}
          selected={selected}
          options={options}
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
