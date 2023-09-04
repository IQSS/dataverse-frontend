import { Button, Form } from '@iqss/dataverse-design-system'
import { Search } from 'react-bootstrap-icons'
import { FileCriteria } from '../../../../files/domain/models/FileCriteria'
import { ChangeEvent, useState, KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'

interface FileCriteriaSearchTextProps {
  criteria: FileCriteria
  onCriteriaChange: (criteria: FileCriteria) => void
}
export function FileCriteriaSearchText({
  criteria,
  onCriteriaChange
}: FileCriteriaSearchTextProps) {
  const { t } = useTranslation('files')
  const [searchText, setSearchText] = useState<string>(criteria.searchText ?? '')
  const handleSearchTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const updatedSearchText = event.target.value
    setSearchText(updatedSearchText)
  }
  const handleSubmitSearch = () => {
    onCriteriaChange(criteria.withSearchText(searchText))
  }
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleSubmitSearch()
    }
  }

  return (
    <Form.Group controlId="search-files">
      <Form.InputGroup>
        <Form.Group.Input
          type="text"
          placeholder={t('criteria.searchText.placeholder')}
          aria-label={t('criteria.searchText.label')}
          defaultValue={searchText}
          onChange={handleSearchTextChange}
          onKeyDown={handleKeyDown}
        />
        <Button
          variant="secondary"
          icon={<Search />}
          aria-label={t('criteria.searchText.submit')}
          onClick={handleSubmitSearch}
        />
      </Form.InputGroup>
    </Form.Group>
  )
}
