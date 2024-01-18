import React, { ChangeEvent, FormEvent, useState } from 'react'
import {
  CreateDatasetFormFields,
  FormSubmissionService,
  FormValidationService,
  FormValidationResult
} from '../../dataset/domain/useCases/createDataset'

interface FormContextInterface {
  fields: CreateDatasetFormFields
}

const defaultFormState: CreateDatasetFormFields = {
  createDatasetTitle: ''
}

interface CreateDatasetFormProps {
  formValidationService: FormValidationService
  formSubmissionService: FormSubmissionService
}

export enum SubmissionStatusEnums {
  NotSubmitted = 'NotSubmitted',
  IsSubmitting = 'IsSubmitting',
  SubmitComplete = 'SubmitComplete',
  Errored = 'Errored'
}

export function useCreateDatasetForm({
  formValidationService,
  formSubmissionService
}: CreateDatasetFormProps) {
  const [formState, setFormState] = useState<FormContextInterface>({
    fields: defaultFormState
  })
  const [submissionStatus, setSubmissionStatus] = React.useState<SubmissionStatusEnums>(
    SubmissionStatusEnums.NotSubmitted
  )
  const [formErrors, setFormErrors] = useState<
    Record<keyof CreateDatasetFormFields, string | undefined>
  >({ createDatasetTitle: undefined })

  const handleCreateDatasetFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormState((prevState) => ({
      ...prevState,
      fields: { ...prevState.fields, [name]: value }
    }))
  }

  const handleCreateDatasetSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmissionStatus(SubmissionStatusEnums.IsSubmitting)

    const validationResult: FormValidationResult = formValidationService.validateForm(
      formState.fields
    )

    if (validationResult.isValid) {
      formSubmissionService
        .submitFormData(formState.fields)
        .then(() => setSubmissionStatus(SubmissionStatusEnums.IsSubmitting))
        .catch(() => setSubmissionStatus(SubmissionStatusEnums.Errored))
        .finally(() => setSubmissionStatus(SubmissionStatusEnums.SubmitComplete))
    } else {
      setFormErrors(validationResult.errors)
      setSubmissionStatus(SubmissionStatusEnums.Errored)
    }
  }

  return {
    formState,
    formErrors,
    submissionStatus,
    handleCreateDatasetFieldChange,
    handleCreateDatasetSubmit
  }
}

// type FormProviderProps = {
//   children: ReactNode
// }
// // Context Provider Component
// export const CreateDatasetProvider: React.FC<FormProviderProps> = ({
//   children
// }: PropsWithChildren) => {
//   return (
//     <>
//       <article>
//         <header className={styles.header}>
//           <h1>{t('pageTitle')}</h1>
//         </header>
//         <SeparationLine />
//         <div className={styles.container}>
//           <FormContext.Provider value={{ formState, updateFormState }}>
//             {children}
//           </FormContext.Provider>
//         </div>
//       </article>
//     </>
//   )
// }
