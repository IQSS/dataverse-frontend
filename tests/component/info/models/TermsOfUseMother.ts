import { TermsOfUse } from '@/info/domain/models/TermsOfUse'

export class TermsOfUseMother {
  static create(): TermsOfUse {
    return 'Be nice to each other!'
  }

  static createWithOnClickScript(): TermsOfUse {
    return '<h3>Terms of Use SPA dev</h3><p>Please see our full <a href="https://beta.dataverse.org/spa/">terms of use</a></p><p onclick="alert(\'this alert is to text sanitization\')">Thanks for reading!</p>'
  }

  static createEmpty(): TermsOfUse {
    return 'There are no API Terms of Use for this Dataverse installation.'
  }
}
