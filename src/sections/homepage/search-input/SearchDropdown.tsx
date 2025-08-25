import { ForwardedRef, forwardRef } from 'react'
import { useTranslation } from 'react-i18next'
import { CaretDownFill, Search as SearchIcon, Stars as StarsIcon } from 'react-bootstrap-icons'
import { DropdownButton, DropdownButtonItem, DropdownHeader } from '@iqss/dataverse-design-system'
import { SearchService } from '@/search/domain/models/SearchService'
import { SOLR_SERVICE_NAME } from './SearchInput'
import styles from './SearchInput.module.scss'

interface SearchDropdownProps {
  searchServices: SearchService[]
  searchServiceSelected: string
  handleSearchEngineSelect: (eventKey: string | null) => void
}

export const SearchDropdown = ({
  searchServices,
  searchServiceSelected,
  handleSearchEngineSelect
}: SearchDropdownProps) => {
  const { t } = useTranslation('homepage')
  // Sort the search services to show the Solr service first
  const searchServicesWithSolrFirst = [...searchServices].sort((a, b) => {
    if (a.name === SOLR_SERVICE_NAME) return -1
    if (b.name === SOLR_SERVICE_NAME) return 1
    return 0
  })

  return (
    <DropdownButton
      id="search-dropdown"
      onSelect={handleSearchEngineSelect}
      customToggle={CustomToggle}
      customToggleClassname={styles['search-dropdown']}
      customToggleMenuClassname={styles['search-dropdown-menu']}
      align="end">
      <DropdownHeader>{t('searchDropdown.header')}</DropdownHeader>
      {searchServicesWithSolrFirst.map((service) => {
        const isSolrService = service.name === SOLR_SERVICE_NAME

        return (
          <DropdownButtonItem
            eventKey={service.name}
            active={searchServiceSelected === service.name}
            className={styles['search-dropdown-item']}
            as="button"
            type="button"
            key={service.name}>
            {isSolrService ? <SearchIcon size={12} /> : <StarsIcon size={12} />}
            {service.displayName}
          </DropdownButtonItem>
        )
      })}
    </DropdownButton>
  )
}

interface CustomToggleProps {
  onClick: (event: React.MouseEvent<HTMLElement>) => void
}

const CustomToggle = forwardRef(({ onClick }: CustomToggleProps, ref) => {
  const { t } = useTranslation('homepage')
  return (
    <button
      type="button"
      aria-label={t('searchDropdown.buttonLabel')}
      ref={ref as ForwardedRef<HTMLButtonElement>}
      onClick={(e) => {
        e.preventDefault()
        onClick(e)
      }}
      className={styles['search-dropdown-btn']}>
      <CaretDownFill size={14} />
    </button>
  )
})

CustomToggle.displayName = 'CustomToggle'
