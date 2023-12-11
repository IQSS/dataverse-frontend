import { useState, PropsWithChildren } from 'react'
import { NotImplementedModal } from './NotImplementedModalContext'

export function NotImplementedModalProvider({ children }: PropsWithChildren) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const showModal = () => setIsModalOpen(true)
  const hideModal = () => setIsModalOpen(false)

  return (
    <NotImplementedModal.Provider value={{ isModalOpen, showModal, hideModal }}>
      {children}
    </NotImplementedModal.Provider>
  )
}
