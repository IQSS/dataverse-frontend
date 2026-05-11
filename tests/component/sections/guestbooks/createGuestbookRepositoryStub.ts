import { GuestbookRepository } from '@/guestbooks/domain/repositories/GuestbookRepository'

export const createGuestbookRepositoryStub = (): GuestbookRepository => ({
  createGuestbook: cy.stub(),
  getGuestbook: cy.stub(),
  getGuestbooksByCollectionId: cy.stub(),
  assignDatasetGuestbook: cy.stub(),
  removeDatasetGuestbook: cy.stub()
})
