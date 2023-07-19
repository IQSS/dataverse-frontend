import { Button, Col, Form, Row } from 'dataverse-design-system'
import { Search } from 'react-bootstrap-icons'

interface FilesSearchProps {
  filesCountTotal: number
}

const MINIMUM_FILES_TO_SHOW_SEARCH_INPUT = 2
export function FilesSearch({ filesCountTotal }: FilesSearchProps) {
  if (filesCountTotal < MINIMUM_FILES_TO_SHOW_SEARCH_INPUT) {
    return <></>
  }
  return (
    <Row>
      <Col md={5}>
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
      </Col>
    </Row>
  )
}
