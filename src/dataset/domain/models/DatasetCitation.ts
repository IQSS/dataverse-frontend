export interface FormattedCitation {
  content: string
  contentType: string
}

export enum CitationFormat {
  Internal = 'Internal',
  EndNote = 'EndNote',
  RIS = 'RIS',
  BibTeX = 'BibTeX',
  CSLJson = 'CSL'
}
