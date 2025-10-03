export interface License {
  id: number
  name: string
  shortDescription?: string
  uri: string
  iconUri?: string
  active: boolean
  isDefault: boolean
  sortOrder: number
  rightsIdentifier?: string
  rightsIdentifierScheme?: string
  schemeUri?: string
  languageCode?: string
}
