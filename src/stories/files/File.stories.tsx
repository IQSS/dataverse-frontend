import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../WithI18next'
import { FileMockRepository } from './FileMockRepository'
import { File } from '../../sections/file/File'
import { WithLayout } from '../WithLayout'
import { FileMockLoadingRepository } from './FileMockLoadingRepository'
import { FileMockNoDataRepository } from './FileMockNoDataRepository'

const meta: Meta<typeof File> = {
  title: 'Pages/File',
  component: File,
  decorators: [WithI18next, WithLayout]
}

export default meta
type Story = StoryObj<typeof File>

export const Default: Story = {
  render: () => <File repository={new FileMockRepository()} id={56} />
}

export const Loading: Story = {
  render: () => <File repository={new FileMockLoadingRepository()} id={56} />
}

export const FileNotFound: Story = {
  render: () => <File repository={new FileMockNoDataRepository()} id={56} />
}
