export interface RichTextEditorLocales {
  placeholder?: string
  linkDialog?: {
    title?: string
    label?: string
    ok?: string
    cancel?: string
  }
  imageDialog?: {
    title?: string
    label?: string
    altTextLabel?: string
    altTextPlaceholder?: string
    ok?: string
    cancel?: string
  }
}

export const richTextEditorDefaultLocales: RichTextEditorLocales = {
  placeholder: 'Write something …',
  linkDialog: {
    title: 'Add Link',
    label: 'Link',
    ok: 'OK',
    cancel: 'Cancel'
  },
  imageDialog: {
    title: 'Add Image',
    label: 'Image URL',
    altTextLabel: 'Alternative text',
    altTextPlaceholder:
      'Describe the image for screen readers (e.g. "Group of young college students in a classroom")',
    ok: 'OK',
    cancel: 'Cancel'
  }
}
