import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import { ItemsSortBy } from '@/sections/collection/collection-items-panel/items-list/ItemsSortBy'
import { OrderType, SortType } from '@/collection/domain/models/CollectionSearchCriteria'
/*
<ItemsSortBy
                      isLoadingCollectionItems={isLoadingItems}
                      currentSortType={sortSelected}
                      currentSortOrder={orderSelected}
                      currentSearchText={searchText}
                      onSortChange={onSortChange}></ItemsSortBy>
 */
const meta: Meta<typeof ItemsSortBy> = {
  title: 'Sections/Collection Page/Sort Button',
  component: ItemsSortBy,
  decorators: [WithI18next],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}

export default meta
type Story = StoryObj<typeof ItemsSortBy>

export const Default: Story = {
  render: () => (
    <ItemsSortBy
      isLoadingCollectionItems={false}
      currentSortType={undefined}
      currentSortOrder={undefined}
      currentSearchText={'test'}
      onSortChange={() => {}}
    />
  )
}

export const WithSortType: Story = {
  render: () => (
    <ItemsSortBy
      isLoadingCollectionItems={false}
      currentSortType={SortType.NAME}
      currentSortOrder={OrderType.DESC}
      currentSearchText={undefined}
      onSortChange={() => {}}
    />
  )
}
