import { SearchInput } from '@/sections/homepage/search-input/SearchInput'
import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../WithI18next'

const meta: Meta<typeof SearchInput> = {
  title: 'Sections/Homepage/SearchInput',
  component: SearchInput,
  decorators: [WithI18next],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}

export default meta
type Story = StoryObj<typeof SearchInput>

export const Default: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBlock: '2rem'
      }}>
      <SearchInput
        searchServices={[
          {
            name: 'solr',
            displayName: 'Dataverse Standard Search'
          }
        ]}
      />
    </div>
  )
}

export const WithSearchEnginesDropdown: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBlock: '2rem'
      }}>
      <SearchInput
        searchDropdownPosition="right"
        searchServices={[
          {
            name: 'postExternalSearch',
            displayName: 'Natural Language Search'
          },
          {
            name: 'solr',
            displayName: 'Dataverse Standard Search'
          }
        ]}
      />
    </div>
  )
}

export const WithSearchEngineDropdownOnTheLeft: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBlock: '2rem'
      }}>
      <SearchInput
        searchDropdownPosition="left"
        searchServices={[
          {
            name: 'postExternalSearch',
            displayName: 'Natural Language Search'
          },
          {
            name: 'solr',
            displayName: 'Dataverse Standard Search'
          }
        ]}
      />
    </div>
  )
}
