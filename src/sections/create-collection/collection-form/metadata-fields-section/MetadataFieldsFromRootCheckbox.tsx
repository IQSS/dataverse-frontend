import { ChangeEvent, useId, useState } from 'react'
import { Controller, UseControllerProps, useFormContext } from 'react-hook-form'
import { Alert, Button, Form, Modal } from '@iqss/dataverse-design-system'

export const USE_FIELDS_FROM_ROOT_NAME = 'useFieldsFromRoot'

export const MetadataFieldsFromRootCheckbox = () => {
  const checkboxID = useId()
  const { control, setValue } = useFormContext()
  const [showResetConfirmationModal, setShowResetConfirmationModal] = useState(false)

  const handleContinueWithReset = () => {
    setValue(USE_FIELDS_FROM_ROOT_NAME, true)
    closeModal()
  }

  const openModal = () => setShowResetConfirmationModal(true)
  const closeModal = () => setShowResetConfirmationModal(false)

  const rules: UseControllerProps['rules'] = {}

  return (
    <>
      <Controller
        name={USE_FIELDS_FROM_ROOT_NAME}
        control={control}
        rules={rules}
        render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => {
          const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
            // Only if trying to check the checkbox, open the modal to confirm the reset
            if (e.target.checked) {
              openModal()
            } else {
              onChange(e)
            }
          }
          return (
            <Form.Group.Checkbox
              id={checkboxID}
              onChange={handleChange}
              name={USE_FIELDS_FROM_ROOT_NAME}
              label="Use metadata fields from Root"
              checked={value as boolean}
              isInvalid={invalid}
              invalidFeedback={error?.message}
              ref={ref}
            />
          )
        }}
      />

      <ConfirmResetModificationsModal
        showModal={showResetConfirmationModal}
        onContinue={handleContinueWithReset}
        onCancel={closeModal}
      />
    </>
  )
}

interface ConfirmResetModificationsModalProps {
  showModal: boolean
  onContinue: () => void
  onCancel: () => void
}

const ConfirmResetModificationsModal = ({
  showModal,
  onContinue,
  onCancel
}: ConfirmResetModificationsModalProps) => (
  <Modal show={showModal} onHide={onCancel} size="xl">
    <Modal.Header>
      <Modal.Title>Reset Modifications</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {/* <AlertIcon */}
      <Alert variant="warning" dismissible={false}>
        Are you sure you want to reset the selected metadata fields? If you do this, any
        customizations (hidden, required, optional) you have done will no longer appear.
      </Alert>
    </Modal.Body>
    <Modal.Footer>
      <Button onClick={onContinue}>Continue</Button>
      <Button variant="secondary" onClick={onCancel}>
        Cancel
      </Button>
    </Modal.Footer>
  </Modal>
)
