import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Form, CloseButton } from '@iqss/dataverse-design-system'
import { Search as SearchIcon } from 'react-bootstrap-icons'
import { Route } from '../../Route.enum'
import { CollectionItemType } from '../../../collection/domain/models/CollectionItemType'
import { CollectionItemsQueryParams } from '@/collection/domain/models/CollectionItemsQueryParams'
import { SearchDropdown } from './SearchDropdown'
import styles from './SearchInput.module.scss'

interface SearchInputProps {
  hasMoreThanOneSearchEngine?: boolean
  searchDropdownPosition?: 'left' | 'right'
}

export const SearchInput = ({
  hasMoreThanOneSearchEngine = false,
  searchDropdownPosition = 'left'
}: SearchInputProps) => {
  const navigate = useNavigate()
  const { t } = useTranslation('shared')
  const inputSearchRef = useRef<HTMLInputElement>(null)
  const [searchValue, setSearchValue] = useState('')
  const [searchEngineSelected, setSearchEngineSelected] = useState<string>('one')

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedSearchValue = searchValue.trim()

    if (!trimmedSearchValue) return

    const encodedSearchValue = encodeURIComponent(trimmedSearchValue)

    const searchParams = new URLSearchParams()
    searchParams.set(CollectionItemsQueryParams.QUERY, encodedSearchValue)
    searchParams.set(
      CollectionItemsQueryParams.TYPES,
      [CollectionItemType.COLLECTION, CollectionItemType.DATASET, CollectionItemType.FILE].join(',')
    )

    const collectionUrlWithQuery = `${Route.COLLECTIONS_BASE}?${searchParams.toString()}`

    navigate(collectionUrlWithQuery)
  }

  const handleClearSearch = () => {
    setSearchValue('')
    inputSearchRef.current?.focus()
  }

  const handleSearchEngineSelect = (eventKey: string | null) => {
    setSearchEngineSelected(eventKey as string)
  }

  return (
    <form onSubmit={handleSubmit} className={styles['search-input-wrapper']} role="search">
      {hasMoreThanOneSearchEngine && searchDropdownPosition === 'left' && (
        <SearchDropdown
          searchEngineSelected={searchEngineSelected}
          handleSearchEngineSelect={handleSearchEngineSelect}
          position="left"
        />
      )}
      <div className={styles['input-and-clear-wrapper']}>
        <Form.Group.Input
          type="text"
          aria-label={t('search')}
          autoFocus
          autoComplete="off"
          className={styles['text-input']}
          value={searchValue}
          onChange={handleSearchChange}
          ref={inputSearchRef}
        />
        {searchValue && (
          <CloseButton
            aria-label={t('clearSearch')}
            className={styles['clear-btn']}
            onClick={handleClearSearch}
          />
        )}
      </div>
      {hasMoreThanOneSearchEngine && searchDropdownPosition === 'right' && (
        <SearchDropdown
          searchEngineSelected={searchEngineSelected}
          handleSearchEngineSelect={handleSearchEngineSelect}
          position="right"
        />
      )}
      <button type="submit" aria-label={t('submitSearch')} className={styles['search-btn']}>
        <SearchIcon size={22} />
      </button>
    </form>
  )
}
