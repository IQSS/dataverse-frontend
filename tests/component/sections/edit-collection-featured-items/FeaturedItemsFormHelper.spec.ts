import { CollectionFeaturedItem } from '@/collection/domain/models/CollectionFeaturedItem'
import { FeaturedItemsFormHelper } from '@/sections/edit-collection-featured-items/featured-items-form/FeaturedItemsFormHelper'
import { FeaturedItemField } from '@/sections/edit-collection-featured-items/types'
import { CollectionFeaturedItemMother } from '@tests/component/collection/domain/models/CollectionFeaturedItemMother'

const testFeaturedItemOne = CollectionFeaturedItemMother.createFeaturedItem({
  id: 1,
  imageFileUrl: 'https://via.placeholder.com/400x400',
  displayOrder: 1,
  content: '<h1 class="rte-heading">Featured Item One</h1>'
})

const testFeaturedItemTwo = CollectionFeaturedItemMother.createFeaturedItem({
  id: 2,
  displayOrder: 2,
  content: '<h1 class="rte-heading">Featured Item Two</h1>',
  imageFileUrl: undefined
})

const testCollectionFeaturedItems = [testFeaturedItemOne, testFeaturedItemTwo]

const testFormFields: FeaturedItemField[] = [
  {
    content: '<h1 class="rte-heading">Featured Item One</h1>',
    image: 'https://via.placeholder.com/400x400',
    itemId: 1
  },
  {
    content: '<h1 class="rte-heading">Featured Item Two</h1>',
    image: null,
    itemId: 2
  },
  {
    content: '<h1 class="rte-heading">Featured Item Three</h1>',
    image: new File([''], 'image.jpg')
  },
  {
    content: '<h1 class="rte-heading">Featured Item Four</h1>',
    image: null
  },
  {
    content: '<h1 class="rte-heading">Featured Item Five</h1>',
    image: new File([''], 'image.jpg'),
    itemId: 3
  }
]

describe('FeaturedItemsFormHelper', () => {
  describe('defineFormDefaultFeaturedItems', () => {
    it('should return default featured items when collection featured items is empty', () => {
      const collectionFeaturedItems: CollectionFeaturedItem[] = []

      const result = FeaturedItemsFormHelper.defineFormDefaultFeaturedItems(collectionFeaturedItems)

      expect(result).to.deep.equal([
        {
          content: '',
          image: null
        }
      ])
    })

    it('should return collection featured items mapped to form data', () => {
      const result = FeaturedItemsFormHelper.defineFormDefaultFeaturedItems(
        testCollectionFeaturedItems
      )

      expect(result).to.deep.equal([
        {
          content: '<h1 class="rte-heading">Featured Item One</h1>',
          image: 'https://via.placeholder.com/400x400',
          itemId: 1
        },
        {
          content: '<h1 class="rte-heading">Featured Item Two</h1>',
          image: null,
          itemId: 2
        }
      ])
    })
  })

  it('should transform form fields mapped to collection featured items', () => {
    const result = FeaturedItemsFormHelper.transformFormFieldsToFeaturedItems(testFormFields)

    expect(result[0].id).to.deep.equal(testFormFields[0].itemId)
    expect(result[0].content).to.deep.equal(testFormFields[0].content)
    expect(result[0].imageFileUrl).to.deep.equal(testFormFields[0].image)
    expect(result[0].displayOrder).to.deep.equal(1)

    expect(result[1].id).to.deep.equal(testFormFields[1].itemId)
    expect(result[1].content).to.deep.equal(testFormFields[1].content)
    expect(result[1].imageFileUrl).to.deep.equal(undefined)
    expect(result[1].displayOrder).to.deep.equal(2)

    expect(result[2].id).to.not.deep.equal(testFormFields[2].itemId)
    expect(result[2].content).to.deep.equal(testFormFields[2].content)
    expect(result[2].imageFileUrl).to.include('blob:')
    expect(result[2].displayOrder).to.deep.equal(3)
  })

  it('should define featured items DTO based on form data', () => {
    const result = FeaturedItemsFormHelper.defineFeaturedItemsDTO(testFormFields)

    expect(result[0].id).to.deep.equal(testFormFields[0].itemId)
    expect(result[0].content).to.deep.equal(testFormFields[0].content)
    expect(result[0].file).to.deep.equal(undefined)
    expect(result[0].keepFile).to.deep.equal(true)
    expect(result[0].displayOrder).to.deep.equal(0)

    expect(result[1].id).to.deep.equal(testFormFields[1].itemId)
    expect(result[1].content).to.deep.equal(testFormFields[1].content)
    expect(result[1].file).to.deep.equal(undefined)
    expect(result[1].keepFile).to.deep.equal(false)
    expect(result[1].displayOrder).to.deep.equal(1)

    expect(result[2].id).to.deep.equal(undefined)
    expect(result[2].content).to.deep.equal(testFormFields[2].content)
    expect(result[2].file).to.deep.equal(testFormFields[2].image)
    expect(result[2].keepFile).to.deep.equal(false)
    expect(result[2].displayOrder).to.deep.equal(2)

    expect(result[3].id).to.deep.equal(undefined)
    expect(result[3].content).to.deep.equal(testFormFields[3].content)
    expect(result[3].file).to.deep.equal(undefined)
    expect(result[3].keepFile).to.deep.equal(false)
    expect(result[3].displayOrder).to.deep.equal(3)

    expect(result[4].id).to.deep.equal(testFormFields[4].itemId)
    expect(result[4].content).to.deep.equal(testFormFields[4].content)
    expect(result[4].file).to.deep.equal(testFormFields[4].image)
    expect(result[4].keepFile).to.deep.equal(false)
    expect(result[4].displayOrder).to.deep.equal(4)
  })

  describe('formatBytes', () => {
    it('should return 0 Bytes when bytes is 0', () => {
      const result = FeaturedItemsFormHelper.formatBytes(0)

      expect(result).to.deep.equal('0 Bytes')
    })

    it('should return formatted bytes', () => {
      const result1 = FeaturedItemsFormHelper.formatBytes(1024)
      const oneMbResult = FeaturedItemsFormHelper.formatBytes(1_048_576)
      const oneGbResult = FeaturedItemsFormHelper.formatBytes(1_073_741_824)
      const oneTbResult = FeaturedItemsFormHelper.formatBytes(1_099_511_627_776)
      const withNegativeDecimals = FeaturedItemsFormHelper.formatBytes(10_000, -1)
      const withZeroDecimals = FeaturedItemsFormHelper.formatBytes(10_000, 0)
      const withOneDecimals = FeaturedItemsFormHelper.formatBytes(10_000, 1)
      const withTwoDecimals = FeaturedItemsFormHelper.formatBytes(10_000, 2)

      expect(result1).to.deep.equal('1 KB')
      expect(oneMbResult).to.deep.equal('1 MB')
      expect(oneGbResult).to.deep.equal('1 GB')
      expect(oneTbResult).to.deep.equal('1 TB')
      expect(withNegativeDecimals).to.deep.equal('10 KB')
      expect(withZeroDecimals).to.deep.equal('10 KB')
      expect(withOneDecimals).to.deep.equal('9.8 KB')
      expect(withTwoDecimals).to.deep.equal('9.77 KB')
    })
  })
})
