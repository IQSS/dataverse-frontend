import {
  DatasetLabelSemanticMeaning,
  DatasetLabelValue
} from '../../../../../src/dataset/domain/models/Dataset'
import { DatasetLabels } from '../../../../../src/sections/dataset/dataset-labels/DatasetLabels'

describe('DatasetLabels', () => {
  const labels = [
    { value: 'Label 1', semanticMeaning: DatasetLabelSemanticMeaning.DATASET },
    { value: 'Label 2', semanticMeaning: DatasetLabelSemanticMeaning.FILE },
    { value: 'Label 3', semanticMeaning: DatasetLabelSemanticMeaning.SUCCESS },
    { value: 'Label 4', semanticMeaning: DatasetLabelSemanticMeaning.DANGER },
    { value: 'Label 5', semanticMeaning: DatasetLabelSemanticMeaning.WARNING },
    { value: 'Label 6', semanticMeaning: DatasetLabelSemanticMeaning.INFO }
  ]

  it('should render all labels', () => {
    cy.customMount(<DatasetLabels labels={labels} />)

    cy.findByText(labels[0].value).should('exist')
    cy.findByText(labels[1].value).should('exist')
    cy.findByText(labels[2].value).should('exist')
    cy.findByText(labels[3].value).should('exist')
    cy.findByText(labels[4].value).should('exist')
    cy.findByText(labels[5].value).should('exist')
  })

  it('should render labels with correct variant', () => {
    cy.customMount(<DatasetLabels labels={labels} />)

    cy.findByText(labels[0].value).should('have.class', 'bg-primary')
    cy.findByText(labels[1].value).should('have.class', 'bg-secondary')
    cy.findByText(labels[2].value).should('have.class', 'bg-success')
    cy.findByText(labels[3].value).should('have.class', 'bg-danger')
    cy.findByText(labels[4].value).should('have.class', 'bg-warning')
    cy.findByText(labels[5].value).should('have.class', 'bg-info')
  })

  it('should render tooltip on hover for draft label', () => {
    const statusLabels = [
      {
        value: DatasetLabelValue.DRAFT,
        semanticMeaning: DatasetLabelSemanticMeaning.DATASET
      }
    ]

    cy.customMount(<DatasetLabels labels={statusLabels} />)

    cy.findByText(DatasetLabelValue.DRAFT).trigger('mouseenter')
    cy.findByRole('tooltip').should('be.visible')
  })
})
