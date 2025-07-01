import {
  FeaturedItem,
  CustomFeaturedItem,
  DvObjectFeaturedItem,
  FeaturedItemType
} from '@/collection/domain/models/FeaturedItem'

export class FeaturedItemMother {
  static createFeaturedItems(): FeaturedItem[] {
    return [
      {
        id: 1,
        type: FeaturedItemType.CUSTOM,
        imageFileUrl: '/storybook/css.webp',
        displayOrder: 1,
        content:
          '<h1 class="rte-heading">Some Title</h1><p class="rte-paragraph">Hello <strong class="rte-bold">Dataverse</strong> <em class="rte-italic">new </em><s class="rte-strike">rick</s> <strong class="rte-bold">rich</strong> <em class="rte-italic">text</em> <code class="rte-code">editor</code>! This is a <a target="_blank" rel="noopener noreferrer nofollow" class="rte-link" href="https://beta.dataverse.org/spa/">link</a>.</p><ul class="rte-bullet-list"><li><p class="rte-paragraph">Item</p></li><li><p class="rte-paragraph">Item</p></li></ul><ol class="rte-ordered-list"><li><p class="rte-paragraph">Item 1</p></li><li><p class="rte-paragraph">Item 2</p></li></ol><pre class="rte-code-block"><code class="language-typescriptreact">onUpdate: ({ editor }) =&gt; onChange &amp;&amp; onChange(editor.getHTML())</code></pre><blockquote class="rte-blockquote"><p class="rte-paragraph">This is a blockquoute</p></blockquote><p class="rte-paragraph"></p><p class="rte-paragraph"></p>'
      },
      {
        id: 2,
        type: FeaturedItemType.COLLECTION,
        dvObjectIdentifier: 'some-collection-alias',
        dvObjectDisplayName: 'Sample Collection',
        displayOrder: 2
      },
      {
        id: 3,
        type: FeaturedItemType.CUSTOM,
        imageFileUrl: '/storybook/books.webp',
        displayOrder: 3,
        content:
          '<h1 class="rte-heading">Some Title</h1><p>Join a growing community of Harvard and worldwide researchers who share data in the Harvard Dataverse Repository</p>'
      },
      {
        id: 4,
        type: FeaturedItemType.DATASET,
        dvObjectIdentifier: 'doi:10.5072/FK2/ABC123',
        dvObjectDisplayName: 'Sample Dataset',
        displayOrder: 4
      },
      {
        id: 5,
        type: FeaturedItemType.FILE,
        dvObjectIdentifier: '45',
        dvObjectDisplayName: 'Sample-File.txt',
        displayOrder: 5
      }
    ]
  }

  static createCustomFeaturedItem(
    img: 'css' | 'books',
    props?: Partial<CustomFeaturedItem>
  ): CustomFeaturedItem {
    return {
      id: 1,
      type: FeaturedItemType.CUSTOM,
      imageFileUrl: `/storybook/${img}.webp`,
      displayOrder: 1,
      content:
        '<h1 class="rte-heading">Some Title</h1><p class="rte-paragraph">Hello <strong class="rte-bold">Dataverse</strong> <em class="rte-italic">new </em><s class="rte-strike">rick</s> <strong class="rte-bold">rich</strong> <em class="rte-italic">text</em> <code class="rte-code">editor</code>! This is a <a target="_blank" rel="noopener noreferrer nofollow" class="rte-link" href="https://beta.dataverse.org/spa/">link</a>.</p><ul class="rte-bullet-list"><li><p class="rte-paragraph">Item</p></li><li><p class="rte-paragraph">Item</p></li></ul><ol class="rte-ordered-list"><li><p class="rte-paragraph">Item 1</p></li><li><p class="rte-paragraph">Item 2</p></li></ol><pre class="rte-code-block"><code class="language-typescriptreact">onUpdate: ({ editor }) =&gt; onChange &amp;&amp; onChange(editor.getHTML())</code></pre><blockquote class="rte-blockquote"><p class="rte-paragraph">This is a blockquoute</p></blockquote><p class="rte-paragraph"></p><p class="rte-paragraph"></p>',
      ...props
    }
  }

  static createDvObjectCollectionFeaturedItem(
    props?: Partial<DvObjectFeaturedItem>
  ): DvObjectFeaturedItem {
    return {
      id: 1,
      displayOrder: 1,
      type: FeaturedItemType.COLLECTION,
      dvObjectIdentifier: 'some-collection-alias',
      dvObjectDisplayName: 'Sample Collection',
      ...props
    }
  }

  static createDvObjectDatasetFeaturedItem(
    props?: Partial<DvObjectFeaturedItem>
  ): DvObjectFeaturedItem {
    return {
      id: 1,
      displayOrder: 1,
      type: FeaturedItemType.DATASET,
      dvObjectIdentifier: 'doi:10.5072/FK2/ABC123',
      dvObjectDisplayName: 'Sample Dataset',
      ...props
    }
  }

  static createDvObjectFileFeaturedItem(
    props?: Partial<DvObjectFeaturedItem>
  ): DvObjectFeaturedItem {
    return {
      id: 1,
      displayOrder: 1,
      type: FeaturedItemType.FILE,
      dvObjectIdentifier: '45',
      dvObjectDisplayName: 'Sample-File.txt',
      ...props
    }
  }
}
