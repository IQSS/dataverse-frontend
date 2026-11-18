import type { StoryObj, Meta } from '@storybook/react'
import { Form } from '@iqss/dataverse-design-system'
import { AffiliationField } from '@/sections/sign-up/builtin-sign-up-form/AffiliationField'
import { WithI18next } from '../WithI18next'

const meta: Meta<typeof AffiliationField> = {
  title: 'Sections/Sign Up/Affiliation Field',
  component: AffiliationField,
  decorators: [
    WithI18next,
    function WithAffiliationLabel(Story) {
      return (
        <Form.Group controlId="affiliation">
          <Form.Group.Label>Affiliation</Form.Group.Label>
          <Story />
        </Form.Group>
      )
    }
  ],
  args: {
    value: 'Harvard University',
    rorId: '',
    isInvalid: false,
    inputRef: null,
    onChange: () => {}
  }
}
export default meta
type Story = StoryObj<typeof AffiliationField>

export const FreeText: Story = {}

export const WithRorFromOrcid: Story = {
  args: { rorId: 'https://ror.org/03vek6s52' }
}

export const Invalid: Story = {
  args: {
    value: 'A'.repeat(256),
    isInvalid: true,
    errorMessage: 'Affiliation must be at most 255 characters.'
  }
}
