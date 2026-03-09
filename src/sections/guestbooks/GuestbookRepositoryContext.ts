import { createContext, useContext } from 'react'
import { GuestbookRepository } from '@/guestbooks/domain/repositories/GuestbookRepository'
import { GuestbookJSDataverseRepository } from '@/guestbooks/infrastructure/repositories/GuestbookJSDataverseRepository'

const guestbookRepository = new GuestbookJSDataverseRepository()

export const GuestbookRepositoryContext = createContext<GuestbookRepository>(guestbookRepository)

export const useGuestbookRepository = () => useContext(GuestbookRepositoryContext)
