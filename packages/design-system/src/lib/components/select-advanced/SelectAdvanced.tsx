import { useState, useEffect, useMemo, useId, useReducer, forwardRef, ForwardedRef } from 'react'
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
    const [lastOnChangeValue, setLastOnChangeValue] = useState<string | string[]>(
      isMultiple ? [] : ''
    )

    useEffect(() => {
      if (!isFirstRender && onChange) {
        // Dont call onChange if the selected options (string[]) remain the same
        if (isMultiple) {
          const selectedOptionsRemainTheSame = areArraysEqual(
            selected as string[],
            defaultValue && (lastOnChangeValue as string[])?.length === 0
              ? defaultValue
              : (lastOnChangeValue as string[])
          )

          if (selectedOptionsRemainTheSame) return
        }
        // Dont call onChange if the selected option (string) remain the same
        if (!isMultiple) {
          const compareAgainst =
            defaultValue && (lastOnChangeValue as string) === ''
              ? defaultValue
              : (lastOnChangeValue as string)
          const selectedOptionRemainTheSame = selected === compareAgainst

          if (selectedOptionRemainTheSame) return
        }

        isMultiple ? onChange(selected as string[]) : onChange(selected as string)
        setLastOnChangeValue(selected)
      }
    }, [isMultiple, selected, isFirstRender, onChange, lastOnChangeValue, defaultValue])

    useEffect(() => {
      const optionsRemainTheSame = propsOption.every((option) => options.includes(option))

      if (optionsRemainTheSame) return

      dispatch(updateOptions(dynamicInitialOptions))
    }, [dynamicInitialOptions, propsOption, options, isFirstRender, dispatch])

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
