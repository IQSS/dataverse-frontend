import { SearchInput } from '@/sections/homepage/search-input/SearchInput'
import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../WithI18next'
import { SearchInput2 } from '@/sections/homepage/search-input/SearchInput2'

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
      <SearchInput />
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
      <SearchInput hasMoreThanOneSearchEngine={true} />
    </div>
  )
}

export const WithSearchEngineDropdownOnTheRight: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBlock: '2rem'
      }}>
      <SearchInput hasMoreThanOneSearchEngine={true} searchDropdownPosition="right" />
    </div>
  )
}

export const WithSearchEngineSelectorBelow: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBlock: '2rem'
      }}>
      <SearchInput2 hasMoreThanOneSearchEngine={true} />
    </div>
  )
}
