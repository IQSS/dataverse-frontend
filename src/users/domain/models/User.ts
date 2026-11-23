export interface User {
  displayName: string
  persistentId: string
  superuser: boolean
  firstName: string
  lastName: string
  email: string
  identifier: string
  affiliation?: string
  position?: string
  /** ORCID iD of the account holder, when the account holds one (see IQSS/dataverse-frontend#1021) */
  orcid?: string
  /** ROR ID of the account holder's affiliation, when the account holds one (see IQSS/dataverse-frontend#1022) */
  affiliationRorId?: string
}
