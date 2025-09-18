import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { LinkCollectionDropdown } from '@/sections/collection/link-collection-dropdown/LinkCollectionDropdown'
import { CollectionMockRepository } from '@/stories/collection/CollectionMockRepository'
import { ReadError, WriteError } from '@iqss/dataverse-client-javascript'
import { CollectionSummaryMother } from '@tests/component/collection/domain/models/CollectionSummaryMother'

const collectionRepository: CollectionRepository = {} as CollectionRepository

describe('LinkCollectionDropdown', () => {
  beforeEach(() => {
    cy.viewport('macbook-15')
    collectionRepository.link = cy.stub().as('linkCollection').resolves()
    collectionRepository.getForLinking = cy
      .stub()
      .resolves(CollectionSummaryMother.createManyRealistic(5))
  })

  it('renders the dropdown with the buttons', () => {
    cy.customMount(
      <LinkCollectionDropdown
        collectionId="foo"
        collectionName="Foo"
        collectionRepository={collectionRepository}
      />
    )

    cy.findByRole('button', { name: /Link/i }).should('exist').click()
    cy.findByRole('button', { name: /Link Collection/i }).should('exist')
  })

  describe('Link Collection Functionality', () => {
    it('selects and links a collection successfully', () => {
      cy.customMount(
        <LinkCollectionDropdown
          collectionId="foo"
          collectionName="Foo"
          collectionRepository={collectionRepository}
        />
      )

      cy.findByRole('button', { name: /Link/ }).should('exist').click()
      cy.findByRole('button', { name: /Link Collection/ })
        .should('exist')
        .click()

      cy.findByRole('dialog')
        .should('be.visible')
        .within(() => {
          // Save button should be disabled when no collection is selected
          cy.findByRole('button', { name: /Save Linked Collection/ }).should('be.disabled')

          cy.findByLabelText(/Toggle options menu/)
            .should('exist')
            .click()

          cy.findByText('Collection 3').should('exist').click()

          cy.findByRole('button', { name: /Save Linked Collection/ })
            .should('not.be.disabled')
            .click()

          cy.get('@linkCollection').should((spy) => {
            const linkCollectionSpy = spy as unknown as Cypress.Agent<sinon.SinonSpy>
            const collectionAliasArg = linkCollectionSpy.getCall(0).args[0] as string
            const linkedCollectionIdArg = linkCollectionSpy.getCall(0).args[1] as number

            expect(collectionAliasArg).to.equal('foo')
            expect(linkedCollectionIdArg).to.equal(3)
          })
        })

      // Toast should appear
      cy.findByText(/Foo has been successfully linked to/)
        .should('exist')
        .should('be.visible')
    })

    it('searchs for a collection to link', () => {
      cy.customMount(
        <LinkCollectionDropdown
          collectionId="foo"
          collectionName="Foo"
          collectionRepository={new CollectionMockRepository()}
        />
      )

      cy.findByRole('button', { name: /Link/ }).should('exist').click()
      cy.findByRole('button', { name: /Link Collection/ })
        .should('exist')
        .click()

      cy.findByRole('dialog')
        .should('be.visible')
        .within(() => {
          // Save button should be disabled when no collection is selected
          cy.findByRole('button', { name: /Save Linked Collection/ }).should('be.disabled')

          cy.findByLabelText(/Toggle options menu/)
            .should('exist')
            .click()

          // Test a search that yields no results
          cy.findByPlaceholderText('Enter Collection Name').type('XYZ')
          cy.wait(500) // Wait for debounce
          cy.findByText('No collections found').should('exist')

          cy.findByPlaceholderText('Enter Collection Name').clear().type('Collection 3')
          cy.wait(500) // Wait for debounce

          cy.findByText('Collection 3').should('exist')
        })
    })

    it('shows no collections to link message', () => {
      collectionRepository.getForLinking = cy.stub().resolves([])
      cy.customMount(
        <LinkCollectionDropdown
          collectionId="foo"
          collectionName="Foo"
          collectionRepository={collectionRepository}
        />
      )

      cy.findByRole('button', { name: /Link/i }).should('exist').click()
      cy.findByRole('button', { name: /Link Collection/i })
        .should('exist')
        .click()

      cy.findByRole('dialog')
        .should('be.visible')
        .within(() => {
          cy.findByText(/No collections are showing up to link./)
            .should('exist')
            .should('be.visible')
        })

      // Save button should be disabled
      cy.findByRole('button', { name: /Save Linked Collection/ }).should('be.disabled')
    })

    it('shows only one collection to link message and doesnt render dropdown', () => {
      collectionRepository.getForLinking = cy.stub().resolves([
        CollectionSummaryMother.create({
          id: 555,
          displayName: 'Bar Collection',
          alias: 'bar-collection'
        })
      ])

      cy.customMount(
        <LinkCollectionDropdown
          collectionId="foo"
          collectionName="Foo"
          collectionRepository={collectionRepository}
        />
      )

      cy.findByRole('button', { name: /Link/i }).should('exist').click()
      cy.findByRole('button', { name: /Link Collection/i })
        .should('exist')
        .click()

      cy.findByRole('dialog')
        .should('be.visible')
        .within(() => {
          cy.findByText(/You have one collection you can add linked collection and datasets in./)
            .should('exist')
            .should('be.visible')

          cy.findByLabelText('Your Collection')
            .should('have.value', 'Bar Collection')
            .should('have.attr', 'readonly')
        })

      // Save button should no be disabled as the only collection is auto selected
      cy.findByRole('button', { name: /Save Linked Collection/ })
        .should('not.be.disabled')
        .click()

      cy.get('@linkCollection').should((spy) => {
        const linkCollectionSpy = spy as unknown as Cypress.Agent<sinon.SinonSpy>
        const collectionAliasArg = linkCollectionSpy.getCall(0).args[0] as string
        const linkedCollectionIdArg = linkCollectionSpy.getCall(0).args[1] as number

        expect(collectionAliasArg).to.equal('foo')
        expect(linkedCollectionIdArg).to.equal(555)
      })
    })

    it('handles error when linking a collection fails', () => {
      collectionRepository.link = cy
        .stub()
        .as('linkCollection')
        .rejects(new Error('Linking failed'))

      cy.customMount(
        <LinkCollectionDropdown
          collectionId="foo"
          collectionName="Foo"
          collectionRepository={collectionRepository}
        />
      )

      cy.findByRole('button', { name: /Link/ }).should('exist').click()
      cy.findByRole('button', { name: /Link Collection/ })
        .should('exist')
        .click()

      cy.findByRole('dialog')
        .should('be.visible')
        .within(() => {
          cy.findByLabelText(/Toggle options menu/)
            .should('exist')
            .click()

          cy.findByText('Collection 2').should('exist').click()

          cy.findByRole('button', { name: /Save Linked Collection/ })
            .should('not.be.disabled')
            .click()

          cy.get('@linkCollection').should((spy) => {
            const linkCollectionSpy = spy as unknown as Cypress.Agent<sinon.SinonSpy>
            const collectionAliasArg = linkCollectionSpy.getCall(0).args[0] as string
            const linkedCollectionIdArg = linkCollectionSpy.getCall(0).args[1] as number

            expect(collectionAliasArg).to.equal('foo')
            expect(linkedCollectionIdArg).to.equal(2)
          })

          // Error message should be displayed
          cy.findByText(/An unexpected error occurred while linking the collection./)
            .should('exist')
            .should('be.visible')
        })

      // Toast should not appear
      cy.findByText(/Foo has been successfully linked to/).should('not.exist')
    })

    it('handle error when linking a collection fails with WriteError', () => {
      collectionRepository.link = cy
        .stub()
        .as('linkCollection')
        .rejects(new WriteError('A WriteError received'))

      cy.customMount(
        <LinkCollectionDropdown
          collectionId="foo"
          collectionName="Foo"
          collectionRepository={collectionRepository}
        />
      )

      cy.findByRole('button', { name: /Link/i }).should('exist').click()
      cy.findByRole('button', { name: /Link Collection/ })
        .should('exist')
        .click()

      cy.findByRole('dialog')
        .should('be.visible')
        .within(() => {
          cy.findByLabelText(/Toggle options menu/)
            .should('exist')
            .click()

          cy.findByText('Collection 2').should('exist').click()
          cy.findByRole('button', { name: /Save Linked Collection/ })
            .should('not.be.disabled')
            .click()

          cy.get('@linkCollection').should((spy) => {
            const linkCollectionSpy = spy as unknown as Cypress.Agent<sinon.SinonSpy>
            const collectionAliasArg = linkCollectionSpy.getCall(0).args[0] as string
            const linkedCollectionIdArg = linkCollectionSpy.getCall(0).args[1] as number
            expect(collectionAliasArg).to.equal('foo')
            expect(linkedCollectionIdArg).to.equal(2)
          })

          // Specific error message should be displayed
          cy.findByText(/A WriteError received/i)
            .should('exist')
            .should('be.visible')
        })

      // Toast should not appear
      cy.findByText(/Foo has been successfully linked to/).should('not.exist')
    })

    it('handles error when fetching collections for linking fails', () => {
      collectionRepository.getForLinking = cy
        .stub()
        .rejects(new Error('Fetching collections failed'))

      cy.customMount(
        <LinkCollectionDropdown
          collectionId="foo"
          collectionName="Foo"
          collectionRepository={collectionRepository}
        />
      )

      cy.findByRole('button', { name: /Link/i }).should('exist').click()
      cy.findByRole('button', { name: /Link Collection/i })
        .should('exist')
        .click()

      cy.findByRole('dialog')
        .should('be.visible')
        .within(() => {
          // Error message should be displayed
          cy.findByText(/An unexpected error occurred while fetching collections for linking./)
            .should('exist')
            .should('be.visible')
        })
    })

    it('handles error when fetching collections for linking fails with ReadError', () => {
      collectionRepository.getForLinking = cy.stub().rejects(new ReadError('A ReadError received'))

      cy.customMount(
        <LinkCollectionDropdown
          collectionId="foo"
          collectionName="Foo"
          collectionRepository={collectionRepository}
        />
      )

      cy.findByRole('button', { name: /Link/i }).should('exist').click()
      cy.findByRole('button', { name: /Link Collection/i })
        .should('exist')
        .click()

      cy.findByRole('dialog')
        .should('be.visible')
        .within(() => {
          // Specific error message should be displayed
          cy.findByText(/A ReadError received/i)
            .should('exist')
            .should('be.visible')
        })
    })
  })
})
