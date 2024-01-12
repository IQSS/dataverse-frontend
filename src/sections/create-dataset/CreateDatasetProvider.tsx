import { PropsWithChildren, useState, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import styles from '/src/sections/dataset/Dataset.module.scss'
import { SeparationLine } from '../../components/layout/SeparationLine/SeparationLine'
import { FormContext } from './CreateDatasetContext'
import { CreateDatasetFormFields } from '../../dataset/domain/useCases/createDataset'
// Add a type for the children prop
type FormProviderProps = {
  children: ReactNode
}
// Context Provider Component
export const CreateDatasetProvider: React.FC<FormProviderProps> = ({
  children
}: PropsWithChildren) => {
  const [formState, setFormState] = useState<CreateDatasetFormFields>({
    createDatasetTitle: ''
  })
  const { t } = useTranslation('createDataset')
  const updateFormState = (newState: CreateDatasetFormFields) => {
    setFormState((prevState) => ({ ...prevState, ...newState }))
  }

  return (
    <>
      <article>
        <header className={styles.header}>
          <h1>{t('pageTitle')}</h1>
        </header>
        <SeparationLine />
        <div className={styles.container}>
          <FormContext.Provider value={{ formState, updateFormState }}>
            {children}
          </FormContext.Provider>
        </div>
      </article>
    </>
  )
}
