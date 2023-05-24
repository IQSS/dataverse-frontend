import { LabelSemanticMeaning } from '../../../../../src/dataset/domain/models/Dataset'
import { DatasetLabels } from '../../../../../src/sections/dataset/dataset-labels/DatasetLabels'

describe('DatasetLabels', () => {
  const labels = [
    { value: 'Label 1', semanticMeaning: LabelSemanticMeaning.DATASET },
    { value: 'Label 2', semanticMeaning: LabelSemanticMeaning.FILE },
    { value: 'Label 3', semanticMeaning: LabelSemanticMeaning.SUCCESS },
    { value: 'Label 4', semanticMeaning: LabelSemanticMeaning.DANGER },
    { value: 'Label 5', semanticMeaning: LabelSemanticMeaning.WARNING },
    { value: 'Label 6', semanticMeaning: LabelSemanticMeaning.INFO }
  ]

  it('should render all labels', () => {
    cy.mount(<DatasetLabels labels={labels} />)

    cy.findByText(labels[0].value).should('exist')
    cy.findByText(labels[1].value).should('exist')
    cy.findByText(labels[2].value).should('exist')
    cy.findByText(labels[3].value).should('exist')
    cy.findByText(labels[4].value).should('exist')
    cy.findByText(labels[5].value).should('exist')
  })

  it('should render labels with correct variant', () => {
    cy.mount(<DatasetLabels labels={labels} />)

    cy.findByText(labels[0].value).should('have.class', 'bg-primary')
    cy.findByText(labels[1].value).should('have.class', 'bg-secondary')
    cy.findByText(labels[2].value).should('have.class', 'bg-success')
    cy.findByText(labels[3].value).should('have.class', 'bg-danger')
    cy.findByText(labels[4].value).should('have.class', 'bg-warning')
    cy.findByText(labels[5].value).should('have.class', 'bg-info')
  })
})
