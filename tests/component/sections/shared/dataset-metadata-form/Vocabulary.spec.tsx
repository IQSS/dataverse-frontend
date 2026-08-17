import { FormProvider, useForm } from 'react-hook-form'
import { Vocabulary } from '@/sections/shared/form/DatasetMetadataForm/MetadataForm/MetadataBlockFormFields/MetadataFormField/Fields/Vocabulary'

interface RelationTypeFormValues {
  citation: {
    publication: Array<{
      publicationRelationType: string
    }>
  }
}

const RELATION_TYPE_VALUES = [
  'IsCitedBy',
  'Cites',
  'IsSupplementTo',
  'IsSupplementedBy',
  'IsReferencedBy',
  'References'
]

function RelationTypeForm({ onSubmit }: { onSubmit: (values: RelationTypeFormValues) => void }) {
  const form = useForm<RelationTypeFormValues>({
    defaultValues: {
      citation: {
        publication: [{ publicationRelationType: '' }]
      }
    }
  })

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Vocabulary
          name="publicationRelationType"
          title="Relation Type"
          displayName="Related Publication Relation Type"
          watermark=""
          description="The nature of the relationship"
          type="TEXT"
          rulesToApply={{}}
          requiredIndicator={false}
          options={RELATION_TYPE_VALUES}
          metadataBlockName="citation"
          compoundParentName="publication"
          withinMultipleFieldsGroup
          fieldsArrayIndex={0}
        />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  )
}

describe('Vocabulary', () => {
  it('displays human-readable relation type labels while submitting the original value', () => {
    const onSubmit = cy.stub().as('onSubmit')

    cy.customMount(<RelationTypeForm onSubmit={onSubmit} />)

    cy.findByLabelText('Relation Type')
      .should('have.prop', 'tagName', 'SELECT')
      .as('relationTypeSelect')

    cy.get('@relationTypeSelect')
      .find('option[value="IsSupplementedBy"]')
      .should('have.text', 'Is Supplemented By')

    cy.get('@relationTypeSelect')
      .select('IsSupplementedBy')
      .should('have.value', 'IsSupplementedBy')
    cy.findByRole('button', { name: 'Submit' }).click()

    cy.get('@onSubmit').should('have.been.calledOnce')
    cy.get('@onSubmit')
      .its('firstCall.args.0.citation.publication.0.publicationRelationType')
      .should('equal', 'IsSupplementedBy')
  })
})
