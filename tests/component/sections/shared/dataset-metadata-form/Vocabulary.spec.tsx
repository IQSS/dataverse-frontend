import { FormProvider, useForm } from 'react-hook-form'

import i18next from '@/i18n'
import { PUBLICATION_RELATION_TYPE_VALUES } from '@/metadata-block-info/domain/models/MetadataBlockInfo'
import { Vocabulary } from '@/sections/shared/form/DatasetMetadataForm/MetadataForm/MetadataBlockFormFields/MetadataFormField/Fields/Vocabulary'

interface RelationTypeFormValues {
  citation: {
    publication: Array<{
      publicationRelationType: string
    }>
  }
}

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
          options={[...PUBLICATION_RELATION_TYPE_VALUES]}
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

function UnrelatedVocabularyForm() {
  const form = useForm({
    defaultValues: {
      citation: {
        authorIdentifierScheme: ''
      }
    }
  })

  return (
    <FormProvider {...form}>
      <Vocabulary
        name="authorIdentifierScheme"
        title="Identifier Scheme"
        displayName="Author Identifier Scheme"
        watermark=""
        description="The identifier scheme"
        type="TEXT"
        rulesToApply={{}}
        requiredIndicator={false}
        options={['ResearcherID']}
        metadataBlockName="citation"
        withinMultipleFieldsGroup={false}
      />
    </FormProvider>
  )
}

describe('Vocabulary', () => {
  beforeEach(() => cy.wrap(i18next.changeLanguage('en')))

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

  it('uses the active locale for publication relation labels', () => {
    cy.wrap(i18next.changeLanguage('es')).then(() => {
      cy.customMount(<RelationTypeForm onSubmit={cy.stub()} />)

      cy.findByLabelText('Relation Type')
        .find('option[value="IsSupplementedBy"]')
        .should('have.text', 'Es complementado por')
    })
  })

  it('leaves unrelated controlled vocabulary labels unchanged', () => {
    cy.customMount(<UnrelatedVocabularyForm />)

    cy.findByLabelText('Identifier Scheme')
      .find('option[value="ResearcherID"]')
      .should('have.text', 'ResearcherID')
  })
})
