import { LabelSemanticMeaning } from '../../../../src/dataset/domain/models/LabelSemanticMeaning.enum'
import { render } from '@testing-library/react'
import { DatasetLabels } from '../../../../src/sections/dataset/dataset-labels/DatasetLabels'

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
    const { getByText } = render(<DatasetLabels labels={labels} />)

    expect(getByText(labels[0].value)).toBeInTheDocument()
    expect(getByText(labels[1].value)).toBeInTheDocument()
    expect(getByText(labels[2].value)).toBeInTheDocument()
    expect(getByText(labels[3].value)).toBeInTheDocument()
    expect(getByText(labels[4].value)).toBeInTheDocument()
    expect(getByText(labels[5].value)).toBeInTheDocument()
  })

  it('should render labels with correct variant', () => {
    const { getByText } = render(<DatasetLabels labels={labels} />)

    expect(getByText(labels[0].value)).toHaveClass('bg-primary')
    expect(getByText(labels[1].value)).toHaveClass('bg-secondary')
    expect(getByText(labels[2].value)).toHaveClass('bg-success')
    expect(getByText(labels[3].value)).toHaveClass('bg-danger')
    expect(getByText(labels[4].value)).toHaveClass('bg-warning')
    expect(getByText(labels[5].value)).toHaveClass('bg-info')
  })
})
