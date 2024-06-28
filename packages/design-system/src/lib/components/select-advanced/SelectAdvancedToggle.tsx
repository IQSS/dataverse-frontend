import { ForwardedRef, forwardRef } from 'react'
import { Dropdown as DropdownBS, Button as ButtonBS } from 'react-bootstrap'
import { X as CloseIcon } from 'react-bootstrap-icons'
import styles from './SelectAdvanced.module.scss'

type SelectAdvancedToggleProps = {
  isMultiple: boolean
  selected: string | string[]
  handleRemoveSelectedOption: (option: string) => void
  isInvalid?: boolean
  isDisabled?: boolean
  inputButtonId?: string
  menuId: string
  selectWord: string
}

export const SelectAdvancedToggle = forwardRef(
  (
    {
      isMultiple,
      selected,
      handleRemoveSelectedOption,
      isInvalid,
      isDisabled,
      inputButtonId,
      menuId,
      selectWord
    }: SelectAdvancedToggleProps,
    ref: ForwardedRef<HTMLInputElement | null>
  ) => {
    return (
      <div
        className={`${styles['select-advanced-toggle']} ${isDisabled ? styles['disabled'] : ''}`}>
        <DropdownBS.Toggle
          ref={ref}
          as="input"
          type="button"
          id={inputButtonId}
          disabled={isDisabled}
          aria-disabled={isDisabled}
          aria-invalid={isInvalid}
          aria-label="Toggle options menu"
          aria-controls={menuId}
          className={`${styles['select-advanced-toggle__input-button']} ${
            isInvalid ? styles['invalid'] : ''
          }`}
        />
        <div
          className={styles['select-advanced-toggle__inner-content']}
          data-testid="toggle-inner-content">
          {selected.length > 0 ? (
            <div
              className={styles['multiple-selected-options-container']}
              aria-label="List of selected options">
              {isMultiple ? (
                (selected as string[]).map((selectedValue) => (
                  <div
                    className={styles['multiple-selected-options-container__item']}
                    onClick={(e) => e.stopPropagation()}
                    key={`selected-option-${selectedValue}`}>
                    <span className="me-2">{selectedValue}</span>
                    <ButtonBS
                      variant="primary"
                      aria-label={`Remove ${selectedValue} option`}
                      onClick={() => handleRemoveSelectedOption(selectedValue)}>
                      <CloseIcon size={14} />
                    </ButtonBS>
                  </div>
                ))
              ) : (
                <p
                  className={styles['single-selected-option']}
                  key={`selected-option-${selected as string}`}>
                  {selected}
                </p>
              )}
            </div>
          ) : (
            selectWord
          )}
        </div>
      </div>
    )
  }
)

SelectAdvancedToggle.displayName = 'SelectAdvancedToggle'
