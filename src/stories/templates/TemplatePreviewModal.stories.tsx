import type { Meta, StoryObj } from '@storybook/react'
import { TemplatePreviewModal } from '@/sections/templates/template-preview-modal/TemplatePreviewModal'
import { WithI18next } from '../WithI18next'
import { TemplateMockRepository } from './TemplateMockRepository'
import { MetadataBlockInfoMockRepository } from '../shared-mock-repositories/metadata-block-info/MetadataBlockInfoMockRepository'
import { Template } from '@/templates/domain/models/Template'
import { TemplateMother } from '@tests/component/sections/templates/TemplateMother'

const meta: Meta<typeof TemplatePreviewModal> = {
  title: 'Sections/Templates/TemplatePreviewModal',
  component: TemplatePreviewModal,
  decorators: [WithI18next],
  parameters: {
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}
export default meta

type Story = StoryObj<typeof TemplatePreviewModal>

class TemplateLoadingMockRepository extends TemplateMockRepository {
  getTemplate(_templateId: number): Promise<Template> {
    return new Promise(() => {})
  }
}

export const Default: Story = {
  render: () => (
    <TemplatePreviewModal
      show={true}
      handleClose={() => {}}
      templateId={1}
      templateName={'Template'}
      templateRepository={new TemplateMockRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
    />
  )
}

export const Loading: Story = {
  render: () => (
    <TemplatePreviewModal
      show={true}
      handleClose={() => {}}
      templateId={1}
      templateName={'Template'}
      templateRepository={new TemplateLoadingMockRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
    />
  )
}

class TemplateWithCustomInstructionsMockRepository extends TemplateMockRepository {
  getTemplate(_templateId: number): Promise<Template> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          TemplateMother.create({
            datasetMetadataBlocks: [
              {
                name: 'citation',
                fields: {
                  title: 'Test Title'
                }
              }
            ],
            instructions: [
              {
                instructionField: 'title',
                instructionText: 'instruction for title field'
              }
            ]
          })
        )
      }, 1_000)
    })
  }
}

export const WithCustomInstructions: Story = {
  render: () => (
    <TemplatePreviewModal
      show={true}
      handleClose={() => {}}
      templateId={1}
      templateName={'Template'}
      templateRepository={new TemplateWithCustomInstructionsMockRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
    />
  )
}
