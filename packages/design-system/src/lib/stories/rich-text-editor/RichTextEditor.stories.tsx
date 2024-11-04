import type { Meta, StoryObj } from '@storybook/react'
import { RichTextEditor } from '../../components/rich-text-editor/RichTextEditor'
import { Form } from '../../components/form/Form'
import { Col } from '../../components/grid/Col'

/**
 * ## Description
 * The rich text editor component is a user interface element that allows users to input and format text content using
 * a variety of tools and options.

 * ## Usage guidelines
  * The rich text editor component should be used when there is a need to allow users to input and format text content in
  * a more flexible and customizable way.
  *
  * You can keep track of the content changes by using the `onChange` prop. It will return the HTML content of the editor.
  *
  * You can also set an initial value using the `initialValue` prop.
  *
  * You can disable the editor by using the `disabled` prop.
  *
  * You can customize the locales of the editor by using the `locales` prop.
 */

const meta: Meta<typeof RichTextEditor> = {
  title: 'Rich Text Editor',
  component: RichTextEditor,
  tags: ['autodocs']
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

export const WithNotDefaultLocales: Story = {
  render: () => (
    <RichTextEditor
      onChange={handleChange}
      locales={{
        linkDialog: {
          title: 'Inserte un enlace',
          ok: 'Aceptar',
          cancel: 'Cancelar'
        }
      }}
    />
  )
}

export const Disabled: Story = {
  render: () => <RichTextEditor onChange={handleChange} disabled />
}

export const WithLabel: Story = {
  render: () => (
    <Form.Group as={Col}>
      <Form.Group.Label id="label-id">Dataset Description</Form.Group.Label>
      <Col>
        <RichTextEditor editorContentAriaLabelledBy="label-id" onChange={handleChange} />
      </Col>
    </Form.Group>
  )
}
