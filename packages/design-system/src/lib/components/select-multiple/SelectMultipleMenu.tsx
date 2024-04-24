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
const MIN_WIDTH = 300
const MAX_WIDTH = 500

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
    <DropdownBS.Menu as="ul" className={styles['select-multiple-menu']}>
      {/* SEARCH INPUT */}
      <DropdownBS.Header className={styles['select-multiple-menu__header']}>
        {/* Toggle All Options */}
        <FormBS.Check
          type="checkbox"
          aria-label="Toggle all options"
          id={toggleAllControlID}
          onChange={handleToggleAllOptions}
          defaultChecked={allOptionsSelected}
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
          <span>{selectedOptions.length} selected</span>
        )}
      </DropdownBS.Header>

      {/* List of options */}
      {filteredOptions.map((option) => (
        <DropdownBS.Item
          as="li"
          className={styles['select-multiple-menu__option-item']}
          key={option}>
          <FormBS.Check
            type="checkbox"
            value={option}
            label={option}
            onChange={handleCheck}
            id={`check-item-${option}`}
            checked={selectedOptions.includes(option)}
            defaultChecked={selectedOptions.includes(option)}
            className={styles['checkbox']}
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
