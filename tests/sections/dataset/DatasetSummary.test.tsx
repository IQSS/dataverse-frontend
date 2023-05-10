import { createSandbox, SinonSandbox } from 'sinon'
import { render } from '@testing-library/react'
import { DatasetField, License } from '../../../src/dataset/domain/models/Dataset'
import { DatasetSummary } from '../../../src/sections/dataset/datasetSummary/DatasetSummary'
import { faker } from '@faker-js/faker'

describe('DatasetSummary', () => {
  const sandbox: SinonSandbox = createSandbox()

  const licenseMock: License = {
    name: 'CC0 1.0',
    shortDescription: 'CC0 1.0 Universal Public Domain Dedication',
    uri: 'https://creativecommons.org/publicdomain/zero/1.0/',
    iconUrl: 'https://licensebuttons.net/p/zero/1.0/88x31.png'
  }
  const summaryFieldsMock: DatasetField[] = [
    {
      title: 'Description',
      description: 'this is the description field',
      value:
        'This is the description field. Here is [a link](https://dataverse.org). ' +
        'This text is *italic* and this is **bold**. Here is an image ![Alt text](https://picsum.photos/id/10/20/20) '
    },
    {
      title: 'Keyword',
      description: 'this is the keyword field',
      value: 'Malaria, Tuberculosis, Drug Resistant'
    },
    {
      title: 'Subject',
      description: 'this is the subject field',
      value: 'Medicine, Health and Life Sciences, Social Sciences'
    },
    {
      title: 'Related Publication',
      description: 'this is the keyword field',
      value: 'CNN Journal [CNN.com](https://cnn.com)'
    },
    {
      title: 'Notes',
      description: 'this is the notes field',
      value: faker.lorem.paragraph(3)
    }
  ]

  afterEach(() => {
    sandbox.restore()
  })

  it('renders the DatasetSummary fields', async () => {
    const { findByText } = render(
      <DatasetSummary summaryFields={summaryFieldsMock} license={licenseMock} />
    )

    // const description = await findByText(`${testDataset.description.substring(0, 20)}`)
    // expect(description).toBeInTheDocument()

    const value1 = await findByText(`${summaryFieldsMock[1].value}`)
    expect(value1).toBeInTheDocument()
    const keyword = await findByText(`${summaryFieldsMock[1].title}`)
    expect(keyword).toBeInTheDocument()
  })
})
