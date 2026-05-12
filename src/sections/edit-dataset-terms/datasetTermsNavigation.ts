import {
  Dataset,
  DatasetNonNumericVersionSearchParam,
  DatasetPublishingStatus
} from '@/dataset/domain/models/Dataset'
import { QueryParamKey, Route } from '@/sections/Route.enum'

export const buildDatasetTermsReturnUrl = (dataset: Dataset): string => {
  const searchParams = new URLSearchParams()
  searchParams.set(QueryParamKey.PERSISTENT_ID, dataset.persistentId)

  if (dataset.version.publishingStatus === DatasetPublishingStatus.DRAFT) {
    searchParams.set(QueryParamKey.VERSION, DatasetNonNumericVersionSearchParam.DRAFT)
  } else {
    searchParams.set(QueryParamKey.VERSION, dataset.version.number.toString())
  }

  return `${Route.DATASETS}?${searchParams.toString()}`
}

export const buildDatasetDraftReturnUrl = (dataset: Dataset): string => {
  const searchParams = new URLSearchParams()
  searchParams.set(QueryParamKey.PERSISTENT_ID, dataset.persistentId)
  searchParams.set(QueryParamKey.VERSION, DatasetNonNumericVersionSearchParam.DRAFT)

  return `${Route.DATASETS}?${searchParams.toString()}`
}
