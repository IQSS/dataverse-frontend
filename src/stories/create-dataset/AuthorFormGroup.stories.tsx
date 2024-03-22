import type { StoryObj, Meta } from '@storybook/react'
import { WithLayout } from '../WithLayout'
import { WithI18next } from '../WithI18next'
import { AuthorFormGroup } from '../../sections/create-dataset/AuthorFormGroup'
import { SubmissionStatus } from '../../sections/create-dataset/useCreateDatasetForm'
import { initialState } from '../../sections/create-dataset/useDatasetValidator'
import { DatasetMetadataSubField } from '../../dataset/domain/models/Dataset'

const meta: Meta<typeof AuthorFormGroup> = {
  title: 'Pages/Create Dataset/Author Form Group',
  component: AuthorFormGroup,
  decorators: [WithI18next, WithLayout]
}
export default meta
type Story = StoryObj<typeof AuthorFormGroup>

export const Default: Story = {
  render: () => (
    <AuthorFormGroup
      submissionStatus={SubmissionStatus.NotSubmitted}
      updateFormData={() => {}}
      initialAuthorFields={
        initialState.metadataBlocks[0].fields['author'] as DatasetMetadataSubField[]
      }
    />
  )
}
