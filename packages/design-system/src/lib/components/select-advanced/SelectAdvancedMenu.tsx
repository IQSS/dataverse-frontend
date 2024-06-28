import { useId } from 'react'
import { Dropdown as DropdownBS, Form as FormBS } from 'react-bootstrap'
import styles from './SelectAdvanced.module.scss'

interface SelectAdvancedMenuProps {
  isMultiple: boolean
  options: string[]
  selected: string | string[]
  filteredOptions: string[]
  searchValue: string
  handleToggleAllOptions: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleCheck: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleClickOption: (option: string) => void
  isSearchable: boolean
  menuId: string
  selectWord: string
}

export const SelectAdvancedMenu = ({
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
}: SelectAdvancedMenuProps) => {
  const searchInputControlID = useId()
  const toggleAllControlID = useId()
  const optionLabelId = useId()

  const menuOptions = filteredOptions.length > 0 ? filteredOptions : options

  const noOptionsFound = searchValue !== '' && filteredOptions.length === 0

  const allOptionsShownAreSelected = !noOptionsFound
    ? filteredOptions.length > 0
      ? filteredOptions.every((option) => selected.includes(option))
      : options.every((option) => selected.includes(option))
    : false

  return (
    <DropdownBS.Menu
      as="menu"
      id={menuId}
      className={styles['select-advanced-menu']}
      popperConfig={{
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: () => [0, 0]
            }
          }
        ]
      }}>
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
              {selected.length} selected
            </p>
          )}
        </DropdownBS.Header>
      )}

      {!noOptionsFound &&
        menuOptions.map((option) => {
          if (!isMultiple) {
            return (
              <DropdownBS.Item
                as="li"
                className={styles['option-item-not-multiple']}
                key={option}
                onClick={() => handleClickOption(option === selectWord ? '' : option)}
                active={option !== selectWord ? selected === option : selected === ''}
                id={`${optionLabelId}-${option}`}>
                {option}
              </DropdownBS.Item>
            )
          }

          return (
            <DropdownBS.Item as="li" className={styles['option-item']} key={option}>
              <FormBS.Check
                type="checkbox"
                value={option}
                label={option}
                onChange={handleCheck}
                id={`${optionLabelId}-${option}`}
                checked={selected.includes(option)}
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
