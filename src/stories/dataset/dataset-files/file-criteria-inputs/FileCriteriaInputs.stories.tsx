import { Meta, StoryObj } from '@storybook/react'
import { FileCriteriaInputs } from '../../../../sections/dataset/dataset-files/file-criteria-inputs/FileCriteriaInputs'
import { WithI18next } from '../../../WithI18next'

const meta: Meta<typeof FileCriteriaInputs> = {
  title: 'Sections/Dataset Page/DatasetFiles/FilesTable/FileCriteriaInputs',
  component: FileCriteriaInputs,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof FileCriteriaInputs>

export const Default: Story = {
  render: () => <FileCriteriaInputs onCriteriaChange={() => {}} />
}
