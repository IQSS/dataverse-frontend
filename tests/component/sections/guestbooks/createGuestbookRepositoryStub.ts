import { GuestbookRepository } from '@/guestbooks/domain/repositories/GuestbookRepository'

export const createGuestbookRepositoryStub = (): GuestbookRepository => ({
  getGuestbook: cy.stub(),
  getGuestbooksByCollectionId: cy.stub(),
  assignDatasetGuestbook: cy.stub(),
  removeDatasetGuestbook: cy.stub()
})
