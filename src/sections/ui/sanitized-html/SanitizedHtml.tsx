import React from 'react'
import DOMPurify, { Config } from 'dompurify'

interface SanitizedHTMLProps {
  html: string
  options?: Config
}

const defaultOptions: Config = {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
  ALLOWED_ATTR: ['href']
}

export function SanitizedHTML({ html, options }: SanitizedHTMLProps): JSX.Element {
  const sanitizedHTML = React.useMemo(() => {
    const config = options ? { ...defaultOptions, ...options } : defaultOptions
    const sanitized = DOMPurify.sanitize(html, config)
    if (typeof sanitized === 'string') {
      return { __html: sanitized }
    } else {
      const div = document.createElement('div')
      div.appendChild(sanitized.cloneNode(true))
      return { __html: div.innerHTML }
    }
  }, [html, options])

  return <div dangerouslySetInnerHTML={sanitizedHTML} />
}
