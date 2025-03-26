import { NotFoundPage } from '@/sections/not-found-page/NotFoundPage'

describe('NotFoundPage', () => {
  it('should render default message when dvObjectNotFoundType is not provided', () => {
    cy.customMount(<NotFoundPage />)

    cy.findByTestId('not-found-page').should('exist')
    cy.findByText('404').should('exist')
    cy.contains(/We can't find the Page you're looking for./i)
  })

  it('should render message for collection when dvObjectNotFoundType is collection', () => {
    cy.customMount(<NotFoundPage dvObjectNotFoundType="collection" />)

    cy.findByTestId('not-found-page').should('exist')
    cy.findByText('404').should('exist')
    cy.contains(/We can't find the Collection you're looking for./i)
  })

  it('should render message for dataset when dvObjectNotFoundType is dataset', () => {
    cy.customMount(<NotFoundPage dvObjectNotFoundType="dataset" />)

    cy.findByTestId('not-found-page').should('exist')
    cy.findByText('404').should('exist')
    cy.contains(/We can't find the Dataset you're looking for./i)
  })

  it('should render message for file when dvObjectNotFoundType is file', () => {
    cy.customMount(<NotFoundPage dvObjectNotFoundType="file" />)

    cy.findByTestId('not-found-page').should('exist')
    cy.findByText('404').should('exist')
    cy.contains(/We can't find the File you're looking for./i)
  })
})
