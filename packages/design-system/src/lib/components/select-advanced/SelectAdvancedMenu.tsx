import { useId } from 'react'
import { Dropdown as DropdownBS, Form as FormBS } from 'react-bootstrap'
import { Option } from './SelectAdvanced'
import styles from './SelectAdvanced.module.scss'

interface SelectAdvancedMenuProps {
  isMultiple: boolean
  options: Option[]
  selected: string | string[]
  filteredOptions: Option[]
  searchValue: string
  handleToggleAllOptions: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleCheck: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleClickOption: (value: string) => void
  isSearchable: boolean
  menuId: string
  selectWord: string
}

export const SelectAdvancedMenu = (props: SelectAdvancedMenuProps) => {
  const {
    isMultiple,
    options,
    selected,
    filteredOptions,
    searchValue,
    handleToggleAllOptions,
    handleSearch,
    handleCheck,
    handleClickOption,
    isSearchable,
    menuId,
    selectWord
  } = props

  const searchInputControlID = useId()
  const toggleAllControlID = useId()
  const optionLabelId = useId()

  const menuOptions = filteredOptions.length > 0 ? filteredOptions : options
  const noOptionsFound = searchValue !== '' && filteredOptions.length === 0

  const selectedArray = Array.isArray(selected) ? selected : [selected]
  const allOptionsShownAreSelected = !noOptionsFound
    ? menuOptions.length > 0 && menuOptions.every((o) => selectedArray.includes(o.value))
    : false

  return (
    <DropdownBS.Menu
      as="menu"
      id={menuId}
      className={styles['select-advanced-menu']}
      popperConfig={{ modifiers: [{ name: 'offset', options: { offset: () => [0, 0] } }] }}>
      {(isMultiple || isSearchable) && (
        <DropdownBS.Header className={styles['menu-header']} aria-level={1}>
          {isMultiple && (
            <FormBS.Check
              type="checkbox"
              aria-label="Toggle all options"
              id={toggleAllControlID}
              onChange={handleToggleAllOptions}
              checked={allOptionsShownAreSelected}
              disabled={noOptionsFound}
            />
          )}

          {isSearchable && (
            <FormBS.Control
              id={searchInputControlID}
              type="text"
              placeholder="Search..."
              aria-label="Search for an option"
              size="sm"
              onChange={handleSearch}
              data-testid="select-advanced-searchable-input"
            />
          )}

          {isMultiple && !isSearchable && (
            <p className={styles['selected-count']} data-testid="select-advanced-selected-count">
              {selectedArray.filter(Boolean).length} selected
            </p>
          )}
        </DropdownBS.Header>
      )}

      {!isMultiple && searchValue === '' && (
        <DropdownBS.Item
          as="li"
          role="option"
          data-value=""
          id={`${optionLabelId}-placeholder`}
          className={styles['option-item-not-multiple']}
          onClick={() => handleClickOption('')}
          active={selected === ''}
          key="__placeholder__">
          {selectWord}
        </DropdownBS.Item>
      )}

      {!noOptionsFound &&
        menuOptions.map((opt) => {
          if (!isMultiple) {
            return (
              <DropdownBS.Item
                as="li"
                role="option"
                data-value={opt.value}
                id={`${optionLabelId}-${opt.value}`}
                className={styles['option-item-not-multiple']}
                onClick={() => handleClickOption(opt.value)}
                active={selected === opt.value}
                key={opt.value}>
                {opt.label}
              </DropdownBS.Item>
            )
          }

          return (
            <DropdownBS.Item
              as="li"
              className={styles['option-item']}
              role="option"
              data-value={opt.value}
              key={opt.value}>
              <FormBS.Check
                type="checkbox"
                value={opt.value}
                label={opt.label}
                onChange={handleCheck}
                id={`${optionLabelId}-${opt.value}`}
                checked={selectedArray.includes(opt.value)}
                className={styles['option-item__checkbox-input']}
              />
            </DropdownBS.Item>
          )
        })}

      {noOptionsFound && (
        <DropdownBS.Item as="li" disabled>
          No options found
        </DropdownBS.Item>
      )}
    </DropdownBS.Menu>
  )
}
