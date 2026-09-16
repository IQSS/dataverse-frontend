import type { Meta, StoryObj } from '@storybook/react'
import { DatasetsMap } from '../../components/map/DatasetsMap'
import { GeoDatasetItem } from '../../components/map/types'

const meta: Meta<typeof DatasetsMap> = {
  title: 'Datasets Map',
  component: DatasetsMap
}

export default meta
type Story = StoryObj<typeof DatasetsMap>

const mockItems: GeoDatasetItem[] = [
  {
    persistentId: 'doi:10.1234/1',
    name: 'Cluster dataset 1',
    detailsPageUrl: '',
    authors: 'Author Name',
    publicationDate: '2026-01-01',
    pinLat: 52.6,
    pinLon: 6.5,
    bboxes: [
      [
        [52.6 - 0.1, 6.5 - 0.1],
        [52.6 + 0.1, 6.5 + 0.1]
      ]
    ]
  },
  {
    persistentId: 'doi:10.1234/2',
    name: 'Cluster dataset 2',
    detailsPageUrl: '',
    authors: 'Author Name',
    publicationDate: '2026-01-01',
    pinLat: 53,
    pinLon: 6.5,
    bboxes: [
      [
        [53 - 0.1, 6.5 - 0.1],
        [53 + 0.1, 6.5 + 0.1]
      ]
    ]
  },
  {
    persistentId: 'doi:10.1234/3',
    name: 'Cluster dataset 3',
    detailsPageUrl: '',
    authors: 'Author Name',
    publicationDate: '2026-01-01',
    pinLat: 52.8,
    pinLon: 6.2,
    bboxes: [
      [
        [52.8 - 0.1, 6.2 - 0.1],
        [52.8 + 0.1, 6.2 + 0.1]
      ]
    ]
  },
  {
    persistentId: 'doi:10.1234/4',
    name: 'Dataset with large bounding box',
    detailsPageUrl: '',
    authors: 'Author Name',
    publicationDate: '2026-01-01',
    pinLat: 52.8,
    pinLon: 8,
    bboxes: [
      [
        [52.8 - 5, 8 - 10],
        [52.8 + 5, 8 + 10]
      ]
    ]
  },
  {
    persistentId: 'doi:10.1234/5',
    name: 'Dataset with 2 bounding boxes',
    detailsPageUrl: '',
    authors: 'Author Name',
    publicationDate: '2026-01-01',
    pinLat: 52.8,
    pinLon: 10.35,
    bboxes: [
      [
        [52.8 - 0.1, 10.2 - 0.1],
        [52.8 + 0.1, 10.2 + 0.1]
      ],
      [
        [52.8 - 0.1, 10.5 - 0.1],
        [52.8 + 0.1, 10.5 + 0.1]
      ]
    ]
  }
]

export const Default: Story = {
  args: {
    isVisible: true,
    items: mockItems,
    totalCount: 5,
    isLoading: false,
    error: null,
    hasMore: false,
    loadMore: () => {}
  }
}

export const CustomHeight: Story = {
  args: {
    ...Default.args,
    mapHeight: '50vh'
  }
}

export const Loading: Story = {
  args: {
    ...Default.args,
    items: [],
    totalCount: 0,
    isLoading: true
  }
}

export const Error: Story = {
  args: {
    ...Default.args,
    items: [],
    totalCount: 0,
    error: 'Demo of an Error'
  }
}
