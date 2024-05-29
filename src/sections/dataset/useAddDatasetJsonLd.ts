import { useEffect, useRef } from 'react'
interface DatasetJsonLdProps {
  persistentId: string | undefined
}

export const useAddDatasetJsonLd = ({ persistentId }: DatasetJsonLdProps) => {
  const scriptRef = useRef<HTMLScriptElement | null>(null)
  // const persistentIdRef = useRef('')

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
    scriptRef.current = script
    //persistentIdRef.current = persistentId
    script.type = 'application/ld+json'
    script.text = JSON.stringify(jsonLdData)
    document.head.append(script)
  }
  useEffect(() => {
    if (persistentId && scriptRef.current !== null) {
      addJsonLdScript(persistentId)
    }

    return () => {
      if (scriptRef.current !== null) {
        scriptRef.current.remove()
      }

      console.log('Component unmounted')
    }
  }, [persistentId])
}
