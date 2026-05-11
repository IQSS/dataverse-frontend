import { createContext, useContext } from 'react'
import { AccessRepository } from '@/access/domain/repositories/AccessRepository'
import { AccessJSDataverseRepository } from '@/access/infrastructure/repositories/AccessJSDataverseRepository'

const accessRepository = new AccessJSDataverseRepository()

export const AccessRepositoryContext = createContext<AccessRepository>(accessRepository)

export const useAccessRepository = () => useContext(AccessRepositoryContext)
