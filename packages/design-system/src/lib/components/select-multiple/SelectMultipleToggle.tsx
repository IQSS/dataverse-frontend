import { Dropdown as DropdownBS } from 'react-bootstrap'
import { X as CloseIcon } from 'react-bootstrap-icons'
import { Button } from '../button/Button'
import styles from './SelectMultiple.module.scss'

interface SelectMultipleToggleProps {
  selectedOptions: string[]
  handleRemoveSelectedOption: (option: string) => void
  isInvalid?: boolean
}

const MIN_WIDTH = 300
const MAX_WIDTH = 500

export const SelectMultipleToggle = ({
  selectedOptions,
  handleRemoveSelectedOption,
  isInvalid
}: SelectMultipleToggleProps) => {
  console.log({ isInvalid })
  return (
    <DropdownBS.Toggle
      as="header"
      className={`${styles['select-multiple-toggle']} ${isInvalid ? styles['invalid'] : ''}`}
      tabIndex={0}>
      {selectedOptions.length > 0 ? (
        <div className={styles['selected-options-container']}>
          {selectedOptions.map((selectedOption) => (
            <div
              className={styles['selected-option-item']}
              onClick={(e) => e.stopPropagation()}
              key={`selected-option-${selectedOption}`}>
              <span className="me-2">{selectedOption}</span>
              <Button
                variant="primary"
                className="rounded-circle p-0"
                onClick={() => handleRemoveSelectedOption(selectedOption)}
                aria-label="Remove selected option">
                <div style={{ display: 'grid', placeContent: 'center' }}>
                  <CloseIcon size={14} />
                </div>
              </Button>
            </div>
          ))}
        </div>
      ) : (
        'Select'
      )}
    </DropdownBS.Toggle>
  )
}
