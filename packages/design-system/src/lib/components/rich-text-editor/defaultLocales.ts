export interface RichTextEditorLocales {
  linkDialog?: {
    title?: string
    label?: string
    ok?: string
    cancel?: string
  }
}

export const richTextEditorDefaultLocales: RichTextEditorLocales = {
  linkDialog: {
    title: 'Add link',
    label: 'Link',
    ok: 'OK',
    cancel: 'Cancel'
  }
}
