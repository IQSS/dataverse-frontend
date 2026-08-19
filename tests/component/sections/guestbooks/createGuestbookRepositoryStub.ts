import { GuestbookRepository } from '@/guestbooks/domain/repositories/GuestbookRepository'

export const createGuestbookRepositoryStub = (): GuestbookRepository => ({
  createGuestbook: cy.stub(),
  getGuestbook: cy.stub(),
  getGuestbooksByCollectionId: cy.stub(),
  getGuestbookResponsesByGuestbookId: cy.stub(),
  setGuestbookEnabled: cy.stub(),
  downloadGuestbookResponsesByCollectionId: cy.stub(),
  downloadGuestbookResponsesByGuestbookId: cy.stub(),
  assignDatasetGuestbook: cy.stub(),
  removeDatasetGuestbook: cy.stub()
})
