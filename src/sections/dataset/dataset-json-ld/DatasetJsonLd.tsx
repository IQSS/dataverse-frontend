import { useEffect } from 'react'

interface DatasetJsonLdProps {
  persistentId: string | undefined
}

export function DatasetJsonLd({ persistentId }: DatasetJsonLdProps) {
  const addJsonLdScript = (persistentId: string) => {
    const jsonLdData = {
      '@context': 'http://schema.org',
      '@type': 'Dataset',
      '@id': persistentId,
      identifier: persistentId,
      name: 'test',
      creator: [
        {
          '@type': 'Person',
          givenName: 'Guillermo',
          familyName: 'Portas',
          name: 'Portas, Guillermo'
        }
      ]
    }
    //TODO: replace string with data from server
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify(jsonLdData)

    const existingScript = document.querySelector('script[type="application/ld+json"]')
    if (existingScript) {
      existingScript.remove()
    }
    document.head.appendChild(script)
  }
  useEffect(() => {
    persistentId && addJsonLdScript(persistentId)
  }, [persistentId])
  return <></>
}
