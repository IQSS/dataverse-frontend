import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Form } from '@iqss/dataverse-design-system'
import styles from './UserNameSearch.module.scss'

interface UserNameSearchProps {
  currentSearchValue?: string
  isLoadingCollectionItems: boolean
  onSubmitSearch: (searchValue: string) => void
}

export const UserNameSearch = ({
  currentSearchValue = '',
  isLoadingCollectionItems,
  onSubmitSearch
}: UserNameSearchProps) => {
  const { t } = useTranslation('account')

  const [searchValue, setSearchValue] = useState(currentSearchValue)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedSearchValue = searchValue.trim()

    onSubmitSearch(trimmedSearchValue)
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value)
  }

  useEffect(() => {
    setSearchValue(currentSearchValue)
  }, [currentSearchValue])

  return (
    <div className={styles['search-panel']}>
      <form onSubmit={handleSubmit} className={styles['search-form']} role="search">
        <Form.InputGroup className={styles['search-input-group']}>
          <Form.Group.Input
            type="search"
            placeholder={t('myData.userNameSearchPlaceholder')}
            aria-label="Search"
            value={searchValue}
            onChange={handleSearchChange}
            disabled={isLoadingCollectionItems}
          />
        </Form.InputGroup>
      </form>
    </div>
  )
}
