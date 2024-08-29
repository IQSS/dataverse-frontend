import { useRef, useState } from 'react'
import { Form } from '@iqss/dataverse-design-system'
import { CloseButton } from 'react-bootstrap'
import { Search as SearchIcon } from 'react-bootstrap-icons'
import styles from './SearchInput.module.scss'

export const SearchInput = () => {
  const inputSearchRef = useRef<HTMLInputElement>(null)
  const [searchValue, setSearchValue] = useState('')

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log('Search:', searchValue)
  }

  const handleClearSearch = () => {
    setSearchValue('')
    inputSearchRef.current?.focus()
  }

  return (
    <Form onSubmit={handleSubmit} className={styles['search-input-wrapper']}>
      <Form.Group.Input
        type="text"
        role="search"
        aria-label="Search"
        autoFocus
        autoComplete="off"
        className={styles['text-input']}
        value={searchValue}
        onChange={handleSearchChange}
        ref={inputSearchRef}
      />
      {searchValue && (
        <CloseButton
          aria-label="Clear search"
          className={styles['clear-btn']}
          onClick={handleClearSearch}
        />
      )}

      <button type="submit" aria-label="Submit Search" className={styles['search-btn']}>
        <SearchIcon size={22} />
      </button>
    </Form>
  )
}
