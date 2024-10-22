import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import { EditorActions } from './EditorActions'
import './RichTextEditor.scss'

export interface RichTextFieldProps {
  initialValue?: string | undefined
  onChange: (value: string) => void
  error?: string
  disabled?: boolean
}

export const RichTextEditor = ({ initialValue, onChange, disabled }: RichTextFieldProps) => {
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
      })
    ],
    content: initialValue,
    editorProps: {
      attributes: {
        class: 'rich-text-editor-content'
      }
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML())
  })

  useEffect(() => {
    if (editor) editor.setEditable(disabled ? false : true, false)
  }, [disabled, editor])

  if (!editor) return null

  return (
    <div className="rich-text-editor-wrapper">
      <EditorActions editor={editor} disabled={disabled} />
      <div className="editor-content-wrapper">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
