import type { StoryObj, Meta } from '@storybook/react'
import { userEvent, waitFor, within } from '@storybook/test'
import { DatasetMetadataForm } from '../../../sections/shared/form/DatasetMetadataForm'
import { WithI18next } from '../../WithI18next'
import { WithLoggedInUser } from '../../WithLoggedInUser'
import { DatasetMockRepository } from '../../dataset/DatasetMockRepository'
import { MetadataBlockInfoMockRepository } from '../../shared-mock-repositories/metadata-block-info/MetadataBlockInfoMockRepository'
import { DatasetMother } from '../../../../tests/component/dataset/domain/models/DatasetMother'
import { RepositoriesStoryProvider, WithRepositories } from '../../WithRepositories'
import { ExternalVocabularyMockRepository } from '../../shared-mock-repositories/external-vocabularies/ExternalVocabularyMockRepository'
import {
  MetadataBlockInfo,
  MetadataBlockInfoDisplayFormat,
  MetadataField
} from '@/metadata-block-info/domain/models/MetadataBlockInfo'
import { MetadataBlockInfoRepository } from '@/metadata-block-info/domain/repositories/MetadataBlockInfoRepository'

const meta: Meta<typeof DatasetMetadataForm> = {
  title: 'Sections/Shared/Dataset Metadata Form',
  component: DatasetMetadataForm,
  decorators: [
    WithI18next,
    WithLoggedInUser,
    WithRepositories({ datasetRepository: new DatasetMockRepository() })
  ],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}
export default meta
type Story = StoryObj<typeof DatasetMetadataForm>

export const CreateMode: Story = {
  render: () => (
    <DatasetMetadataForm
      mode="create"
      collectionId="root"
      metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
    />
  )
}

const datasetToEditMock = DatasetMother.createRealistic()

export const EditMode: Story = {
  render: () => (
    <DatasetMetadataForm
      mode="edit"
      collectionId="root"
      metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
      datasetPersistentID={datasetToEditMock.persistentId}
      datasetMetadaBlocksCurrentValues={datasetToEditMock.metadataBlocks}
      datasetLastUpdateTime="2023-06-01T12:34:56Z"
    />
  )
}

export const CreateModeWithExternalVocabularySearchResults: Story = {
  render: () => (
    <RepositoriesStoryProvider
      datasetRepository={new DatasetMockRepository()}
      externalVocabularyRepository={new ExternalVocabularyMockRepository()}>
      <DatasetMetadataForm
        mode="create"
        collectionId="root"
        metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
      />
    </RepositoriesStoryProvider>
  ),
  play: async ({ canvasElement }) => {
    const keywordTermInput = await getKeywordExternalVocabularyInput(canvasElement)

    await userEvent.type(keywordTermInput, 'climate')
    await waitFor(() => within(canvasElement).getByText('Climate change'))
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the external vocabulary picker wired through the repository provider. Typing a query searches the mocked Skosmos-style provider and shows matching terms.'
      }
    }
  }
}

export const CreateModeWithExternalVocabularySelectedTerm: Story = {
  render: () => (
    <RepositoriesStoryProvider
      datasetRepository={new DatasetMockRepository()}
      externalVocabularyRepository={new ExternalVocabularyMockRepository()}>
      <DatasetMetadataForm
        mode="create"
        collectionId="root"
        metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
      />
    </RepositoriesStoryProvider>
  ),
  play: async ({ canvasElement }) => {
    const keywordTermInput = await getKeywordExternalVocabularyInput(canvasElement)
    const canvas = within(canvasElement)

    await userEvent.type(keywordTermInput, 'climate')
    const climateChangeTerm = await canvas.findByText('Climate change')
    await userEvent.click(climateChangeTerm)

    await waitFor(() => {
      if (keywordTermInput.value !== 'Climate change') {
        throw new Error('Expected selected external vocabulary term label to be shown')
      }
    })
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates selecting an external vocabulary term. The visible field keeps the term label while the form value stores the URI and managed keyword fields are populated from the term.'
      }
    }
  }
}

export const CreateModeWithRuntimeExternalVocabularyProvider: Story = {
  render: () => (
    <RepositoriesStoryProvider
      datasetRepository={new DatasetMockRepository()}
      externalVocabularyRepository={new ExternalVocabularyMockRepository()}>
      <DatasetMetadataForm
        mode="create"
        collectionId="root"
        metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
      />
    </RepositoriesStoryProvider>
  ),
  play: async ({ canvasElement }) => {
    const affiliationInput = await getAuthorAffiliationExternalVocabularyInput(canvasElement)

    await userEvent.type(affiliationInput, 'harvard')
    await waitFor(() => within(canvasElement).getByText('Harvard University'))
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates a ROR-style external vocabulary field. In production this can be backed by the runtime-configured HTTP/JSON provider instead of a built-in Java adapter.'
      }
    }
  }
}

export const CreateModeWithAllExternalVocabularyComponentTypes: Story = {
  render: () => (
    <RepositoriesStoryProvider
      datasetRepository={new DatasetMockRepository()}
      externalVocabularyRepository={new ExternalVocabularyMockRepository()}>
      <DatasetMetadataForm
        mode="create"
        collectionId="root"
        metadataBlockInfoRepository={
          new ExternalVocabularyComponentTypesMetadataBlockInfoRepository()
        }
      />
    </RepositoriesStoryProvider>
  ),
  play: async ({ canvasElement }) => {
    await typeIntoExternalVocabularyInput(canvasElement, 'demoPrimitiveSingleTermURI', 'climate')
    await waitFor(() => within(canvasElement).getByText('Climate change'))

    await typeIntoExternalVocabularyInput(canvasElement, 'demoPrimitiveMultipleTermURI', 'data')
    await waitFor(() => within(canvasElement).getByText('Climate data'))

    await typeIntoExternalVocabularyInput(canvasElement, 'demoCompoundSingleTermURI', 'harvard')
    await waitFor(() => within(canvasElement).getByText('Harvard University'))

    await typeIntoExternalVocabularyInput(canvasElement, 'demoCompoundMultipleTermURI', 'oxford')
    await waitFor(() => within(canvasElement).getByText('University of Oxford'))
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates every external vocabulary form shape: primitive single, primitive multiple, compound single child field, and compound multiple child field.'
      }
    }
  }
}

async function getKeywordExternalVocabularyInput(canvasElement: HTMLElement) {
  return waitFor(() => {
    const input = canvasElement.querySelector<HTMLInputElement>(
      '[data-cvoc-field="keywordTermURI"]'
    )

    if (input === null) {
      throw new Error('Expected keyword external vocabulary input to be rendered')
    }

    return input
  })
}

async function typeIntoExternalVocabularyInput(
  canvasElement: HTMLElement,
  fieldName: string,
  value: string
) {
  const input = await getExternalVocabularyInput(canvasElement, fieldName)

  await userEvent.type(input, value)
}

async function getExternalVocabularyInput(canvasElement: HTMLElement, fieldName: string) {
  return waitFor(() => {
    const input = canvasElement.querySelector<HTMLInputElement>(`[data-cvoc-field="${fieldName}"]`)

    if (input === null) {
      throw new Error(`Expected ${fieldName} external vocabulary input to be rendered`)
    }

    return input
  })
}

class ExternalVocabularyComponentTypesMetadataBlockInfoRepository
  implements MetadataBlockInfoRepository
{
  getByName(_name: string): Promise<MetadataBlockInfoDisplayFormat | undefined> {
    return Promise.resolve(undefined)
  }

  getAll(): Promise<MetadataBlockInfo[]> {
    return Promise.resolve([externalVocabularyComponentTypesMetadataBlock])
  }

  getDisplayedOnCreateByCollectionId(_collectionId: number | string): Promise<MetadataBlockInfo[]> {
    return Promise.resolve([externalVocabularyComponentTypesMetadataBlock])
  }

  getByCollectionId(_collectionId: number | string): Promise<MetadataBlockInfo[]> {
    return Promise.resolve([externalVocabularyComponentTypesMetadataBlock])
  }

  getAllFacetableMetadataFields(): Promise<MetadataField[]> {
    return Promise.resolve([])
  }
}

const externalVocabularyComponentTypesMetadataBlock: MetadataBlockInfo = {
  id: 9001,
  name: 'externalVocabularyComponentTypes',
  displayName: 'External Vocabulary Component Types',
  displayOnCreate: true,
  metadataFields: {
    demoPrimitiveSingleTermURI: primitiveField({
      name: 'demoPrimitiveSingleTermURI',
      displayName: 'Primitive Single External Vocabulary',
      title: 'Primitive Single',
      description: 'External vocabulary attached directly to a single primitive metadata field.',
      multiple: false,
      displayOrder: 1
    }),
    demoPrimitiveMultipleTermURI: primitiveField({
      name: 'demoPrimitiveMultipleTermURI',
      displayName: 'Primitive Multiple External Vocabulary',
      title: 'Primitive Multiple',
      description:
        'External vocabulary attached directly to a repeatable primitive metadata field.',
      multiple: true,
      displayOrder: 2
    }),
    demoCompoundSingle: compoundField({
      name: 'demoCompoundSingle',
      displayName: 'Compound Single External Vocabulary',
      title: 'Compound Single',
      description: 'External vocabulary attached to one child inside a single compound field.',
      multiple: false,
      displayOrder: 3,
      childMetadataFields: {
        demoCompoundSingleTermURI: primitiveField({
          name: 'demoCompoundSingleTermURI',
          displayName: 'Compound Single Term URI',
          title: 'Organization',
          description: 'Searches a ROR-style organization provider.',
          multiple: false,
          displayOrder: 4
        }),
        demoCompoundSingleName: primitiveField({
          name: 'demoCompoundSingleName',
          displayName: 'Compound Single Organization Name',
          title: 'Organization Name',
          description: 'Managed field populated from the selected external vocabulary term.',
          multiple: false,
          displayOrder: 5
        }),
        demoCompoundSingleVocabulary: primitiveField({
          name: 'demoCompoundSingleVocabulary',
          displayName: 'Compound Single Vocabulary',
          title: 'Vocabulary',
          description: 'Managed field populated from the selected external vocabulary term.',
          multiple: false,
          displayOrder: 6
        })
      }
    }),
    demoCompoundMultiple: compoundField({
      name: 'demoCompoundMultiple',
      displayName: 'Compound Multiple External Vocabulary',
      title: 'Compound Multiple',
      description: 'External vocabulary attached to one child inside a repeatable compound field.',
      multiple: true,
      displayOrder: 7,
      childMetadataFields: {
        demoCompoundMultipleTermURI: primitiveField({
          name: 'demoCompoundMultipleTermURI',
          displayName: 'Compound Multiple Term URI',
          title: 'Organization',
          description: 'Searches a ROR-style organization provider.',
          multiple: false,
          displayOrder: 8
        }),
        demoCompoundMultipleName: primitiveField({
          name: 'demoCompoundMultipleName',
          displayName: 'Compound Multiple Organization Name',
          title: 'Organization Name',
          description: 'Managed field populated from the selected external vocabulary term.',
          multiple: false,
          displayOrder: 9
        }),
        demoCompoundMultipleVocabulary: primitiveField({
          name: 'demoCompoundMultipleVocabulary',
          displayName: 'Compound Multiple Vocabulary',
          title: 'Vocabulary',
          description: 'Managed field populated from the selected external vocabulary term.',
          multiple: false,
          displayOrder: 10
        })
      }
    })
  }
}

function primitiveField({
  name,
  displayName,
  title,
  description,
  multiple,
  displayOrder
}: {
  name: string
  displayName: string
  title: string
  description: string
  multiple: boolean
  displayOrder: number
}): MetadataField {
  return {
    name,
    displayName,
    title,
    type: 'URL',
    watermark: '',
    description,
    multiple,
    isControlledVocabulary: false,
    displayFormat: '<a href="#VALUE" target="_blank" rel="noopener">#VALUE</a>',
    isRequired: false,
    displayOrder,
    typeClass: 'primitive',
    displayOnCreate: true,
    isAdvancedSearchFieldType: false
  }
}

function compoundField({
  name,
  displayName,
  title,
  description,
  multiple,
  displayOrder,
  childMetadataFields
}: {
  name: string
  displayName: string
  title: string
  description: string
  multiple: boolean
  displayOrder: number
  childMetadataFields: Record<string, MetadataField>
}): MetadataField {
  return {
    name,
    displayName,
    title,
    type: 'NONE',
    watermark: '',
    description,
    multiple,
    isControlledVocabulary: false,
    displayFormat: '',
    isRequired: false,
    displayOrder,
    typeClass: 'compound',
    displayOnCreate: true,
    isAdvancedSearchFieldType: false,
    childMetadataFields
  }
}

async function getAuthorAffiliationExternalVocabularyInput(canvasElement: HTMLElement) {
  return waitFor(() => {
    const input = canvasElement.querySelector<HTMLInputElement>(
      '[data-cvoc-field="authorAffiliation"]'
    )

    if (input === null) {
      throw new Error('Expected author affiliation external vocabulary input to be rendered')
    }

    return input
  })
}
