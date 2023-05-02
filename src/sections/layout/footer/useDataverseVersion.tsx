import { useEffect, useState } from 'react'
import { DataverseInfoRepository } from '../../../info/domain/repositories/DataverseInfoRepository'
import { DataverseVersion } from '../../../info/domain/models/DataverseVersion'
import { getDataverseVersion } from '../../../info/domain/useCases/getDataverseVersion'

export function useDataverseVersion(repository: DataverseInfoRepository) {
  const [dataverseVersion, setDataverseVersion] = useState<DataverseVersion>()

  useEffect(() => {
    getDataverseVersion(repository)
      .then((dataverseVersion: DataverseVersion) => {
        setDataverseVersion(dataverseVersion)
      })
      .catch((error) => console.error('There was an error getting the dataverse version', error))
  }, [repository])

  return { dataverseVersion }
}
