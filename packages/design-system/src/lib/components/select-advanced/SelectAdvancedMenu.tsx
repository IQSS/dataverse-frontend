import { useId } from 'react'
import { Dropdown as DropdownBS, Form as FormBS } from 'react-bootstrap'
import styles from './SelectAdvanced.module.scss'

interface SelectAdvancedMenuProps {
  options: string[]
  selectedOptions: string[]
  filteredOptions: string[]
  searchValue: string
  handleToggleAllOptions: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleCheck: (e: React.ChangeEvent<HTMLInputElement>) => void
  isSearchable: boolean
  menuId: string
}

export const SelectAdvancedMenu = ({
  options,
  selectedOptions,
  filteredOptions,
  searchValue,
  handleToggleAllOptions,
  handleSearch,
  handleCheck,
  isSearchable,
  menuId
}: SelectAdvancedMenuProps) => {
  const searchInputControlID = useId()
  const toggleAllControlID = useId()

  const menuOptions = filteredOptions.length > 0 ? filteredOptions : options

  const noOptionsFound = searchValue !== '' && filteredOptions.length === 0

  const allOptionsShownAreSelected = !noOptionsFound
    ? filteredOptions.length > 0
      ? filteredOptions.every((option) => selectedOptions.includes(option))
      : options.every((option) => selectedOptions.includes(option))
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
      <DropdownBS.Header className={styles['menu-header']} aria-level={1}>
        <FormBS.Check
          type="checkbox"
          aria-label="Toggle all options"
          id={toggleAllControlID}
          onChange={handleToggleAllOptions}
          checked={allOptionsShownAreSelected}
          disabled={noOptionsFound}
        />
        {isSearchable ? (
          <FormBS.Control
            id={searchInputControlID}
            type="text"
            placeholder="Search..."
            aria-label="Search for an option"
            size="sm"
            onChange={handleSearch}
          />
        ) : (
          <p className={styles['selected-count']}>{selectedOptions.length} selected</p>
        )}
      </DropdownBS.Header>

      {!noOptionsFound &&
        menuOptions.map((option) => (
          <DropdownBS.Item as="li" className={styles['option-item']} key={option}>
            <FormBS.Check
              type="checkbox"
              value={option}
              label={option}
              onChange={handleCheck}
              id={`check-item-${option}`}
              checked={selectedOptions.includes(option)}
              className={styles['option-item__checkbox-input']}
            />
          </DropdownBS.Item>
        ))}

      {noOptionsFound && (
        <DropdownBS.Item as="li" disabled>
          No options found
        </DropdownBS.Item>
      )}
    </DropdownBS.Menu>
  )
}
