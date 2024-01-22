import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import { FileCitation } from '../../../sections/file/file-citation/FileCitation'
import { FileCitationMother } from '../../../../tests/component/files/domain/models/FileMother'
import { DatasetVersionMother } from '../../../../tests/component/dataset/domain/models/DatasetMother'

const meta: Meta<typeof FileCitation> = {
  title: 'Sections/File Page/FileCitation',
  component: FileCitation,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof FileCitation>

export const Default: Story = {
  render: () => (
    <>
      <br></br>
      <br></br>
      <FileCitation
        citation={FileCitationMother.create('File Title')}
        datasetVersion={DatasetVersionMother.createReleased()}
      />
    </>
  )
}

export const Draft: Story = {
  render: () => (
    <>
      <br></br>
      <br></br>
      <FileCitation
        citation={FileCitationMother.createDraft('File Title')}
        datasetVersion={DatasetVersionMother.createDraft()}
      />
    </>
  )
}

export const Deaccessioned: Story = {
  render: () => (
    <>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <FileCitation
        citation={FileCitationMother.createDeaccessioned('File Title')}
        datasetVersion={DatasetVersionMother.createDeaccessioned()}
      />
    </>
  )
}
