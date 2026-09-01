export enum FileCitationFormat {
  Internal = 'Internal',
  EndNote = 'EndNote',
  RIS = 'RIS',
  BibTeX = 'BibTeX',
  CSLJson = 'CSL'
}

export interface FormattedFileCitation {
  content: string
  contentType: string
}
