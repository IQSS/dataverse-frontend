import { ForwardedRef, forwardRef } from 'react'
import cn from 'classnames'
import { Dropdown } from 'react-bootstrap'
import { CaretDownFill, Search as SearchIcon, Stars as StarsIcon } from 'react-bootstrap-icons'
import { SearchService } from '@/search/domain/models/SearchService'
import { SOLR_SERVICE_NAME } from './SearchInput'
import styles from './SearchInput.module.scss'

// TODO:ME - Don't use react-boostrap, move to dataverse-design-system and first check a11ty

interface SearchDropdownProps {
  searchServices: SearchService[]
  searchEngineSelected: string
  handleSearchEngineSelect: (eventKey: string | null) => void
  position?: 'left' | 'right'
}

export const SearchDropdown = ({
  searchServices,
  searchEngineSelected,
  handleSearchEngineSelect,
  position
}: SearchDropdownProps) => {
  // Sort the search services to show the Solr service first
  const searchServicesWithSolrFirst = [...searchServices].sort((a, b) => {
    if (a.name === SOLR_SERVICE_NAME) return -1
    if (b.name === SOLR_SERVICE_NAME) return 1
    return 0
  })

  return (
    <Dropdown
      className={styles['search-dropdown']}
      align={position === 'left' ? 'start' : 'end'}
      onSelect={handleSearchEngineSelect}>
      <Dropdown.Toggle as={CustomToggle} position={position} />

      <Dropdown.Menu className={styles['search-dropdown-menu']}>
        <Dropdown.Header>Search Engines</Dropdown.Header>
        {searchServicesWithSolrFirst.map((service) => {
          const isSolrService = service.name === SOLR_SERVICE_NAME

          return (
            <Dropdown.Item
              eventKey={service.name}
              active={searchEngineSelected === service.name}
              className={styles['search-dropdown-item']}
              key={service.name}>
              {isSolrService ? <SearchIcon size={12} /> : <StarsIcon size={12} />}
              {service.displayName}
            </Dropdown.Item>
          )
        })}
      </Dropdown.Menu>
    </Dropdown>
  )
}

interface CustomToggleProps {
  onClick: (event: React.MouseEvent<HTMLElement>) => void
  position?: 'left' | 'right'
}

const CustomToggle = forwardRef(({ onClick, position }: CustomToggleProps, ref) => (
  <button
    type="button"
    ref={ref as ForwardedRef<HTMLButtonElement>}
    onClick={(e) => {
      e.preventDefault()
      onClick(e)
    }}
    className={cn(styles['search-dropdown-btn'], {
      [styles['on-the-left']]: position === 'left',
      [styles['on-the-right']]: position === 'right'
    })}>
    <CaretDownFill size={14} />
  </button>
))

CustomToggle.displayName = 'CustomToggle'
