import { FeaturedItem, FeaturedItemType } from '@/collection/domain/models/FeaturedItem'
import { CustomFeaturedItemDTO } from '@/collection/domain/useCases/DTOs/CollectionFeaturedItemsDTO'
import { FeaturedItemsFormHelper } from '@/sections/edit-collection-featured-items/featured-items-form/FeaturedItemsFormHelper'
import {
  CustomFeaturedItemField,
  DvObjectFeaturedItemField,
  FeaturedItemField
} from '@/sections/edit-collection-featured-items/types'
import { CollectionFeaturedItemMother } from '@tests/component/collection/domain/models/CollectionFeaturedItemMother'

const testFeaturedItemOne = CollectionFeaturedItemMother.createCustomFeaturedItem('css', {
  id: 1,
  imageFileUrl: 'https://via.placeholder.com/400x400',
  displayOrder: 1,
  content: '<h1 class="rte-heading">Featured Item One</h1>'
})

const testFeaturedItemTwo = CollectionFeaturedItemMother.createCustomFeaturedItem('css', {
  id: 2,
  displayOrder: 2,
  content: '<h1 class="rte-heading">Featured Item Two</h1>',
  imageFileUrl: undefined
})

const testFeaturedItemThree = CollectionFeaturedItemMother.createDvObjectCollectionFeaturedItem({
  id: 3,
  dvObjectIdentifier: 'sample-collection-id',
  displayOrder: 3
})
const testFeaturedItemFour = CollectionFeaturedItemMother.createDvObjectDatasetFeaturedItem({
  id: 4,
  dvObjectIdentifier: 'doi:10.5072/FK2/ABC123',
  displayOrder: 4
})
const testFeaturedItemFive = CollectionFeaturedItemMother.createDvObjectFileFeaturedItem({
  id: 5,
  dvObjectIdentifier: '44',
  displayOrder: 5
})

const testCollectionFeaturedItems = [
  testFeaturedItemOne,
  testFeaturedItemTwo,
  testFeaturedItemThree,
  testFeaturedItemFour,
  testFeaturedItemFive
]

const testFormFields: FeaturedItemField[] = [
  {
    itemId: 1,
    type: FeaturedItemType.CUSTOM,
    content: '<h1 class="rte-heading">Featured Item One</h1>',
    image: 'https://via.placeholder.com/400x400'
  },
  {
    itemId: 2,
    type: FeaturedItemType.CUSTOM,
    content: '<h1 class="rte-heading">Featured Item Two</h1>',
    image: null
  },
  {
    type: FeaturedItemType.CUSTOM,
    content: '<h1 class="rte-heading">Featured Item Three</h1>',
    image: new File([''], 'image.jpg')
  },
  {
    type: FeaturedItemType.CUSTOM,
    content: '<h1 class="rte-heading">Featured Item Four</h1>',
    image: null
  },
  {
    type: FeaturedItemType.CUSTOM,
    content: '<h1 class="rte-heading">Featured Item Five</h1>',
    image: new File([''], 'image.jpg'),
    itemId: 3
  },
  {
    type: FeaturedItemType.COLLECTION,
    dvObjectIdentifier: 'sample-collection-id',
    dvObjectUrl: 'http://localhost:8000/spa/collections/sample-collection-id',
    itemId: 4
  },
  {
    type: FeaturedItemType.DATASET,
    dvObjectIdentifier: 'doi:10.5072/FK2/ABC123',
    dvObjectUrl: 'http://localhost:8000/spa/datasets?persistentId=doi:10.5072/FK2/ABC123'
  },
  {
    type: FeaturedItemType.FILE,
    dvObjectIdentifier: '44',
    dvObjectUrl: 'http://localhost:8000/spa/files?id=44&datasetVersion=2.0',
    itemId: 6
  }
]

describe('FeaturedItemsFormHelper', () => {
  describe('defineFormDefaultFeaturedItems', () => {
    it('should return default featured items when collection featured items is empty', () => {
      const collectionFeaturedItems: FeaturedItem[] = []

      const result = FeaturedItemsFormHelper.defineFormDefaultFeaturedItems(collectionFeaturedItems)

      expect(result).to.deep.equal([
        {
          type: 'base'
        }
      ])
    })

    it('should return collection featured items mapped to form data', () => {
      const result = FeaturedItemsFormHelper.defineFormDefaultFeaturedItems(
        testCollectionFeaturedItems
      )

      const firstItem = result[0] as CustomFeaturedItemField
      const secondItem = result[1] as CustomFeaturedItemField
      const thirdItem = result[2] as DvObjectFeaturedItemField
      const fourthItem = result[3] as DvObjectFeaturedItemField
      const fifthItem = result[4] as DvObjectFeaturedItemField

      expect(firstItem.itemId).to.deep.equal(testFeaturedItemOne.id)
      expect(firstItem.type).to.deep.equal(FeaturedItemType.CUSTOM)
      expect(firstItem.content).to.deep.equal('<h1 class="rte-heading">Featured Item One</h1>')
      expect(firstItem.image).to.deep.equal(testFeaturedItemOne.imageFileUrl)

      expect(secondItem.itemId).to.deep.equal(testFeaturedItemTwo.id)
      expect(secondItem.type).to.deep.equal(FeaturedItemType.CUSTOM)
      expect(secondItem.content).to.deep.equal('<h1 class="rte-heading">Featured Item Two</h1>')
      expect(secondItem.image).to.deep.equal(null)

      expect(thirdItem.type).to.deep.equal(FeaturedItemType.COLLECTION)
      expect(thirdItem.dvObjectIdentifier).to.deep.equal('sample-collection-id')
      expect(thirdItem.dvObjectUrl).to.include(
        `collections/${testFeaturedItemThree.dvObjectIdentifier}`
      )
      expect(thirdItem.itemId).to.deep.equal(testFeaturedItemThree.id)
      expect(fourthItem.type).to.deep.equal(FeaturedItemType.DATASET)
      expect(fourthItem.dvObjectIdentifier).to.deep.equal('doi:10.5072/FK2/ABC123')
      expect(fourthItem.dvObjectUrl).to.include(
        `datasets?persistentId=${testFeaturedItemFour.dvObjectIdentifier}`
      )
      expect(fourthItem.itemId).to.deep.equal(testFeaturedItemFour.id)
      expect(fifthItem.type).to.deep.equal(FeaturedItemType.FILE)
      expect(fifthItem.dvObjectIdentifier).to.deep.equal('44')
      expect(fifthItem.dvObjectUrl).to.include(
        `files?id=${testFeaturedItemFive.dvObjectIdentifier}`
      )
      expect(fifthItem.itemId).to.deep.equal(testFeaturedItemFive.id)
      expect(result.length).to.deep.equal(5)
    })
  })

  it('should transform form fields mapped to collection featured items', () => {
    const customFeaturedItemsFields = testFormFields.filter(
      (field): field is CustomFeaturedItemField => field.type === FeaturedItemType.CUSTOM
    )
    const result =
      FeaturedItemsFormHelper.transformCustomFormFieldsToFeaturedItems(customFeaturedItemsFields)

    const firstItem = result[0]
    const secondItem = result[1]
    const thirdItem = result[2]
    const fourthItem = result[3]
    const fifthItem = result[4]

    expect(firstItem.id).to.deep.equal(testFormFields[0].itemId)
    expect(firstItem.content).to.deep.equal((testFormFields[0] as CustomFeaturedItemField).content)
    expect(firstItem.imageFileUrl).to.deep.equal(
      (testFormFields[0] as CustomFeaturedItemField).image
    )
    expect(firstItem.displayOrder).to.deep.equal(1)

    expect(secondItem.id).to.deep.equal(testFormFields[1].itemId)
    expect(secondItem.content).to.deep.equal((testFormFields[1] as CustomFeaturedItemField).content)
    expect(secondItem.imageFileUrl).to.deep.equal(undefined)
    expect(secondItem.displayOrder).to.deep.equal(2)

    expect(thirdItem.id).to.not.deep.equal(testFormFields[2].itemId)
    expect(thirdItem.content).to.deep.equal((testFormFields[2] as CustomFeaturedItemField).content)
    expect(thirdItem.imageFileUrl).to.include('blob:')
    expect(thirdItem.displayOrder).to.deep.equal(3)

    expect(fourthItem.id).to.not.deep.equal(testFormFields[3].itemId)
    expect(fourthItem.content).to.deep.equal((testFormFields[3] as CustomFeaturedItemField).content)
    expect(fourthItem.imageFileUrl).to.deep.equal(undefined)
    expect(fourthItem.displayOrder).to.deep.equal(4)

    expect(fifthItem.id).to.deep.equal(testFormFields[4].itemId)
    expect(fifthItem.content).to.deep.equal((testFormFields[4] as CustomFeaturedItemField).content)
    expect(fifthItem.imageFileUrl).to.include('blob:')
    expect(fifthItem.displayOrder).to.deep.equal(5)
  })

  it('should define featured items DTO based on form data', () => {
    const result = FeaturedItemsFormHelper.defineFeaturedItemsDTO(testFormFields)

    const firstItem = result[0] as CustomFeaturedItemDTO
    const secondItem = result[1] as CustomFeaturedItemDTO
    const thirdItem = result[2] as CustomFeaturedItemDTO
    const fourthItem = result[3] as CustomFeaturedItemDTO
    const fifthItem = result[4] as CustomFeaturedItemDTO

    expect(firstItem.id).to.deep.equal(testFormFields[0].itemId)
    expect(firstItem.content).to.deep.equal((testFormFields[0] as CustomFeaturedItemField).content)
    expect(firstItem.file).to.deep.equal(undefined)
    expect(firstItem.keepFile).to.deep.equal(true)
    expect(firstItem.displayOrder).to.deep.equal(0)

    expect(result[1].id).to.deep.equal(testFormFields[1].itemId)
    expect(secondItem.content).to.deep.equal((testFormFields[1] as CustomFeaturedItemField).content)
    expect(secondItem.file).to.deep.equal(undefined)
    expect(secondItem.keepFile).to.deep.equal(false)
    expect(secondItem.displayOrder).to.deep.equal(1)

    expect(thirdItem.id).to.deep.equal(undefined)
    expect(thirdItem.content).to.deep.equal((testFormFields[2] as CustomFeaturedItemField).content)
    expect(thirdItem.file).to.deep.equal((testFormFields[2] as CustomFeaturedItemField).image)
    expect(thirdItem.keepFile).to.deep.equal(false)
    expect(thirdItem.displayOrder).to.deep.equal(2)

    expect(fourthItem.id).to.deep.equal(undefined)
    expect(fourthItem.content).to.deep.equal((testFormFields[3] as CustomFeaturedItemField).content)
    expect(fourthItem.file).to.deep.equal(undefined)
    expect(fourthItem.keepFile).to.deep.equal(false)
    expect(fourthItem.displayOrder).to.deep.equal(3)

    expect(fifthItem.id).to.deep.equal(testFormFields[4].itemId)
    expect(fifthItem.content).to.deep.equal((testFormFields[4] as CustomFeaturedItemField).content)
    expect(fifthItem.file).to.deep.equal((testFormFields[4] as CustomFeaturedItemField).image)
    expect(fifthItem.keepFile).to.deep.equal(false)
    expect(fifthItem.displayOrder).to.deep.equal(4)
  })

  describe('extractDvObjectTypeAndIdentiferFromUrlValue', () => {
    it('should return null when url is empty', () => {
      const result = FeaturedItemsFormHelper.extractDvObjectTypeAndIdentiferFromUrlValue('')

      expect(result).to.deep.equal({ type: null, identifier: null })
    })

    it('should return dataset type and identifier from DOI pasted directly', () => {
      const result = FeaturedItemsFormHelper.extractDvObjectTypeAndIdentiferFromUrlValue(
        'https://doi.org/10.70122/DVN/Q3ZSNA'
      )

      expect(result).to.deep.equal({
        type: FeaturedItemType.DATASET,
        identifier: 'https://doi.org/10.70122/DVN/Q3ZSNA'
      })
    })

    it('should return collection type and identifier from SPA URL', () => {
      const result = FeaturedItemsFormHelper.extractDvObjectTypeAndIdentiferFromUrlValue(
        'http://localhost:8000/spa/collections/dataverse-admin-collection'
      )

      expect(result).to.deep.equal({
        type: FeaturedItemType.COLLECTION,
        identifier: 'dataverse-admin-collection'
      })
    })

    it('should return collection type and identifier from JSF URL', () => {
      const result = FeaturedItemsFormHelper.extractDvObjectTypeAndIdentiferFromUrlValue(
        'http://localhost:8000/dataverse/dataverse-admin-collection'
      )

      expect(result).to.deep.equal({
        type: FeaturedItemType.COLLECTION,
        identifier: 'dataverse-admin-collection'
      })
    })

    it('should return dataset type and identifier from SPA URL', () => {
      const result = FeaturedItemsFormHelper.extractDvObjectTypeAndIdentiferFromUrlValue(
        'http://localhost:8000/spa/datasets?persistentId=doi:10.5072/FK2/HIS9DO'
      )

      expect(result).to.deep.equal({
        type: FeaturedItemType.DATASET,
        identifier: 'doi:10.5072/FK2/HIS9DO'
      })
    })

    it('should return dataset type and identifier from JSF URL', () => {
      const result = FeaturedItemsFormHelper.extractDvObjectTypeAndIdentiferFromUrlValue(
        'http://localhost:8000/dataset.xhtml?persistentId=doi:10.5072/FK2/HIS9DO'
      )

      expect(result).to.deep.equal({
        type: FeaturedItemType.DATASET,
        identifier: 'doi:10.5072/FK2/HIS9DO'
      })
    })

    it('should return file type and identifier from SPA URL', () => {
      const result = FeaturedItemsFormHelper.extractDvObjectTypeAndIdentiferFromUrlValue(
        'http://localhost:8000/spa/files?id=4&datasetVersion=2.0'
      )

      expect(result).to.deep.equal({
        type: FeaturedItemType.FILE,
        identifier: '4'
      })
    })

    it('should return file type and identifier from JSF URL', () => {
      const result = FeaturedItemsFormHelper.extractDvObjectTypeAndIdentiferFromUrlValue(
        'http://localhost:8000/file.xhtml?fileId=4&version=2.0'
      )

      expect(result).to.deep.equal({
        type: FeaturedItemType.FILE,
        identifier: '4'
      })
    })
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

  describe('getAspectRatioString', () => {
    it('should return 1:1 when width and height are equal', () => {
      const result = FeaturedItemsFormHelper.getAspectRatioString(400, 400)

      expect(result).to.deep.equal('1:1')
    })

    it('should return 4:3 when width is 12 and height is 9', () => {
      const result = FeaturedItemsFormHelper.getAspectRatioString(12, 9)

      expect(result).to.deep.equal('4:3')
    })

    it('should return 1:4 when width is 2 and height is 8', () => {
      const result = FeaturedItemsFormHelper.getAspectRatioString(2, 8)

      expect(result).to.deep.equal('1:4')
    })

    it('should scale down the aspect ratio to a more user friendly value', () => {
      // For example, an image with dimensions 800x537 will be scale down to 16:11
      const result = FeaturedItemsFormHelper.getAspectRatioString(800, 537)

      expect(result).to.deep.equal('16:11')
    })
  })
})
