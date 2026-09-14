import { DatasetReview } from '@/dataset/domain/models/DatasetReview'

export const datasetReviewsMock: DatasetReview[] = [
  {
    id: 101,
    title: 'Computational reproducibility review of global temperature observations',
    authors: ['Avery Chen', 'Morgan Singh'],
    persistentId: 'doi:10.5072/FK2/REVIEW01',
    persistentIdUrl: 'https://doi.org/10.5072/FK2/REVIEW01',
    citation:
      'Chen, Avery; Singh, Morgan, 2026, "Computational reproducibility review of global temperature observations"',
    citationHtml:
      'Chen, Avery; Singh, Morgan, 2026, "Computational reproducibility review of global temperature observations"',
    datePublished: '2026-02-03',
    description: 'A review dataset focused on workflow execution and result reproducibility.',
    rubricMetadataBlocks: []
  },
  {
    id: 102,
    title: 'Peer review materials for survey methodology dataset',
    authors: ['Jordan Rivera'],
    persistentId: 'doi:10.5072/FK2/REVIEW02',
    persistentIdUrl: 'https://doi.org/10.5072/FK2/REVIEW02',
    citation: 'Rivera, Jordan, 2026, "Peer review materials for survey methodology dataset"',
    citationHtml: 'Rivera, Jordan, 2026, "Peer review materials for survey methodology dataset"',
    datePublished: '2026-02-10',
    description: 'Reviewer notes, scoring rubric metadata, and supporting materials.',
    rubricMetadataBlocks: []
  }
]
