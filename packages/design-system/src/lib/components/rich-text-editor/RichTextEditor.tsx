import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import CodeBlock from '@tiptap/extension-code-block'
import Placeholder from '@tiptap/extension-placeholder'
import { EditorActions } from './EditorActions'
import { richTextEditorDefaultLocales, RichTextEditorLocales } from './defaultLocales'
import './RichTextEditor.scss'

export interface RichTextEditorProps {
  initialValue?: string | undefined
  onChange?: (value: string) => void
  error?: string
  disabled?: boolean
  locales?: RichTextEditorLocales
  editorContentId?: string
}

export const RichTextEditor = ({
  initialValue,
  onChange,
  disabled,
  locales,
  editorContentId
}: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        }
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true
      }),
      CodeBlock,
      Placeholder.configure({
        placeholder: locales?.placeholder ?? richTextEditorDefaultLocales.placeholder
      })
    ],
    content: initialValue,
    editorProps: {
      attributes: {
        id: editorContentId || 'rich-text-editor-content',
        class: 'rich-text-editor-content'
      }
    },
    onUpdate: ({ editor }) => onChange && onChange(editor.getHTML())
  })

  useEffect(() => {
    if (editor) editor.setEditable(disabled ? false : true, false)
  }, [disabled, editor])

  return (
    <div className="rich-text-editor-wrapper">
      <EditorActions editor={editor} disabled={disabled} locales={locales} />
      <div className="editor-content-wrapper">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
