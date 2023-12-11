import { createContext, useContext } from 'react'

interface NotImplementedModalContextProps {
  showModal: () => void
  hideModal: () => void
  isModalOpen: boolean
}

export const NotImplementedModal = createContext<NotImplementedModalContextProps>({
  isModalOpen: false,
  showModal: /* istanbul ignore next */ () => {},
  hideModal: /* istanbul ignore next */ () => {}
})

export const useNotImplementedModal = () => useContext(NotImplementedModal)
