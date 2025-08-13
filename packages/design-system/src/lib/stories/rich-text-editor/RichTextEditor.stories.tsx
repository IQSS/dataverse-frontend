import type { Meta, StoryObj } from '@storybook/react'
import {
  RichTextEditor,
  RichTextEditorCustomClasses
} from '../../components/rich-text-editor/RichTextEditor'
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
export const WithAllFormats: Story = {
  render: () => (
    <RichTextEditor
      initialValue={
        '<h1 class="rte-heading">Heading 1</h1><h2 class="rte-heading">Heading 2</h2><h3 class="rte-heading">Heading 3</h3><p class="rte-paragraph">Hello <strong class="rte-bold">Dataverse</strong> <em class="rte-italic">new </em><s class="rte-strike">rick</s> <strong class="rte-bold">rich</strong> <em class="rte-italic">text</em> <code class="rte-code">editor</code>! This is a <a target="_blank" rel="noopener noreferrer nofollow" class="rte-link" href="https://beta.dataverse.org/spa/">link</a>.</p><ul class="rte-bullet-list"><li><p class="rte-paragraph">Item</p></li><li><p class="rte-paragraph">Item</p></li></ul><ol class="rte-ordered-list"><li><p class="rte-paragraph">Item 1</p></li><li><p class="rte-paragraph">Item 2</p></li></ol><pre class="rte-code-block"><code class="language-typescriptreact">onUpdate: ({ editor }) =&gt; onChange &amp;&amp; onChange(editor.getHTML())</code></pre><blockquote class="rte-blockquote"><p class="rte-paragraph">This is a blockquoute</p></blockquote><img src="https://picsum.photos/id/237/200/300" alt="A random image from picsum" class="rte-img rte-w-25">'
      }
      onChange={handleChange}
    />
  )
}

export const WithImagesAlignedToTheLeftCenterAndRight: Story = {
  render: () => {
    const imageLeft = `<img src="https://picsum.photos/id/237/200/300" alt="Foo" class="rte-img rte-w-15 ${RichTextEditorCustomClasses.IMAGE_ALIGN_LEFT}">`
    const imageCenter = `<img src="https://picsum.photos/id/237/200/300" alt="Foo" class="rte-img rte-w-15 ${RichTextEditorCustomClasses.IMAGE_ALIGN_CENTER}">`
    const imageRight = `<img src="https://picsum.photos/id/237/200/300" alt="Foo" class="rte-img rte-w-15 ${RichTextEditorCustomClasses.IMAGE_ALIGN_RIGHT}">`

    return (
      <RichTextEditor initialValue={imageLeft + imageCenter + imageRight} onChange={handleChange} />
    )
  }
}

export const WithImagesResizedDifferently: Story = {
  render: () => {
    const imageLeft =
      '<img src="https://picsum.photos/id/237/200/300" alt="Foo" class="rte-img rte-w-15">'
    const imageCenter =
      '<img src="https://picsum.photos/id/237/200/300" alt="Foo" class="rte-img rte-w-30">'
    const imageRight =
      '<img src="https://picsum.photos/id/237/200/300" alt="Foo" class="rte-img rte-w-40">'

    return (
      <RichTextEditor initialValue={imageLeft + imageCenter + imageRight} onChange={handleChange} />
    )
  }
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

export const WithError: Story = {
  render: () => (
    <Form.Group as={Col}>
      <Form.Group.Label id="label-id">Dataset Description</Form.Group.Label>
      <Col>
        <RichTextEditor editorContentAriaLabelledBy="label-id" onChange={handleChange} invalid />
        <Form.Group.Feedback type="invalid">Content is required</Form.Group.Feedback>
      </Col>
    </Form.Group>
  )
}
