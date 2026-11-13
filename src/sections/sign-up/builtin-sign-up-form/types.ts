export interface BuiltinSignUpFormData {
  username: string
  firstName: string
  lastName: string
  emailAddress: string
  password: string
  confirmPassword: string
  affiliation: string
  affiliationRor: string
  position: string
  termsAccepted: boolean
}

export type SignUpDraft = Omit<BuiltinSignUpFormData, 'password' | 'confirmPassword'>
