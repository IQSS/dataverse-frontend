import type { Meta, StoryObj } from '@storybook/react'
import { EditTemplateTerms } from '@/sections/templates/edit-template-terms'
import { WithLayout } from '../WithLayout'
import { WithI18next } from '../WithI18next'
import { WithLoggedInUser } from '../WithLoggedInUser'
import { TemplateMockRepository } from './TemplateMockRepository'
import { Template } from '@/dataset/domain/models/DatasetTemplate'

const meta: Meta<typeof EditTemplateTerms> = {
  title: 'Pages/Edit Template Terms',
  component: EditTemplateTerms,
  decorators: [WithI18next, WithLayout, WithLoggedInUser],
  parameters: {
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}
export default meta

type Story = StoryObj<typeof EditTemplateTerms>

class TemplateLoadingMockRepository extends TemplateMockRepository {
  getTemplate(_templateId: number): Promise<Template> {
    return new Promise(() => {})
  }
}

export const Default: Story = {
  render: () => (
    <EditTemplateTerms
      collectionId="root"
      templateId={1}
      templateRepository={new TemplateMockRepository()}
    />
  )
}

export const Loading: Story = {
  render: () => (
    <EditTemplateTerms
      collectionId="root"
      templateId={1}
      templateRepository={new TemplateLoadingMockRepository()}
    />
  )
}
