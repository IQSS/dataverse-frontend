import { Button, Form } from 'dataverse-design-system'
import { Search } from 'react-bootstrap-icons'

export function FileCriteriaSearchText() {
  return (
    <Form.Group controlId="search-files">
      <Form.InputGroup>
        <Form.Group.Input
          type="text"
          placeholder="Search this dataset..."
          aria-label="Search this dataset"
        />
        <Button variant="secondary" icon={<Search />} aria-label="Submit search" />
      </Form.InputGroup>
    </Form.Group>
  )
}
