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
}

export const DatasetTypeSelect = ({
  datasetTypes,
  onChange,
  selectedType
}: DatasetTypeSelectProps) => {
  const { t } = useTranslation('createDataset')
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleSelectType = (typeId: number) => {
    onChange(typeId.toString())
    setIsOpen(false)
  }

  // Close menu when clicking outside, focusing outside, or pressing Escape
  useEffect(() => {
    const handleClose = (event: MouseEvent | FocusEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('mousedown', handleClose)
    document.addEventListener('focusin', handleClose)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClose)
      document.removeEventListener('focusin', handleClose)
      document.removeEventListener('keydown', handleKeyDown)
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
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label={t('datasetType.toggleMenu')}
            />
            <span className="text-capitalize" data-testid="selected-type">
              {selectedType.name}
            </span>
          </div>

          <div className={cn(styles.menu, { [styles.open]: isOpen })} role="menu">
            {datasetTypes.map((dt) => (
              <Card
                className={cn(styles['type-option'], {
                  [styles.selected]: dt.id === selectedType.id
                })}
                onClick={() => handleSelectType(dt.id)}
                tabIndex={0}
                key={dt.id}>
                <Card.Body className="p-2">
                  <span>
                    <strong className="text-capitalize">{dt.name}</strong>
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
