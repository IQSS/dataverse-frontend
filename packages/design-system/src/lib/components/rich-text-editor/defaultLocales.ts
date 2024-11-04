export interface RichTextEditorLocales {
  placeholder?: string
  linkDialog?: {
    title?: string
    label?: string
    ok?: string
    cancel?: string
  }
}

export const richTextEditorDefaultLocales: RichTextEditorLocales = {
  placeholder: 'Write something …',
  linkDialog: {
    title: 'Add link',
    label: 'Link',
    ok: 'OK',
    cancel: 'Cancel'
  }
}
