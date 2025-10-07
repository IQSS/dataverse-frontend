import { ForwardedRef, forwardRef, useMemo } from 'react'
import { Dropdown as DropdownBS, Button as ButtonBS } from 'react-bootstrap'
import { X as CloseIcon } from 'react-bootstrap-icons'
import { Option } from './SelectAdvanced'
import styles from './SelectAdvanced.module.scss'

type SelectAdvancedToggleProps = {
  isMultiple: boolean
  selected: string | string[]
  options?: Option[]
  handleRemoveSelectedOption: (value: string) => void
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
      options = [],
      handleRemoveSelectedOption,
      isInvalid,
      isDisabled,
      inputButtonId,
      menuId,
      selectWord
    }: SelectAdvancedToggleProps,
    ref: ForwardedRef<HTMLInputElement | null>
  ) => {
    const map = useMemo(() => new Map(options.map((o) => [o.value, o.label])), [options])
    const selectedArray = Array.isArray(selected) ? selected : selected ? [selected] : []

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
          {selectedArray.length > 0 ? (
            <div
              className={styles['multiple-selected-options-container']}
              aria-label="List of selected options"
              role="region">
              {isMultiple ? (
                selectedArray.map((val) => {
                  const label = map.get(val) ?? val
                  return (
                    <div
                      className={styles['multiple-selected-options-container__item']}
                      onClick={(e) => e.stopPropagation()}
                      key={`selected-option-${val}`}>
                      <span className="me-2">{label}</span>
                      <ButtonBS
                        variant="primary"
                        aria-label={`Remove ${label} option`}
                        onClick={() => handleRemoveSelectedOption(val)}>
                        <CloseIcon size={14} />
                      </ButtonBS>
                    </div>
                  )
                })
              ) : (
                <p
                  className={styles['single-selected-option']}
                  key={`selected-option-${selected as string}`}>
                  {map.get(selected as string) ?? (selected as string)}
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
