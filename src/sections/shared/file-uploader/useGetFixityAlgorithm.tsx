import { useEffect, useState } from 'react'
import { FixityAlgorithm } from '@/files/domain/models/FixityAlgorithm'
import { FileRepository } from '@/files/domain/repositories/FileRepository'

/** Minimal interface for fixity algorithm fetching */
type FixityAlgorithmProvider = Pick<FileRepository, 'getFixityAlgorithm'>

export const useGetFixityAlgorithm = (fileRepository: FixityAlgorithmProvider) => {
  const [fixityAlgorithm, setFixityAlgorithm] = useState<FixityAlgorithm>(FixityAlgorithm.MD5)
  const [isLoadingFixityAlgorithm, setIsLoadingFixityAlgorithm] = useState<boolean>(true)
  const [errorLoadingFixityAlgorithm, setErrorLoadingFixityAlgorithm] = useState<boolean>(false)

  useEffect(() => {
    const fetchFixityAlgorithm = async () => {
      setIsLoadingFixityAlgorithm(true)
      try {
        const algorithm = await fileRepository.getFixityAlgorithm()
        setFixityAlgorithm(algorithm)
      } catch (error) {
        setErrorLoadingFixityAlgorithm(true)
      } finally {
        setIsLoadingFixityAlgorithm(false)
      }
    }

    void fetchFixityAlgorithm()
  }, [fileRepository])

  return { fixityAlgorithm, isLoadingFixityAlgorithm, errorLoadingFixityAlgorithm }
}
