import { useRef } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import {
  CollectionType,
  CollectionStorage
} from '../../../collection/domain/useCases/DTOs/CollectionDTO'
import { SeparationLine } from '../../shared/layout/SeparationLine/SeparationLine'
import { TopFieldsSection } from './top-fields-section'

export interface CollectionFormProps {
  defaultValues: Partial<CollectionFormData>
}

export type CollectionFormData = {
  hostCollection: string
  name: string
  affiliation?: string
  alias: string
  storage?: CollectionStorage
  type: CollectionType
  description?: string
  contacts: { value: string }[]
}

export const CollectionForm = ({ defaultValues }: CollectionFormProps) => {
  const formContainerRef = useRef<HTMLDivElement>(null)

  const form = useForm<CollectionFormData>({
    mode: 'onChange',
    defaultValues
  })

  const preventEnterSubmit = (e: React.KeyboardEvent<HTMLFormElement | HTMLButtonElement>) => {
    // When pressing Enter, only submit the form  if the user is focused on the submit button itself
    if (e.key !== 'Enter') return

    const isButton = e.target instanceof HTMLButtonElement
    const isButtonTypeSubmit = isButton ? (e.target as HTMLButtonElement).type === 'submit' : false

    if (!isButton && !isButtonTypeSubmit) e.preventDefault()
  }

  const submitForm = (formValues: CollectionFormData) => {
    console.log({ formValues })
  }

  function onSubmittedCollectionError() {
    if (formContainerRef.current) {
      formContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
  // TODO:ME Apply max width to container
  return (
    <div
      // className={styles['form-container']}
      ref={formContainerRef}
      data-testid="collection-form">
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(submitForm)}
          onKeyDown={preventEnterSubmit}
          noValidate={true}>
          <TopFieldsSection />

          <SeparationLine />

          {/* Metadata Fields Section here 👇 */}

          {/* Browse/Search Facets Section here 👇 */}
        </form>
      </FormProvider>
    </div>
  )
}
