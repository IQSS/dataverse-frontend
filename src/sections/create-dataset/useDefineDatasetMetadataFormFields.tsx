import { useEffect, useRef, useState } from 'react'
import { getMetadataBlockInfoByCollectionId } from '../../metadata-block-info/domain/useCases/getMetadataBlockInfoByCollectionId'
import { MetadataBlockInfoRepository } from '../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'

/*
  ** Notes:
  - We will check which blocks to display on the create dataset form. (citation, geospatial, etc...)
  - We will use the getDatasetMetadataBlockFields use case to get the fields to render according to the Collection Id / Dataverse Id.
*/

export const useDefineDatasetMetadataFormFields = (
  metadataBlockInfoRepository: MetadataBlockInfoRepository
) => {
  const ref = useRef(false)
  const [fieldsToRender, setFieldsToRender] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleGetDatasetMetadataBlockFields = async () => {
      setIsLoading(true)
      try {
        const metadataBlocksInfo = await getMetadataBlockInfoByCollectionId(
          metadataBlockInfoRepository,
          'someCitation',
          true
        )
        console.log(metadataBlocksInfo)
        // setFieldsToRender(fields)
        // const { data } = await axios.get<{ status: string; data: MetadataBlockInfo2 }>(
        //   `http://localhost:8000/api/v1/metadatablocks/${MetadataBlockName.CITATION}`
        // )
        //const metadataBlockInfo = data.data
      } catch (err) {
        console.error(err)
        const errorMessage =
          err instanceof Error && err.message
            ? err.message
            : 'Something went wrong getting the datasets'
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }
    // if (!ref.current) {
    void handleGetDatasetMetadataBlockFields()
    // ref.current = true
    // }
  }, [])

  return {
    fieldsToRender,
    error,
    isLoading
  }
}
