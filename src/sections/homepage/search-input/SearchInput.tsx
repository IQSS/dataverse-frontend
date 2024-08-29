import { Form } from '@iqss/dataverse-design-system'
import styles from './SearchInput.module.scss'
import { Search as SearchIcon } from 'react-bootstrap-icons'

export const SearchInput = () => {
  return (
    <div className={styles['search-input-wrapper']}>
      <div className={styles['search-icon-wrapper']}>
        <SearchIcon size={22} />
      </div>
      <Form.Group.Input
        type="text"
        role="search"
        aria-label="Search"
        autoFocus
        autoComplete="off"
        className={styles['text-input']}
      />
    </div>
  )
}
