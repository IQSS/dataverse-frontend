import { useId } from 'react'
import { Dropdown as DropdownBS, Form as FormBS } from 'react-bootstrap'
import styles from './SelectMultiple.module.scss'

interface SelectMultipleMenuProps {
  options: string[]
  selectedOptions: string[]
  filteredOptions: string[]
  handleToggleAllOptions: () => void
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleCheck: (e: React.ChangeEvent<HTMLInputElement>) => void
  isSearchable: boolean
}

export const SelectMultipleMenu = ({
  options,
  selectedOptions,
  filteredOptions,
  handleToggleAllOptions,
  handleSearch,
  handleCheck,
  isSearchable
}: SelectMultipleMenuProps) => {
  const searchInputControlID = useId()
  const toggleAllControlID = useId()

  const noOptionsFound = filteredOptions.length === 0
  const allOptionsSelected = selectedOptions.length === options.length

  return (
    <DropdownBS.Menu
      as="menu"
      className={styles['select-multiple-menu']}
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
      {/* SEARCH INPUT */}
      <DropdownBS.Header className={styles['menu-header']} aria-level={1}>
        {/* Toggle All Options */}
        <FormBS.Check
          type="checkbox"
          aria-label="Toggle all options"
          id={toggleAllControlID}
          onChange={handleToggleAllOptions}
          checked={allOptionsSelected}
        />
        {/* Search input */}
        {isSearchable ? (
          <FormBS.Control
            id={searchInputControlID}
            type="text"
            placeholder="Search..."
            aria-label="Search"
            size="sm"
            onChange={handleSearch}
          />
        ) : (
          <p className={styles['selected-count']}>{selectedOptions.length} selected</p>
        )}
      </DropdownBS.Header>

      {/* List of options */}
      {filteredOptions.map((option) => (
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
      {/* No Option founded */}
      {noOptionsFound && (
        <DropdownBS.Item as="li" disabled>
          No options found
        </DropdownBS.Item>
      )}
    </DropdownBS.Menu>
  )
}