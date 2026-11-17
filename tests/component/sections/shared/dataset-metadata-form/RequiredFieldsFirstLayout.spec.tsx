import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { MetadataBlockInfoRepository } from '@/metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { DatasetMetadataForm } from '@/sections/shared/form/DatasetMetadataForm'
import { MetadataBlockInfoMother } from '../../../metadata-block-info/domain/models/MetadataBlockInfoMother'
import { UserMother } from '../../../users/domain/models/UserMother'
import { WithRepositories } from '@tests/component/WithRepositories'

const datasetRepository: DatasetRepository = {} as DatasetRepository
const metadataBlockInfoRepository: MetadataBlockInfoRepository = {} as MetadataBlockInfoRepository
const testUser = UserMother.create()

const createDatasetForm = (
  <WithRepositories datasetRepository={datasetRepository}>
    <DatasetMetadataForm
      mode="create"
      collectionId="root"
      metadataBlockInfoRepository={metadataBlockInfoRepository}
    />
  </WithRepositories>
)

// The sample collection requires Title, Author, Point of Contact, Description and Subject from the
// Citation block, and Geographic Coverage from the Geospatial block
const fillEmptyRequiredFields = () => {
  cy.findByLabelText(/^Title/i).type('Test Dataset Title')

  cy.findByText('Description')
    .closest('.row')
    .within(() => {
      cy.findByLabelText(/^Text/i).type('Test description text')
    })

  cy.findByText('Subject')
    .closest('.row')
    .within(() => {
      cy.findByLabelText('Toggle options menu').click()
      cy.findByLabelText('Subject1').click()
    })

  cy.findByText('Geographic Coverage')
    .closest('.row')
    .within(() => {
      cy.findByLabelText(/Country \/ Nation/).click({ force: true })
      cy.findByLabelText(/Country \/ Nation/)
        .closest('.dropdown')
        .within(() => {
          cy.findByText('Argentina').click({ force: true })
        })
    })
}

describe('Create Dataset form laid out by required fields first', () => {
  beforeEach(() => {
    datasetRepository.create = cy.stub().resolves({ persistentId: 'persistentId' })
    metadataBlockInfoRepository.getByCollectionId = cy
      .stub()
      .resolves(MetadataBlockInfoMother.getByCollectionIdDisplayedOnCreateFalse())
    metadataBlockInfoRepository.getDisplayedOnCreateByCollectionId = cy
      .stub()
      .resolves(MetadataBlockInfoMother.getByCollectionIdDisplayedOnCreateTrue())
  })

  it('shows the empty required fields first, the prefilled ones as completed, and the optional fields folded', () => {
    cy.mountAuthenticated(createDatasetForm)

    cy.findByTestId('still-needed-section').within(() => {
      cy.findByText('Still needed').should('exist')
      cy.findByText('4 required fields are empty').should('exist')
      cy.findByLabelText(/^Title/i).should('exist')
      cy.findByText('Description').should('exist')
      cy.findByText('Subject').should('exist')
      cy.findByText('Geographic Coverage').should('exist')
      cy.findByText('Author').should('not.exist')
    })

    cy.findByTestId('completed-section').within(() => {
      cy.findByText('Completed').should('exist')
      cy.findByText('Author').should('exist')
      cy.findByText('Point of Contact').should('exist')
      cy.findByLabelText(/^Title/i).should('not.exist')
    })

    cy.findByTestId('optional-fields-section').within(() => {
      cy.findByText('Optional fields').should('exist')
      cy.findAllByText(/Keyword/).should('exist')
      cy.get('.accordion-collapse').first().should('not.have.class', 'show')
    })
  })

  it('shows every required field as still needed when nothing is prefilled', () => {
    cy.customMount(createDatasetForm)

    cy.findByTestId('still-needed-section').within(() => {
      cy.findByText('6 required fields are empty').should('exist')
      cy.findByText('Author').should('exist')
      cy.findByText('Point of Contact').should('exist')
    })

    cy.findByTestId('completed-section').should('not.exist')
  })

  it('names the metadata block above the fields pulled out of it', () => {
    cy.mountAuthenticated(createDatasetForm)

    cy.findByTestId('still-needed-section').within(() => {
      cy.findByTestId('required-fields-block-citation').within(() => {
        cy.findByText('Citation Metadata').should('exist')
        cy.findByLabelText(/^Title/i).should('exist')
      })

      cy.findByTestId('required-fields-block-geospatial').within(() => {
        cy.findByText('Geospatial Metadata').should('exist')
        cy.findByText('Geographic Coverage').should('exist')
      })
    })
  })

  it('counts the empty required fields as they are filled and goes to the next one', () => {
    cy.mountAuthenticated(createDatasetForm)

    cy.findByTestId('required-fields-counter').within(() => {
      cy.findByText('4 required fields still empty').should('exist')
    })

    cy.findByLabelText(/^Title/i).type('Test Dataset Title')

    cy.findByTestId('required-fields-counter').within(() => {
      cy.findByText('3 required fields still empty').should('exist')
    })
    cy.findByTestId('still-needed-section').within(() => {
      cy.findByText('3 required fields are empty').should('exist')
    })

    cy.findByRole('button', { name: 'Go to the next one' }).click()

    cy.focused().should('have.id', 'citation.dsDescription.0.dsDescriptionValue')
  })

  it('says when all required fields are filled', () => {
    cy.mountAuthenticated(createDatasetForm)

    fillEmptyRequiredFields()

    cy.findByTestId('required-fields-counter').within(() => {
      cy.findByText('All required fields are filled').should('exist')
    })
    cy.findByTestId('still-needed-section').within(() => {
      cy.findByText('All required fields are filled').should('exist')
    })
  })

  it('notes which completed values came from the account, with the ORCID iD and ROR ID when the account holds them', () => {
    cy.mountAuthenticated(createDatasetForm, undefined, {
      orcid: '0000-0002-1825-0097',
      affiliationRorId: 'https://ror.org/03vek6s52'
    })

    cy.findByTestId('completed-section').within(() => {
      cy.findAllByTestId('account-source-note')
        .should('have.length', 2)
        .each(($note) => {
          expect($note.text()).to.contain('From your account:')
          expect($note.text()).to.contain('ORCID iD 0000-0002-1825-0097')
          expect($note.text()).to.contain('ROR ID https://ror.org/03vek6s52')
        })
      cy.findAllByTestId('account-source-note').last().should('contain.text', testUser.email)
    })
  })

  it('does not show identifiers when the account does not hold them', () => {
    cy.mountAuthenticated(createDatasetForm)

    cy.findByTestId('completed-section').within(() => {
      cy.findAllByTestId('account-source-note')
        .should('have.length', 2)
        .each(($note) => {
          expect($note.text()).to.contain('From your account:')
          expect($note.text()).not.to.contain('ORCID')
          expect($note.text()).not.to.contain('ROR')
        })
    })
  })

  it('opens the folded optional fields when one of them has an error on submit', () => {
    cy.mountAuthenticated(createDatasetForm)

    fillEmptyRequiredFields()

    cy.findByTestId('optional-fields-section').within(() => {
      cy.get('.accordion-button').first().click()
      cy.wait(300)

      cy.findByLabelText(/^Deposit Date/i)
        .clear()
        .type('1990-23-23')

      // Fold the optional fields again
      cy.get('.accordion-button').first().click()
      cy.wait(300)
    })

    cy.findByText('Save Dataset').click()

    cy.findByText(/^Deposit Date is not a valid date/).should('exist')
    cy.findByLabelText(/^Deposit Date/i).should('be.visible')
  })
})
