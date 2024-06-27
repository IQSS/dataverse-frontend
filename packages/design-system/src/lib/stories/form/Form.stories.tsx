import type { Meta, StoryObj } from '@storybook/react'
import { Form } from '../../components/form/Form'
import { Col } from '../../components/grid/Col'
import { Row } from '../../components/grid/Row'
import { Button } from '../../components/button/Button'
import { Search } from 'react-bootstrap-icons'

/**
 * ## Description
 * A form is a collection of HTML elements used to gather user input. It allows users to enter data, such as text, numbers,
 * or file uploads, and submit it to a server for processing.
 *
 * ## Usage guidelines
 * ### Dos
 * - Input labels:
 *   - Each input field should have a label
 *   - Labels should be short and descriptive
 *   - They should be placed above the input field
 * - Input text:
 *  - If you need to describe an input text you can use the `Form.Group.Text` component
 *  - Add the text below the input
 * - Select:
 *  - First option should be the 'Select...' option
 *  - The options should use the `<option>` tag
 *
 * ### Don'ts
 * - Leave inputs without labels
 */
const meta: Meta<typeof Form> = {
  title: 'Form',
  component: Form,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof Form>

export const Default: Story = {
  render: () => (
    <Form>
      <Form.Group controlId="basic-form-username">
        <Form.Group.Label column sm={3}>
          Username
        </Form.Group.Label>

        <Col sm={9}>
          <Form.Group.Input type="text" placeholder="Username" />
        </Col>
      </Form.Group>
    </Form>
  )
}

export const AllInputTypes: Story = {
  render: () => (
    <Form>
      <Form.Group controlId="basic-form-username">
        <Form.Group.Label column sm={3}>
          Username
        </Form.Group.Label>
        <Col sm={9}>
          <Form.Group.Input type="text" placeholder="Username" />
        </Col>
      </Form.Group>
      <Form.Group controlId="basic-form-email">
        <Form.Group.Label column sm={3}>
          Email
        </Form.Group.Label>
        <Col sm={9}>
          <Form.Group.Input type="email" placeholder="Email" />
        </Col>
      </Form.Group>
      <Form.Group controlId="basic-form-password">
        <Form.Group.Label column sm={3}>
          Password
        </Form.Group.Label>
        <Col sm={9}>
          <Form.Group.Input type="password" placeholder="Password" />
        </Col>
      </Form.Group>
    </Form>
  )
}

export const FieldWithText: Story = {
  render: () => (
    <Form>
      <Form.Group controlId="basic-form-username">
        <Form.Group.Label column sm={3}>
          Username
        </Form.Group.Label>
        <Col sm={9}>
          <Form.Group.Input type="text" placeholder="Username" />
          <Form.Group.Text>
            Create a valid username of 2 to 60 characters in length containing letters (a-Z),
            numbers (0-9), dashes (-), underscores (_), and periods (.).
          </Form.Group.Text>
        </Col>
      </Form.Group>
    </Form>
  )
}

export const RequiredField: Story = {
  render: () => (
    <Form>
      <Form.Group controlId="basic-form-email">
        <Form.Group.Label column sm={3} required>
          Email
        </Form.Group.Label>
        <Col sm={9}>
          <Form.Group.Input type="email" placeholder="Email" aria-label="Disabled input example" />
        </Col>
      </Form.Group>
    </Form>
  )
}

export const FieldWithMessage: Story = {
  render: () => (
    <Form>
      <Form.Group controlId="basic-form-email">
        <Form.Group.Label message="This is your personal email" column sm={3}>
          Email
        </Form.Group.Label>
        <Col sm={9}>
          <Form.Group.Input type="email" placeholder="Email" aria-label="Disabled input example" />
        </Col>
      </Form.Group>
    </Form>
  )
}

export const ReadOnlyInput: Story = {
  render: () => (
    <Form>
      <Form.Group controlId="basic-form-email">
        <Form.Group.Label column sm={3}>
          Email
        </Form.Group.Label>
        <Col sm={9}>
          <Form.Group.Input type="email" readOnly defaultValue="text.email@example.com" />
        </Col>
      </Form.Group>
    </Form>
  )
}

export const DisabledInput: Story = {
  render: () => (
    <Form>
      <Form.Group controlId="basic-form-email">
        <Form.Group.Label column sm={3}>
          Email
        </Form.Group.Label>
        <Col sm={9}>
          <Form.Group.Input type="email" disabled defaultValue="text.email@example.com" />
        </Col>
      </Form.Group>
    </Form>
  )
}

export const InputWithPrefix: Story = {
  render: () => (
    <Form>
      <Form.Group controlId="basic-form-identifier">
        <Form.Group.Label column sm={3}>
          Identifier
        </Form.Group.Label>
        <Col sm={9}>
          <Form.InputGroup>
            <Form.InputGroup.Text>https://dataverse.org/</Form.InputGroup.Text>
            <Form.Group.Input type="text" placeholder="Identifier" aria-label="identifier" />
          </Form.InputGroup>
        </Col>
      </Form.Group>
    </Form>
  )
}

export const InputWithButton: Story = {
  render: () => (
    <Form>
      <Form.Group controlId="basic-form-search">
        <Form.InputGroup>
          <Form.Group.Input type="text" placeholder="Search..." aria-label="Search" />
          <Button variant="secondary" icon={<Search />} aria-label="Search submit" />
        </Form.InputGroup>
      </Form.Group>
    </Form>
  )
}

export const Select: Story = {
  render: () => (
    <Form>
      <Form.Group controlId="basic-form-select">
        <Form.Group.Label column sm={3}>
          Selector
        </Form.Group.Label>
        <Col sm={9}>
          <Form.Group.Select>
            <option>Select...</option>
            <option value="1">Option 1</option>
            <option value="2">Option 2</option>
            <option value="3">Option 3</option>
          </Form.Group.Select>
        </Col>
      </Form.Group>
    </Form>
  )
}

export const SelectAdvanced: Story = {
  render: () => (
    <Form>
      <Form.Group>
        <Form.Group.Label htmlFor="basic-form-select-advanced" column sm={3}>
          Hobbies
        </Form.Group.Label>
        <Col sm={9}>
          <Form.Group.SelectAdvanced
            initialOptions={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
            inputButtonId="basic-form-select-advanced"
          />
        </Col>
      </Form.Group>
    </Form>
  )
}

export const SelectAdvancedMultiple: Story = {
  render: () => (
    <Form>
      <Form.Group>
        <Form.Group.Label htmlFor="basic-form-select-advanced" column sm={3}>
          Hobbies
        </Form.Group.Label>
        <Col sm={9}>
          <Form.Group.SelectAdvanced
            isMultiple
            initialOptions={['Reading', 'Swimming', 'Running', 'Cycling', 'Cooking', 'Gardening']}
            inputButtonId="basic-form-select-advanced"
          />
        </Col>
      </Form.Group>
    </Form>
  )
}

export const TextArea: Story = {
  render: () => (
    <Form>
      <Form.Group controlId="basic-form-description">
        <Form.Group.Label column sm={3}>
          Description
        </Form.Group.Label>
        <Col sm={9}>
          <Form.Group.TextArea />
        </Col>
      </Form.Group>
    </Form>
  )
}
export const Checkbox: Story = {
  render: () => (
    <Form>
      <Form.CheckboxGroup title="Metadata Fields">
        <Form.Group.Checkbox
          defaultChecked
          name="metadata-field"
          label="Citation Metadata"
          id="basic-form-citation-metadata"
        />
        <Form.Group.Checkbox
          required
          name="metadata-field"
          label="Geospatial Metadata"
          id="basic-form-geospatial-metadata"
        />
        <Form.Group.Checkbox
          name="metadata-field"
          label="Social Science and Humanities Metadata"
          id="basic-form-social-science-metadata"
        />
      </Form.CheckboxGroup>
    </Form>
  )
}

export const GroupWithMultipleFields: Story = {
  render: () => (
    <Form>
      <Form.GroupWithMultipleFields
        title="Related Publication"
        message="The article or report that uses the data in the Dataset. The full list of related publications will be displayed on the metadata tab">
        <Row>
          <Form.Group as={Col} controlId="basic-form-citation">
            <Form.Group.Label message="The full bibliographic citation for the related publication">
              Citation
            </Form.Group.Label>
            <Form.Group.TextArea />
          </Form.Group>
        </Row>
        <Row>
          <Form.Group as={Col} controlId="basic-form-identifier-type">
            <Form.Group.Label message="The type of identifier that uniquely identifies a related publication">
              Identifier Type
            </Form.Group.Label>
            <Form.Group.Select>
              <option>Select...</option>
              <option value="doi">doi</option>
              <option value="isbn">isbn</option>
              <option value="url">url</option>
            </Form.Group.Select>
          </Form.Group>
          <Form.Group as={Col} controlId="basic-form-identifier">
            <Form.Group.Label message="The identifier for a related publication">
              Identifier
            </Form.Group.Label>
            <Form.Group.Input type="text" />
          </Form.Group>
        </Row>
        <Row>
          <Form.Group as={Col} controlId="basic-form-url" sm={6}>
            <Form.Group.Label message="The URL form of the identifier entered in the Identifier field, e.g. the DOI URL if a DOI was entered in the Identifier field. Used to display what was entered in the ID Type and ID Number fields as a link. If what was entered in the Identifier field has no URL form, the URL of the publication webpage is used, e.g. a journal article webpage">
              URL
            </Form.Group.Label>
            <Form.Group.Input type="text" placeholder="https://" />
          </Form.Group>
        </Row>
      </Form.GroupWithMultipleFields>
    </Form>
  )
}

export const FormValidation: Story = {
  render: () => (
    <Form>
      <Form.GroupWithMultipleFields
        title="Author"
        required
        message="The entity, e.g. a person or organization, that created the Dataset">
        <Row>
          <Form.Group as={Col} controlId="basic-form-name">
            <Form.Group.Label
              message="The name of the author, such as the person's name or the name of an organization"
              required>
              Name
            </Form.Group.Label>
            <Form.Group.Input type="text" placeholder="Name" isInvalid={true} />
          </Form.Group>
          <Form.Group as={Col} controlId="basic-form-affiliation">
            <Form.Group.Label
              message="The name of the entity affiliated with the author, e.g. an organization's name"
              required>
              Affiliation
            </Form.Group.Label>
            <Form.Group.Input type="text" placeholder="Affiliation" isInvalid={true} />
            <Form.Group.Feedback type="invalid">Please provide an affiliation</Form.Group.Feedback>
          </Form.Group>
        </Row>
        <Row>
          <Form.Group as={Col} controlId="basic-form-identifier-type">
            <Form.Group.Label message="The type of identifier that uniquely identifies the author (e.g. ORCID, ISNI)">
              Identifier Type
            </Form.Group.Label>
            <Form.Group.Select isValid>
              <option>Select...</option>
              <option value="1">Option 1</option>
              <option value="2">Option 2</option>
              <option value="3">Option 3</option>
            </Form.Group.Select>
          </Form.Group>
          <Form.Group as={Col} controlId="basic-form-identifier">
            <Form.Group.Label
              message="Uniquely identifies the author when paired with an identifier type"
              required>
              Identifier
            </Form.Group.Label>
            <Form.Group.Input type="text" placeholder="Identifier" defaultValue="123456" isValid />
          </Form.Group>
        </Row>
      </Form.GroupWithMultipleFields>
    </Form>
  )
}
