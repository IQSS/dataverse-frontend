import type { Meta, StoryObj } from '@storybook/react'
import { DatasetTemplatePreviewModal } from '@/sections/templates/dataset-template-preview-modal/DatasetTemplatePreviewModal'
import { WithI18next } from '../WithI18next'
import { TemplateMockRepository } from './TemplateMockRepository'
import { MetadataBlockInfoMockRepository } from '../shared-mock-repositories/metadata-block-info/MetadataBlockInfoMockRepository'
import { Template } from '@/templates/domain/models/Template'

const meta: Meta<typeof DatasetTemplatePreviewModal> = {
  title: 'Sections/Templates/DatasetTemplatePreviewModal',
  component: DatasetTemplatePreviewModal,
  decorators: [WithI18next],
  parameters: {
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}
export default meta

type Story = StoryObj<typeof DatasetTemplatePreviewModal>

class TemplateLoadingMockRepository extends TemplateMockRepository {
  getTemplate(_templateId: number): Promise<Template> {
    return new Promise(() => {})
  }
}

export const Default: Story = {
  render: () => (
    <DatasetTemplatePreviewModal
      show={true}
      handleClose={() => {}}
      templateId={1}
      templateName="Template"
      templateRepository={new TemplateMockRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
    />
  )
}

export const Loading: Story = {
  render: () => (
    <DatasetTemplatePreviewModal
      show={true}
      handleClose={() => {}}
      templateId={1}
      templateName="Template"
      templateRepository={new TemplateLoadingMockRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
    />
  )
}
