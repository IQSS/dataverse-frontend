import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import { Card, Col, Form } from '@iqss/dataverse-design-system'
import { DatasetType } from '@/dataset/domain/models/DatasetType'
import styles from './DatasetTypeSelect.module.scss'

interface DatasetTypeSelectProps {
  datasetTypes: DatasetType[]
  onChange: (selectedTypeId: string) => void
  selectedType: DatasetType
  disabled?: boolean
}

export const DatasetTypeSelect = ({
  datasetTypes,
  onChange,
  selectedType,
  disabled = false
}: DatasetTypeSelectProps) => {
  const { t } = useTranslation('createDataset')
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleSelectType = (typeId: number) => {
    onChange(typeId.toString())
    setIsOpen(false)
  }

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev)
    }
  }

  const handleKeyDown = (event: KeyboardEvent, typeId: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleSelectType(typeId)
    } else if (event.key === 'Escape') {
      setIsOpen(false)
    }
  }

  // Close menu when clicking outside, focusing outside, or pressing Escape
  useEffect(() => {
    const handleClose = (event: MouseEvent | FocusEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    const handleDocKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('mousedown', handleClose)
    document.addEventListener('focusin', handleClose)
    document.addEventListener('keydown', handleDocKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClose)
      document.removeEventListener('focusin', handleClose)
      document.removeEventListener('keydown', handleDocKeyDown)
    }
  }, [])

  return (
    <Form.Group data-testid="dataset-type-select">
      <Form.Group.Label message={t('datasetType.description')} column sm={3} htmlFor="dataset-type">
        {t('datasetType.label')}
      </Form.Group.Label>
      <Col sm={9}>
        <Form.Group.Text>{t('datasetType.helpText')}</Form.Group.Text>

        <div className={styles['dataset-type-select']} ref={dropdownRef}>
          <div className={styles.toggle}>
            <input
              type="button"
              disabled={disabled}
              onClick={handleToggle}
              aria-label={t('datasetType.toggleMenu')}
              id="dataset-type"
            />
            <span data-testid="selected-type">{selectedType.displayName}</span>
          </div>

          <div className={cn(styles.menu, { [styles.open]: isOpen && !disabled })} role="menu">
            {datasetTypes.map((dt) => (
              <Card
                className={cn(styles['type-option'], {
                  [styles.selected]: dt.id === selectedType.id
                })}
                onClick={() => !disabled && handleSelectType(dt.id)}
                onKeyDown={(e) => !disabled && handleKeyDown(e as unknown as KeyboardEvent, dt.id)}
                tabIndex={disabled ? -1 : 0}
                role="menuitem"
                key={dt.id}>
                <Card.Body className="p-2">
                  <span>
                    <strong>{dt.displayName}</strong>
                    <br />
                    <span className="small text-muted">{dt.description}</span>
                  </span>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </Col>
    </Form.Group>
  )
}
