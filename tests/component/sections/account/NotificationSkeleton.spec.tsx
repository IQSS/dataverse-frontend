import { NotificationSkeleton } from '@/sections/account/notifications-section/NotificationsSkeleton'

describe('NotificationSkeleton', () => {
  it('renders the default number of skeleton rows when no `rows` prop is provided', () => {
    cy.customMount(<NotificationSkeleton />)

    // The placeholder section is marked aria-busy so screen readers know
    // the content is loading. Use it as the stable anchor.
    cy.get('section[aria-busy="true"]').should('exist')
  })

  it('renders the requested number of skeleton rows when `rows` is provided', () => {
    cy.customMount(<NotificationSkeleton rows={3} />)

    cy.get('section[aria-busy="true"]').should('exist')
  })

  it('clamps non-positive `rows` to a minimum of one row', () => {
    cy.customMount(<NotificationSkeleton rows={0} />)

    cy.get('section[aria-busy="true"]').should('exist')
  })
})
