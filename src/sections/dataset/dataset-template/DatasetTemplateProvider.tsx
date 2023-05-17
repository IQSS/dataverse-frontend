import { PropsWithChildren, useEffect, useState } from 'react'
import { DatasetTemplate } from '../../../dataset/domain/models/DatasetTemplate'
import { DatasetTemplateContext } from './DatasetTemplateContext'
import { DatasetTemplateRepository } from '../../../dataset/domain/repositories/DatasetTemplateRepository'
import { getDatasetTemplate } from '../../../dataset/domain/useCases/getDatasetTemplate'

export function DatasetTemplateProvider({
  children,
  repository
}: PropsWithChildren<{ repository: DatasetTemplateRepository }>) {
  const [template, setTemplate] = useState<DatasetTemplate>()
  const [templateId, setTemplateId] = useState<string | undefined>()

  useEffect(() => {
    if (!templateId) return
    getDatasetTemplate(repository, templateId)
      .then((template: DatasetTemplate | undefined) => {
        setTemplate(template)
      })
      .catch((error) => console.error('There was an error getting the dataset template', error))
  }, [repository, templateId])

  return (
    <DatasetTemplateContext.Provider value={{ template, setTemplateId }}>
      {children}
    </DatasetTemplateContext.Provider>
  )
}
