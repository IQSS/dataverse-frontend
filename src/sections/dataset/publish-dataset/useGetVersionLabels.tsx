import { useEffect, useState } from 'react'
import { DatasetRepository } from '../../../dataset/domain/repositories/DatasetRepository'

type UseGetVersionLabelsReturnType = {
  minorVersion: string
  majorVersion: string
}

export function UseGetVersionLabels(
  repository: DatasetRepository,

  persistentId: string
): UseGetVersionLabelsReturnType {
  const [minorVersion, setMinorVersion] = useState<string>('')
  const [majorVersion, setMajorVersion] = useState<string>('')

  useEffect(() => {
    const fetchVersions = () => {
      try {
        repository.getByPersistentId(persistentId).then((dataset) => {
          const majorVersionNumber = dataset?.version.number.majorNumber ?? 0
          const minorVersionNumber = dataset?.version.number.minorNumber ?? 0

          setMajorVersion((majorVersionNumber + 1).toString() + '.0')
          setMinorVersion((majorVersionNumber + minorVersionNumber + 0.1).toString())
        })
      } catch (error) {
        console.error('Publish Dataset: failed to fetch version numbers:', error)
      }
    }

    fetchVersions()
  }, [repository, persistentId])

  return {
    minorVersion,
    majorVersion
  } as UseGetVersionLabelsReturnType
}
