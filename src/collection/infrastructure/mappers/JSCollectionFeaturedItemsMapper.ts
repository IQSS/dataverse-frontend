import {
  CollectionFeaturedItem,
  CustomFeaturedItem,
  FeaturedItemType
} from '@/collection/domain/models/CollectionFeaturedItem'

export class JSCollectionFeaturedItemsMapper {
  static toCollectionFeaturedItems(
    jsCollectionFeaturedItems: CollectionFeaturedItem[]
  ): CollectionFeaturedItem[] {
    return jsCollectionFeaturedItems.map((item) => {
      const { id, displayOrder, content, imageFileName, imageFileUrl } = item as CustomFeaturedItem

      return {
        id,
        type: FeaturedItemType.CUSTOM,
        displayOrder,
        content: content,
        imageFileName: imageFileName,
        imageFileUrl: imageFileUrl
      }
    })
  }
}
