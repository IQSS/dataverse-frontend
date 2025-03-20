import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import { VersionDetailModal } from '../../../sections/dataset/dataset-versions/view-difference/DatasetVersionsDetailModal'
import { DatasetVersionDiffMother } from '../../../../tests/component/dataset/domain/models/DatasetVersionDiffMother'
const versionsDiff = DatasetVersionDiffMother.create()
const meta: Meta<typeof VersionDetailModal> = {
  title: 'Sections/Dataset Page/DatasetVersions/VersionDetailModal',
  component: VersionDetailModal,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof VersionDetailModal>

export const Default: Story = {
  render: () => (
    <VersionDetailModal
      show={true}
      handleClose={() => {}}
      isLoading={false}
      errorHandling={null}
      datasetVersionDifferences={versionsDiff}
    />
  )
}

// export const Loading: Story = {
//   render: () => <DatasetVersionsDetailModal />
// }
