import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Form } from '@iqss/dataverse-design-system'
import { Check, X } from 'react-bootstrap-icons'
import { TemplateInstructionInfo } from '@/templates/domain/models/TemplateInfo'
import styles from './index.module.scss'

interface CustomInstructionsEditorProps {
  value?: string
  onSave: (instruction: TemplateInstructionInfo) => void
  fieldKey: string
}

export const CustomInstructionsEditor = ({
  value,
  onSave,
  fieldKey
}: CustomInstructionsEditorProps) => {
  const { t } = useTranslation('datasetTemplates', {
    keyPrefix: 'createTemplate.customInstructions'
  })
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(value ?? '')

  useEffect(() => {
    if (!isEditing) {
      setDraft(value ?? '')
    }
  }, [isEditing, value])

  const handleStartEdit = () => {
    setIsEditing(true)
    setDraft(value ?? '')
  }

  const handleCancel = () => {
    setIsEditing(false)
    setDraft(value ?? '')
  }

  const handleSave = () => {
    const trimmed = draft.trim()
    onSave({ instructionField: fieldKey, instructionText: trimmed })
    setIsEditing(false)
  }

  return (
    <div className={`col-sm-9 ${styles['custom-instructions']}`}>
      <span className={styles['custom-instructions-label']}>{t('label')}</span>
      <div className={styles['custom-instructions-content']}>
        {!isEditing && (
          <button
            type="button"
            className={styles['custom-instructions-toggle']}
            onClick={handleStartEdit}
            aria-label={value ? t('editAria') : t('addAria')}
            data-testid={`custom-instructions-toggle-${fieldKey}`}>
            {value ? value : t('none')}
          </button>
        )}
        {isEditing && (
          <div className={styles['custom-instructions-editor']}>
            <Form.Group.Input
              type="text"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              className={styles['custom-instructions-input']}
              aria-label={t('inputAriaLabel')}
              data-testid={`custom-instructions-input-${fieldKey}`}
            />
            <div className={styles['custom-instructions-actions']}>
              <button
                type="button"
                className={styles['custom-instructions-icon-button']}
                onClick={handleSave}
                aria-label={t('save')}
                data-testid={`custom-instructions-save-${fieldKey}`}>
                <Check />
              </button>
              <button
                type="button"
                className={styles['custom-instructions-icon-button']}
                onClick={handleCancel}
                aria-label={t('cancel')}
                data-testid={`custom-instructions-cancel-${fieldKey}`}>
                <X />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
