import { useState } from 'react'
import { Button, Form } from '@iqss/dataverse-design-system'
import { Search } from 'react-bootstrap-icons'
import { QueryParamKey, Route } from '../../../Route.enum'
import styles from './SearchPanel.module.scss'

export const SearchPanel = () => {
  const [searchValue, setSearchValue] = useState('')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedSearchValue = searchValue.trim()

    if (!trimmedSearchValue) return

    console.log({ trimmedSearchValue })

    // const encodedSearchValue = encodeURIComponent(trimmedSearchValue)

    // const searchParams = new URLSearchParams()
    // searchParams.set(QueryParamKey.QUERY, encodedSearchValue)
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value)
  }

  return (
    <div className={styles['search-panel']}>
      <form onSubmit={handleSubmit} className={styles['search-form']} role="search">
        <Form.InputGroup className={styles['search-input-group']}>
          <Form.Group.Input
            type="text"
            placeholder="Search this collection..."
            aria-label="Search"
            value={searchValue}
            onChange={handleSearchChange}
          />
          <Button variant="secondary" icon={<Search />} aria-label="Search submit" />
        </Form.InputGroup>
      </form>
      <Button variant="link" className={styles['advanced-search-btn']} disabled>
        Advanced Search
      </Button>
    </div>
  )
}
