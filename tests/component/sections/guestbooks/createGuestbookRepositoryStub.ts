import { GuestbookRepository } from '@/guestbooks/domain/repositories/GuestbookRepository'

export const createGuestbookRepositoryStub = (): GuestbookRepository => ({
  createGuestbook: cy.stub(),
  getGuestbook: cy.stub(),
  getGuestbooksByCollectionId: cy.stub(),
  setGuestbookEnabled: cy.stub(),
  downloadGuestbookResponsesByDataverseId: cy.stub(),
  downloadGuestbookResponsesOfAGuestbook: cy.stub(),
  assignDatasetGuestbook: cy.stub(),
  removeDatasetGuestbook: cy.stub()
})
