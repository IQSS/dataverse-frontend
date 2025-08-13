import DOMPurify from 'dompurify'
import { TermsOfUse } from '@/info/domain/models/TermsOfUse'

export class JSTermsOfUseMapper {
  static toSanitizedTermsOfUse(jsTermsOfUse: TermsOfUse): TermsOfUse {
    DOMPurify.addHook('afterSanitizeAttributes', function (node) {
      // set all elements owning target to target=_blank and rel=noopener for security reasons. See https://developer.chrome.com/docs/lighthouse/best-practices/external-anchors-use-rel-noopener
      if ('target' in node) {
        node.setAttribute('target', '_blank')
        node.setAttribute('rel', 'noopener')
      }
    })
    // DOMPurify docs 👉 https://github.com/cure53/DOMPurify
    const cleanedHTML = DOMPurify.sanitize(jsTermsOfUse, { USE_PROFILES: { html: true } })

    return cleanedHTML
  }
}
