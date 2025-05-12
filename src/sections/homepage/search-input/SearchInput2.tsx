import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Form,
  CloseButton,
  DropdownButton,
  DropdownButtonItem
} from '@iqss/dataverse-design-system'
import { Search as SearchIcon } from 'react-bootstrap-icons'
import { Route } from '../../Route.enum'
import { CollectionItemType } from '../../../collection/domain/models/CollectionItemType'
import { CollectionItemsQueryParams } from '@/collection/domain/models/CollectionItemsQueryParams'
import styles from './SearchInput2.module.scss'

interface SearchInput2Props {
  hasMoreThanOneSearchEngine?: boolean
}

const searchEngineOptions = [
  { id: 'one', label: 'Dataverse Engine' },
  { id: 'two', label: 'External Engine 1' },
  { id: 'three', label: 'External Engine 2' }
]

export const SearchInput2 = ({ hasMoreThanOneSearchEngine = false }: SearchInput2Props) => {
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
    console.log('Selected search engine:', eventKey)
    setSearchEngineSelected(eventKey as string)
  }

  const searchEngineLabel = searchEngineOptions.find(
    (option) => option.id === searchEngineSelected
  )?.label

  return (
    <div className={styles['main-search-wrapper']}>
      <form onSubmit={handleSubmit} className={styles['search-input-wrapper']} role="search">
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

        <button type="submit" aria-label={t('submitSearch')} className={styles['search-btn']}>
          <SearchIcon size={22} />
        </button>
      </form>
      <div className={styles['search-options']}>
        {hasMoreThanOneSearchEngine && (
          <DropdownButton
            title={searchEngineLabel || 'Search Engine'}
            id="dropdown-select"
            size="sm"
            variant="secondary"
            onSelect={handleSearchEngineSelect}>
            {searchEngineOptions.map((option) => (
              <DropdownButtonItem
                eventKey={option.id}
                active={searchEngineSelected === option.id}
                key={option.id}>
                {option.label}
              </DropdownButtonItem>
            ))}
          </DropdownButton>
        )}
      </div>
    </div>
  )
}
