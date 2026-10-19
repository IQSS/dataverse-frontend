export interface SignUpDTO {
  username: string
  firstName: string
  lastName: string
  emailAddress: string
  password: string
  affiliation?: string
  position?: string
  termsAccepted: boolean
}
