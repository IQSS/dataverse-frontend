import {
  OIDC_STANDARD_CLAIMS,
  ValidTokenNotLinkedAccountFormData
} from '@/sections/sign-up/valid-token-not-linked-account-form/types'
import { ValidTokenNotLinkedAccountFormHelper } from '@/sections/sign-up/valid-token-not-linked-account-form/ValidTokenNotLinkedAccountFormHelper'

describe('ValidTokenNotLinkedAccountFormHelper', () => {
  describe('getTokenDataValue', () => {
    it('returns undefined if tokenData is undefined', () => {
      const key = 'preferred_username'
      const expectedTypeOfKey = 'string'
      const tokenData = undefined

      const result = ValidTokenNotLinkedAccountFormHelper.getTokenDataValue(
        key,
        expectedTypeOfKey,
        tokenData
      )

      expect(result).to.be.undefined
    })

    it('returns undefined if key is not in tokenData', () => {
      const key = 'preferred_username'
      const expectedTypeOfKey = 'string'
      const tokenData = {}

      const result = ValidTokenNotLinkedAccountFormHelper.getTokenDataValue(
        key,
        expectedTypeOfKey,
        tokenData
      )

      expect(result).to.be.undefined
    })

    it('returns undefined if value type is not expectedTypeOfKey', () => {
      const key = 'preferred_username'
      const expectedTypeOfKey = 'string'
      const tokenData = {
        [OIDC_STANDARD_CLAIMS.PREFERRED_USERNAME]: 1
      }

      const result = ValidTokenNotLinkedAccountFormHelper.getTokenDataValue(
        key,
        expectedTypeOfKey,
        tokenData
      )

      expect(result).to.be.undefined
    })

    it('returns key value if key exists and value type is expectedTypeOfKey', () => {
      const key = 'preferred_username'
      const expectedTypeOfKey = 'string'
      const tokenData = {
        [OIDC_STANDARD_CLAIMS.PREFERRED_USERNAME]: 'mockUserName'
      }

      const result = ValidTokenNotLinkedAccountFormHelper.getTokenDataValue(
        key,
        expectedTypeOfKey,
        tokenData
      )

      expect(result).to.equal('mockUserName')
    })
  })

  describe('defineRegistrationDTOProperties', () => {
    it('does not add form data token related properties to registrationDTO when tokenData have them present', () => {
      const formData: ValidTokenNotLinkedAccountFormData = {
        username: 'mockUserName',
        firstName: 'mockFirstName',
        lastName: 'mockLastName',
        emailAddress: 'mockEmail',
        position: '',
        affiliation: '',
        termsAccepted: true
      }

      const tokenData = {
        [OIDC_STANDARD_CLAIMS.PREFERRED_USERNAME]: 'mockUserName',
        [OIDC_STANDARD_CLAIMS.GIVEN_NAME]: 'mockFirstName',
        [OIDC_STANDARD_CLAIMS.FAMILY_NAME]: 'mockFirstName',
        [OIDC_STANDARD_CLAIMS.EMAIL]: 'mockEmail'
      }

      const result = ValidTokenNotLinkedAccountFormHelper.defineRegistrationDTOProperties(
        formData,
        tokenData
      )

      expect(result).to.deep.equal({ termsAccepted: true })
    })

    it('does add form data token related properties to registrationDTO when tokenData does not have them present', () => {
      const formData: ValidTokenNotLinkedAccountFormData = {
        username: 'mockUserName',
        firstName: 'mockFirstName',
        lastName: 'mockLastName',
        emailAddress: 'mockEmail',
        position: '',
        affiliation: '',
        termsAccepted: true
      }

      const tokenData = {
        [OIDC_STANDARD_CLAIMS.GIVEN_NAME]: 'mockFirstName',
        [OIDC_STANDARD_CLAIMS.EMAIL]: 'mockEmail'
      }

      const result = ValidTokenNotLinkedAccountFormHelper.defineRegistrationDTOProperties(
        formData,
        tokenData
      )

      expect(result).to.deep.equal({
        termsAccepted: true,
        username: 'mockUserName',
        lastName: 'mockLastName'
      })
    })

    it('adds position and affiliation from formData to registrationDTO if they have value', () => {
      const formData: ValidTokenNotLinkedAccountFormData = {
        username: 'mockUserName',
        firstName: 'mockFirstName',
        lastName: 'mockLastName',
        emailAddress: 'mockEmail',
        position: 'mockPosition',
        affiliation: 'mockAffiliation',
        termsAccepted: true
      }

      const tokenData = {
        [OIDC_STANDARD_CLAIMS.PREFERRED_USERNAME]: 'mockUserName',
        [OIDC_STANDARD_CLAIMS.GIVEN_NAME]: 'mockFirstName',
        [OIDC_STANDARD_CLAIMS.FAMILY_NAME]: 'mockFirstName',
        [OIDC_STANDARD_CLAIMS.EMAIL]: 'mockEmail'
      }

      const result = ValidTokenNotLinkedAccountFormHelper.defineRegistrationDTOProperties(
        formData,
        tokenData
      )

      expect(result).to.deep.equal({
        position: 'mockPosition',
        affiliation: 'mockAffiliation',
        termsAccepted: true
      })
    })

    it('returns registrationDTO with all properties from formData when tokenData is undefined', () => {
      const formData: ValidTokenNotLinkedAccountFormData = {
        username: 'mockUserName',
        firstName: 'mockFirstName',
        lastName: 'mockLastName',
        emailAddress: 'mockEmail',
        position: 'mockPosition',
        affiliation: 'mockAffiliation',
        termsAccepted: true
      }

      const tokenData = undefined

      const result = ValidTokenNotLinkedAccountFormHelper.defineRegistrationDTOProperties(
        formData,
        tokenData
      )

      expect(result).to.deep.equal(formData)
    })

    it('returns registrationDTO with all properties from formData when tokenData is empty', () => {
      const formData: ValidTokenNotLinkedAccountFormData = {
        username: 'mockUserName',
        firstName: 'mockFirstName',
        lastName: 'mockLastName',
        emailAddress: 'mockEmail',
        position: 'mockPosition',
        affiliation: 'mockAffiliation',
        termsAccepted: true
      }

      const tokenData = {}

      const result = ValidTokenNotLinkedAccountFormHelper.defineRegistrationDTOProperties(
        formData,
        tokenData
      )

      expect(result).to.deep.equal(formData)
    })
  })
})
