import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Form, CloseButton } from '@iqss/dataverse-design-system'
import { Search as SearchIcon, Stars as StarsIcon } from 'react-bootstrap-icons'
import { Route } from '../../Route.enum'
import { CollectionItemType } from '@/collection/domain/models/CollectionItemType'
import { CollectionItemsQueryParams } from '@/collection/domain/models/CollectionItemsQueryParams'
import { SearchService } from '@/search/domain/models/SearchService'
import { SearchDropdown } from './SearchDropdown'
import styles from './SearchInput.module.scss'

export const SOLR_SERVICE_NAME = 'solr'

interface SearchInputProps {
  searchServices: SearchService[]
}

export const SearchInput = ({ searchServices }: SearchInputProps) => {
  const navigate = useNavigate()
  const { t } = useTranslation('shared')
  const inputSearchRef = useRef<HTMLInputElement>(null)
  const [searchValue, setSearchValue] = useState('')
  const [searchServiceSelected, setSearchServiceSelected] = useState<string>(SOLR_SERVICE_NAME)

  const hasMoreThanOneSearchService = searchServices.length > 1

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedSearchValue = searchValue.trim()

    if (!trimmedSearchValue) return

    const searchParams = new URLSearchParams()
    searchParams.set(CollectionItemsQueryParams.QUERY, trimmedSearchValue)
    searchParams.set(
      CollectionItemsQueryParams.TYPES,
      [CollectionItemType.COLLECTION, CollectionItemType.DATASET, CollectionItemType.FILE].join(',')
    )

    if (searchServiceSelected !== SOLR_SERVICE_NAME) {
      // For now we set this search service selected in the session storage to use in only the first time we arrive to the collection page
      // We could put this in the URL if we want to keep using it on subsequent searches within the collection page
      sessionStorage.setItem(CollectionItemsQueryParams.SEARCH_SERVICE, searchServiceSelected)
    }

    const collectionUrlWithQuery = `${Route.COLLECTIONS_BASE}?${searchParams.toString()}`

    navigate(collectionUrlWithQuery)
  }

  const handleClearSearch = () => {
    setSearchValue('')
    inputSearchRef.current?.focus()
  }

  const handleSearchEngineSelect = (eventKey: string | null) => {
    setSearchServiceSelected(eventKey as string)
    inputSearchRef.current?.focus()
  }

  return (
    <form onSubmit={handleSubmit} className={styles['search-input-wrapper']} role="search">
      <div className={styles['input-and-clear-wrapper']}>
        {searchServiceSelected !== SOLR_SERVICE_NAME && (
          <span className="px-2">
            <StarsIcon size={22} color="white" />
          </span>
        )}
        <Form.Group.Input
          name="search"
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
      {hasMoreThanOneSearchService && (
        <SearchDropdown
          searchServiceSelected={searchServiceSelected}
          handleSearchEngineSelect={handleSearchEngineSelect}
          searchServices={searchServices}
        />
      )}
      <button type="submit" aria-label={t('submitSearch')} className={styles['search-btn']}>
        <SearchIcon size={22} />
      </button>
    </form>
  )
}
