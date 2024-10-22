import type { Meta, StoryObj } from '@storybook/react'
import { RichTextEditor } from '../../components/rich-text-editor/RichTextEditor'

const meta: Meta<typeof RichTextEditor> = {
  title: 'RichTextEditor',
  component: RichTextEditor
}

export default meta
type Story = StoryObj<typeof RichTextEditor>

const handleChange = (value: string) => {
  console.log({ value })
}

export const Default: Story = {
  render: () => <RichTextEditor onChange={handleChange} />
}

export const WithInitialValue: Story = {
  render: () => (
    <RichTextEditor
      initialValue="<p>Hello <strong>Dataverse</strong> <em>new </em><s>rick</s> <strong>rich</strong> <em>text</em> <code>editor</code>!</p>"
      onChange={handleChange}
    />
  )
}

export const Disabled: Story = {
  render: () => <RichTextEditor onChange={handleChange} disabled />
}
