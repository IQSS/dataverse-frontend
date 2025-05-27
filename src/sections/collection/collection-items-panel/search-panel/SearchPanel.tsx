import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Form } from '@iqss/dataverse-design-system'
import { Search } from 'react-bootstrap-icons'
import styles from './SearchPanel.module.scss'

interface SearchPanelProps {
  currentSearchValue?: string
  isLoadingCollectionItems: boolean
  onSubmitSearch: (searchValue: string) => void
  placeholderText: string
}

export const SearchPanel = ({
  currentSearchValue = '',
  isLoadingCollectionItems,
  onSubmitSearch,
  placeholderText
}: SearchPanelProps) => {
  const { t } = useTranslation('shared')

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
            placeholder={placeholderText}
            aria-label="Search"
            value={searchValue}
            onChange={handleSearchChange}
          />
          <Button
            variant="secondary"
            type="submit"
            icon={<Search />}
            aria-label={t('searchSubmitButtonLabel')}
            disabled={isLoadingCollectionItems}
          />
        </Form.InputGroup>
      </form>
      {/* <Button variant="link" className={styles['advanced-search-btn']} disabled>
        Advanced Search
      </Button> */}
    </div>
  )
}
