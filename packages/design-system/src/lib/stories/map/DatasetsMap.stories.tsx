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

export const OpenTopoMapBaseMap: Story = {
  args: {
    ...Default.args,
    tileLayer: {
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      maxZoom: 17,
      attribution:
        'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    }
  }
}

export const OnePinPerDataset: Story = {
  args: {
    ...Default.args,
    markerPlacement: 'dataset-center'
  }
}

const terminalClusterItems: GeoDatasetItem[] = Array.from({ length: 4 }, (_, index) => ({
  persistentId: `doi:10.1234/terminal-${index + 1}`,
  name: `Dataset at the same location ${index + 1}`,
  detailsPageUrl: '',
  authors: `Author ${index + 1}`,
  publicationDate: '2026-01-01',
  bboxes: [
    [
      [52.7, 7.9],
      [52.9, 8.1]
    ]
  ]
}))

export const TerminalClusterCarousel: Story = {
  args: {
    ...Default.args,
    items: terminalClusterItems,
    totalCount: terminalClusterItems.length
  }
}

export const TerminalClusterSpiderfy: Story = {
  args: {
    ...TerminalClusterCarousel.args,
    terminalClusterBehavior: 'spiderfy'
  }
}

const customClusterPositions = [
  [52.8, 5],
  [52.9, 5.1],
  [52.8, 5.2]
] as const

const customColorItems: GeoDatasetItem[] = [
  ...terminalClusterItems,
  {
    persistentId: 'doi:10.1234/custom-single',
    name: 'Individual dataset pin',
    detailsPageUrl: '',
    authors: 'Individual Author',
    publicationDate: '2026-01-01',
    bboxes: [
      [
        [52.7, 10.9],
        [52.9, 11.1]
      ]
    ]
  },
  ...customClusterPositions.map(
    ([latitude, longitude], index): GeoDatasetItem => ({
      persistentId: `doi:10.1234/custom-cluster-${index + 1}`,
      name: `Dataset in separable cluster ${index + 1}`,
      detailsPageUrl: '',
      authors: `Cluster Author ${index + 1}`,
      publicationDate: '2026-01-01',
      bboxes: [
        [
          [latitude - 0.1, longitude - 0.1],
          [latitude + 0.1, longitude + 0.1]
        ]
      ]
    })
  )
]

export const CustomObjectColors: Story = {
  args: {
    ...TerminalClusterCarousel.args,
    items: customColorItems,
    totalCount: customColorItems.length,
    colors: {
      boundingBox: '#6f42c1',
      pinPrimary: '#198754',
      pinSecondary: '#ffffff',
      terminalPinPrimary: '#6f42c1',
      terminalPinSecondary: '#ffffff',
      clusterSmall: '#0d6efd',
      clusterMedium: '#ffc107',
      clusterLarge: '#dc3545',
      clusterPreview: '#6f42c1'
    }
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
