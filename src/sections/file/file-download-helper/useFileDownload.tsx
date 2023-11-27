import { useEffect, useState } from 'react'
import { useFileDownloadHelper } from './FileDownloadHelperContext'

export function useFileDownload(id: number) {
  const { download } = useFileDownloadHelper()
  const [originalFile, setOriginalFile] = useState<string>()

  useEffect(() => {
    download(id)
      .then((downloadedFile) => {
        setOriginalFile(downloadedFile)
      })
      .catch((error) => {
        console.error('There was an error downloading the file', error)
      })
  }, [id])

  return { originalFile }
}
