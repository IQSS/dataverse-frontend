import { forwardRef, RefObject, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { EditorActions } from './EditorActions'
import { richTextEditorDefaultLocales, RichTextEditorLocales } from './defaultLocales'
import './RichTextEditor.scss'

export enum RichTextEditorCustomClasses {
  HEADING = 'rte-heading',
  PARAGRAPH = 'rte-paragraph',
  BOLD = 'rte-bold',
  ITALIC = 'rte-italic',
  STRIKE = 'rte-strike',
  BULLET_LIST = 'rte-bullet-list',
  ORDERED_LIST = 'rte-ordered-list',
  CODE = 'rte-code',
  CODE_BLOCK = 'rte-code-block',
  BLOCKQUOTE = 'rte-blockquote',
  UNDERLINE = 'rte-underline',
  LINK = 'rte-link'
}

export interface RichTextEditorProps {
  initialValue?: string | undefined
  onChange?: (value: string) => void
  error?: string
  disabled?: boolean
  locales?: RichTextEditorLocales
  editorContentId?: string
  editorContentAriaLabelledBy?: string
  invalid?: boolean
  ariaRequired?: boolean
}

export const RichTextEditor = forwardRef(
  (
    {
      initialValue,
      onChange,
      disabled,
      locales,
      editorContentId,
      editorContentAriaLabelledBy,
      invalid,
      ariaRequired
    }: RichTextEditorProps,
    ref
  ) => {
    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [1, 2, 3],
            HTMLAttributes: {
              class: RichTextEditorCustomClasses.HEADING
            }
          },
          paragraph: {
            HTMLAttributes: {
              class: RichTextEditorCustomClasses.PARAGRAPH
            }
          },
          bold: {
            HTMLAttributes: {
              class: RichTextEditorCustomClasses.BOLD
            }
          },
          italic: {
            HTMLAttributes: {
              class: RichTextEditorCustomClasses.ITALIC
            }
          },
          strike: {
            HTMLAttributes: {
              class: RichTextEditorCustomClasses.STRIKE
            }
          },
          bulletList: {
            HTMLAttributes: {
              class: RichTextEditorCustomClasses.BULLET_LIST
            }
          },
          orderedList: {
            HTMLAttributes: {
              class: RichTextEditorCustomClasses.ORDERED_LIST
            }
          },
          code: {
            HTMLAttributes: {
              class: RichTextEditorCustomClasses.CODE
            }
          },
          codeBlock: {
            HTMLAttributes: {
              class: RichTextEditorCustomClasses.CODE_BLOCK
            }
          },
          blockquote: {
            HTMLAttributes: {
              class: RichTextEditorCustomClasses.BLOCKQUOTE
            }
          }
        }),
        Underline.configure({
          HTMLAttributes: {
            class: RichTextEditorCustomClasses.UNDERLINE
          }
        }),
        Link.configure({
          openOnClick: false,
          autolink: true,
          linkOnPaste: true,
          HTMLAttributes: {
            class: RichTextEditorCustomClasses.LINK
          }
        }),
        Placeholder.configure({
          placeholder: locales?.placeholder ?? richTextEditorDefaultLocales.placeholder
        })
      ],
      content: initialValue,
      editorProps: {
        attributes: {
          class: 'rich-text-editor-content',
          ...(editorContentId && { id: editorContentId }),
          ...(editorContentAriaLabelledBy && { 'aria-labelledby': editorContentAriaLabelledBy }),
          ...(disabled && { disabled: 'true' }),
          ...(ariaRequired && { 'aria-required': 'true' })
        }
      },
      onUpdate: ({ editor }) => onChange && onChange(editor.getHTML())
    })

    useEffect(() => {
      if (editor) editor.setEditable(disabled ? false : true, false)
    }, [disabled, editor])

    return (
      <div
        className={`rich-text-editor-wrapper ${invalid ? 'invalid' : ''}`}
        data-testid="rich-text-editor-wrapper"
        ref={ref as RefObject<HTMLDivElement>}
        tabIndex={0}>
        <EditorActions editor={editor} disabled={disabled} locales={locales} />
        <div className="editor-content-wrapper">
          <EditorContent editor={editor} />
        </div>
      </div>
    )
  }
)
RichTextEditor.displayName = 'RichTextEditor'
