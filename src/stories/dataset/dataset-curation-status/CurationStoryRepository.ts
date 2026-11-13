import { DatasetCurationStatus } from '@/dataset/domain/models/DatasetCuration'
import { DatasetMockRepository } from '../DatasetMockRepository'

export const curationHistory: DatasetCurationStatus[] = [
  {
    label: 'Privacy Review',
    createTime: '2026-11-13T14:30:00Z',
    assigner: '@curator',
    assignerDisplayName: 'Alex Curator'
  },
  { createTime: '2026-11-12T10:00:00Z', assigner: '@curator', assignerDisplayName: 'Alex Curator' },
  {
    label: 'Author Contacted',
    createTime: 'Tue Nov 10 19:12:33 UTC 2026',
    assigner: '@admin',
    assignerDisplayName: 'Dataverse Admin'
  }
]

export class CurationStoryRepository extends DatasetMockRepository {
  current: DatasetCurationStatus | null
  history: DatasetCurationStatus[]
  constructor(current: DatasetCurationStatus | null = curationHistory[0]) {
    super()
    this.current = current
    this.history = current ? [...curationHistory] : []
  }
  getCurationStatus(): Promise<DatasetCurationStatus | null> {
    return Promise.resolve(this.current)
  }
  getCurationStatusHistory(): Promise<DatasetCurationStatus[]> {
    return Promise.resolve([...this.history])
  }
  setCurationStatus(_id: string | number, label: string): Promise<void> {
    this.current = {
      label,
      createTime: '2026-11-13T15:00:00Z',
      assigner: '@curator',
      assignerDisplayName: 'Alex Curator'
    }
    this.history.unshift(this.current)
    return Promise.resolve()
  }
  deleteCurationStatus(): Promise<void> {
    this.current = null
    this.history.unshift({
      createTime: '2026-11-13T15:00:00Z',
      assignerDisplayName: 'Alex Curator'
    })
    return Promise.resolve()
  }
}
