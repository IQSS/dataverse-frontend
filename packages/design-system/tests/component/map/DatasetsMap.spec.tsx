import { DatasetsMap } from '../../../src/lib/components/map/DatasetsMap'
import { GeoDatasetItem } from '../../../src/lib/components/map/types'

const terminalItems: GeoDatasetItem[] = [
  {
    persistentId: 'doi:10.1234/1',
    name: 'First colocated dataset',
    detailsPageUrl: '#first',
    authors: 'First Author',
    publicationDate: '2026-01-01',
    bboxes: [
      [
        [52.7999, 7.9999],
        [52.8001, 8.0001]
      ]
    ]
  },
  {
    persistentId: 'doi:10.1234/2',
    name: 'Second colocated dataset',
    detailsPageUrl: '#second',
    authors: 'Second Author',
    publicationDate: '2026-02-02',
    bboxes: [
      [
        [52.7998, 7.9998],
        [52.8002, 8.0002]
      ]
    ]
  }
]

const almostCoincidentItems: GeoDatasetItem[] = [
  terminalItems[0],
  {
    ...terminalItems[1],
    bboxes: [
      [
        [52.79981, 7.99981],
        [52.80021, 8.00021]
      ]
    ]
  }
]

const multiBoundingBoxItem: GeoDatasetItem = {
  persistentId: 'doi:10.1234/multiple-boxes',
  name: 'Dataset with multiple bounding boxes',
  detailsPageUrl: '#multiple-boxes',
  authors: 'Multiple Boxes Author',
  publicationDate: '2026-03-03',
  bboxes: [
    [
      [48.8, 2.2],
      [49, 2.4]
    ],
    [
      [55.5, 12.5],
      [55.7, 12.7]
    ]
  ]
}

const popupSwitchItems: GeoDatasetItem[] = [
  {
    persistentId: 'doi:10.1234/popup-switch-1',
    name: 'First nearby dataset',
    detailsPageUrl: '#popup-switch-1',
    authors: 'First Author',
    publicationDate: '2026-01-01',
    bboxes: [
      [
        [-40, -40],
        [40, 40]
      ]
    ]
  },
  {
    persistentId: 'doi:10.1234/popup-switch-2',
    name: 'Second nearby dataset',
    detailsPageUrl: '#popup-switch-2',
    authors: 'Second Author',
    publicationDate: '2026-02-02',
    bboxes: [
      [
        [-0.1, 9.9],
        [0.1, 10.1]
      ]
    ]
  }
]

function createSeparableClusterItems(
  count: number,
  latitude: number,
  longitude: number,
  prefix: string
): GeoDatasetItem[] {
  return Array.from({ length: count }, (_, index) => {
    const markerLatitude = index === count - 1 ? latitude + 0.05 : latitude
    const markerLongitude = index === count - 1 ? longitude + 0.05 : longitude

    return {
      persistentId: `doi:10.1234/${prefix}-${index}`,
      name: `${prefix} dataset ${index}`,
      detailsPageUrl: `#${prefix}-${index}`,
      authors: 'Author',
      publicationDate: '2026-01-01',
      bboxes: [
        [
          [markerLatitude - 0.0001, markerLongitude - 0.0001],
          [markerLatitude + 0.0001, markerLongitude + 0.0001]
        ]
      ]
    }
  })
}

function mountMap(
  overrides: Partial<React.ComponentProps<typeof DatasetsMap>> = {},
  items = terminalItems
) {
  cy.mount(
    <DatasetsMap
      isVisible
      items={items}
      totalCount={items.length}
      isLoading={false}
      error={null}
      hasMore={false}
      loadMore={() => undefined}
      mapHeight={400}
      {...overrides}
    />
  )
}

function getSettledCluster() {
  cy.get('.leaflet-container').should('not.have.class', 'leaflet-zoom-anim')
  return cy.get('.dataset-map-terminal-marker').should('have.length', 1)
}

describe('DatasetsMap marker clusters', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://*.tile.openstreetmap.org/**', { statusCode: 204 })
  })

  it('opens a carousel popup for a terminal cluster by default', () => {
    mountMap()

    getSettledCluster()
      .should('not.have.class', 'marker-cluster')
      .and('contain.text', '2')
      .and('have.css', 'width', '32px')
      .and('have.css', 'height', '48px')
      .click()
    cy.get('.dataset-map-terminal-marker text').then(([count]) => {
      const bounds = (count as unknown as SVGGraphicsElement).getBBox()
      expect(bounds.y + bounds.height / 2).to.be.closeTo(16, 0.5)
    })
    cy.findByRole('link', { name: 'First colocated dataset' }).should('exist')
    cy.findByRole('spinbutton', { name: 'Dataset number, 1 to 2' }).should('have.value', '1')
    cy.findByText('/ 2').should('exist')

    cy.findByRole('button', { name: 'Next dataset' }).click()
    cy.findByRole('link', { name: 'Second colocated dataset' }).should('exist')
    cy.findByRole('spinbutton', { name: 'Dataset number, 1 to 2' }).should('have.value', '2')

    cy.findByRole('spinbutton', { name: 'Dataset number, 1 to 2' }).clear().type('1')
    cy.findByRole('link', { name: 'First colocated dataset' }).should('exist')
    cy.get('.leaflet-container').should('not.have.class', 'leaflet-zoom-anim')
  })

  it('supports custom tile-layer properties', () => {
    mountMap({
      tileLayer: {
        url: 'https://tiles.example.test/{z}/{x}/{y}.png',
        attribution: 'Custom map provider',
        className: 'custom-base-map',
        maxZoom: 12
      }
    })

    cy.get('.leaflet-control-attribution').should('contain.text', 'Custom map provider')
    cy.get('.leaflet-tile-pane .custom-base-map img')
      .should('exist')
      .and('have.attr', 'src')
      .and('match', /^https:\/\/tiles\.example\.test\/\d+\/\d+\/\d+\.png$/)
    cy.get('.leaflet-container').should('not.have.class', 'leaflet-zoom-anim')
    cy.wait(500) // Let Leaflet finish any zoom transition caused by the custom maximum zoom.
  })

  it('can spiderfy a terminal cluster instead', () => {
    mountMap({ terminalClusterBehavior: 'spiderfy' })

    getSettledCluster().click()
    cy.get('.dataset-map-dataset-marker').should('have.length', 2).and('contain.text', '1')
    cy.get('.leaflet-popup').should('not.exist')
    cy.get('.leaflet-container').should('not.have.class', 'leaflet-cluster-anim')
  })

  it('treats distinct coordinates that remain clustered at maximum zoom as terminal', () => {
    mountMap({}, almostCoincidentItems)

    getSettledCluster().should('contain.text', '2').click()
    cy.findByRole('link', { name: 'First colocated dataset' }).should('exist')
    cy.findByRole('button', { name: 'Next dataset' }).click()
    cy.findByRole('link', { name: 'Second colocated dataset' }).should('exist')
  })

  it('can place one marker at the dataset center', () => {
    mountMap({ markerPlacement: 'dataset-center' }, [multiBoundingBoxItem])

    cy.get('.dataset-map-dataset-marker').should('have.length', 1).trigger('mouseover')
    cy.get('.leaflet-overlay-pane path').should('have.length', 2)
    cy.findByText('1 of 1 results displayed').should('exist')
  })

  it('places one marker per bounding box by default with the same dataset popup', () => {
    mountMap({}, [multiBoundingBoxItem])

    cy.get('.dataset-map-dataset-marker').should('have.length', 2).first().trigger('mouseover')
    cy.get('.leaflet-overlay-pane path').should('have.length', 1)
    cy.get('.dataset-map-dataset-marker').first().trigger('mouseout').click()
    cy.get('.leaflet-overlay-pane path').should('have.length', 1)
    cy.findByRole('link', { name: multiBoundingBoxItem.name }).should(
      'have.attr',
      'href',
      multiBoundingBoxItem.detailsPageUrl
    )
    cy.findByText('1 of 1 results displayed').should('exist')
    cy.get('.leaflet-container')
      .should('not.have.class', 'leaflet-zoom-anim')
      .and('not.have.class', 'leaflet-pan-anim')
    cy.get('.leaflet-popup-close-button').click({ force: true })
    cy.get('.leaflet-popup').should('not.exist')
    cy.wait(500) // Let Leaflet finish its delayed zoom-transition callback before unmounting.
  })

  it('keeps the newly opened nearby marker outside its cluster when switching popups', () => {
    mountMap({}, popupSwitchItems)

    cy.get('.leaflet-control-zoom-out').click()
    cy.wait(300)
    cy.get('.leaflet-control-zoom-out').click()
    cy.wait(300)
    cy.get('.leaflet-control-zoom-out').click()
    cy.wait(300)
    cy.get('.leaflet-control-zoom-out').click()
    cy.wait(300)
    cy.get('.leaflet-control-zoom-out').click()
    cy.wait(300)
    cy.get('.dataset-map-cluster-small').should('have.length', 1).click()
    cy.wait(300)
    cy.get('.dataset-map-dataset-marker').should('have.length', 2)
    cy.get('.dataset-map-dataset-marker').last().click()
    cy.findByRole('link', { name: 'First nearby dataset' }).should('exist')
    cy.wait(500)
    cy.get('.leaflet-container')
      .should('not.have.class', 'leaflet-zoom-anim')
      .and('not.have.class', 'leaflet-pan-anim')
    // The opened marker is removed from the cluster and appended directly to the map,
    // leaving the other marker first in DOM order.
    cy.get('.dataset-map-dataset-marker').should('have.length', 2)
    cy.get('.dataset-map-dataset-marker').first().click()
    cy.findByRole('link', { name: 'Second nearby dataset' }).should('exist')

    cy.get('.leaflet-overlay-pane path').should('have.length', 1)
    cy.get('.dataset-map-cluster-small').should('not.exist')
    cy.get('.dataset-map-dataset-marker').should('have.length', 2)
    cy.get('.leaflet-container')
      .should('not.have.class', 'leaflet-zoom-anim')
      .and('not.have.class', 'leaflet-pan-anim')
    cy.wait(500) // Let Leaflet finish its delayed zoom-transition callback before unmounting.
  })

  it('applies custom bounding-box stroke and fill colors', () => {
    mountMap(
      {
        colors: {
          boundingBox: '#dc3545',
          pinPrimary: '#198754',
          pinSecondary: '#f8f9fa'
        }
      },
      [terminalItems[0]]
    )

    cy.get('.dataset-map-dataset-marker')
      .should('contain.text', '1')
      .and('have.css', 'width', '32px')
      .and('have.css', 'height', '48px')
      .trigger('mouseover')
    cy.get('.dataset-map-dataset-marker path')
      .should('have.attr', 'fill', '#198754')
      .and('have.attr', 'stroke', '#f8f9fa')
    cy.get('.dataset-map-dataset-marker text').should('have.attr', 'fill', '#f8f9fa')
    cy.get('.leaflet-overlay-pane path')
      .should('have.attr', 'stroke', '#dc3545')
      .and('have.attr', 'fill', '#dc3545')
      .and('have.attr', 'stroke-width', '2.5')
      .and('have.attr', 'stroke-opacity', '0.8')
      .and('have.attr', 'fill-opacity', '0.2')
  })

  it('applies colors to terminal cluster pins independently', () => {
    mountMap({
      colors: {
        terminalPinPrimary: '#6f42c1',
        terminalPinSecondary: '#ffc107'
      }
    })

    getSettledCluster()
    cy.get('.dataset-map-terminal-marker path')
      .should('have.attr', 'fill', '#6f42c1')
      .and('have.attr', 'stroke', '#ffc107')
    cy.get('.dataset-map-terminal-marker text').should('have.attr', 'fill', '#ffc107')
  })

  it('applies independent colors to all three separable cluster sizes', () => {
    const items = [
      ...createSeparableClusterItems(3, 50, 10, 'small'),
      ...createSeparableClusterItems(10, 40, -100, 'medium'),
      ...createSeparableClusterItems(101, -30, 130, 'large')
    ]

    mountMap(
      {
        colors: {
          clusterSmall: '#111111',
          clusterMedium: '#333333',
          clusterLarge: '#555555',
          clusterPreview: '#6f42c1'
        }
      },
      items
    )

    cy.get('.leaflet-container').should('not.have.class', 'leaflet-zoom-anim')
    cy.get('.dataset-map-cluster-small > div')
      .should('have.attr', 'style')
      .and('contain', '#111111')
    cy.get('.dataset-map-cluster-small > div > div')
      .should('have.attr', 'style')
      .and('contain', '#111111')
    cy.get('.dataset-map-cluster-medium > div')
      .should('have.attr', 'style')
      .and('contain', '#333333')
    cy.get('.dataset-map-cluster-medium > div > div')
      .should('have.attr', 'style')
      .and('contain', '#333333')
    cy.get('.dataset-map-cluster-large > div')
      .should('have.attr', 'style')
      .and('contain', '#555555')
    cy.get('.dataset-map-cluster-large > div > div')
      .should('have.attr', 'style')
      .and('contain', '#555555')
    cy.get('.dataset-map-cluster span').should('have.css', 'color', 'rgb(0, 0, 0)')
    cy.get('.dataset-map-cluster-small > div').then(([outer]) => {
      const inner = outer.firstElementChild as HTMLElement
      const outerBounds = outer.getBoundingClientRect()
      const innerBounds = inner.getBoundingClientRect()

      expect(innerBounds.left - outerBounds.left).to.be.closeTo(5, 0.5)
      expect(innerBounds.top - outerBounds.top).to.be.closeTo(5, 0.5)
    })
    cy.wait(500) // Let Leaflet replace transient cluster nodes after its initial zoom animation.
    cy.get('.dataset-map-cluster-small').last().trigger('mouseover')
    cy.get('.leaflet-overlay-pane path')
      .should('have.attr', 'stroke', '#6f42c1')
      .and('have.attr', 'fill', '#6f42c1')
      .and('have.attr', 'stroke-width', '2.5')
      .and('have.attr', 'stroke-opacity', '0.8')
      .and('have.attr', 'fill-opacity', '0.2')
  })
})
