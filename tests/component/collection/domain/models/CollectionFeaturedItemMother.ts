import {
  CollectionFeaturedItem,
  CustomFeaturedItem,
  DvObjectFeaturedItem,
  FeaturedItemType
} from '@/collection/domain/models/CollectionFeaturedItem'

export class CollectionFeaturedItemMother {
  static createFeaturedItems(): CollectionFeaturedItem[] {
    return [
      {
        id: 1,
        imageFileUrl: '/storybook/css.webp',
        type: FeaturedItemType.CUSTOM,
        displayOrder: 1,
        content:
          '<h1 class="rte-heading">Some Title</h1><p class="rte-paragraph">Hello <strong class="rte-bold">Dataverse</strong> <em class="rte-italic">new </em><s class="rte-strike">rick</s> <strong class="rte-bold">rich</strong> <em class="rte-italic">text</em> <code class="rte-code">editor</code>! This is a <a target="_blank" rel="noopener noreferrer nofollow" class="rte-link" href="https://beta.dataverse.org/spa/">link</a>.</p><ul class="rte-bullet-list"><li><p class="rte-paragraph">Item</p></li><li><p class="rte-paragraph">Item</p></li></ul><ol class="rte-ordered-list"><li><p class="rte-paragraph">Item 1</p></li><li><p class="rte-paragraph">Item 2</p></li></ol><pre class="rte-code-block"><code class="language-typescriptreact">onUpdate: ({ editor }) =&gt; onChange &amp;&amp; onChange(editor.getHTML())</code></pre><blockquote class="rte-blockquote"><p class="rte-paragraph">This is a blockquoute</p></blockquote><p class="rte-paragraph"></p><p class="rte-paragraph"></p>'
      },
      {
        id: 2,
        displayOrder: 2,
        type: FeaturedItemType.CUSTOM,
        content:
          '<h1 class="rte-heading">Some Title</h1><p class="rte-paragraph">Hello <strong class="rte-bold">Dataverse</strong> <em class="rte-italic">new </em><s class="rte-strike">rick</s> <strong class="rte-bold">rich</strong> <em class="rte-italic">text</em> <code class="rte-code">editor</code>! This is a <a target="_blank" rel="noopener noreferrer nofollow" class="rte-link" href="https://beta.dataverse.org/spa/">link</a>.</p><ul class="rte-bullet-list"><li><p class="rte-paragraph">Item</p></li><li><p class="rte-paragraph">Item</p></li></ul><ol class="rte-ordered-list"><li><p class="rte-paragraph">Item 1</p></li><li><p class="rte-paragraph">Item 2</p></li></ol><pre class="rte-code-block"><code class="language-typescriptreact">onUpdate: ({ editor }) =&gt; onChange &amp;&amp; onChange(editor.getHTML())</code></pre><blockquote class="rte-blockquote"><p class="rte-paragraph">This is a blockquoute</p></blockquote><p class="rte-paragraph"></p><p class="rte-paragraph"></p>'
      },
      {
        id: 3,
        imageFileUrl: '/storybook/books.webp',
        displayOrder: 3,
        type: FeaturedItemType.CUSTOM,
        content:
          '<h1 class="rte-heading">Some Title</h1><p>Join a growing community of Harvard and worldwide researchers who share data in the Harvard Dataverse Repository</p>'
      },
      {
        id: 4,
        imageFileUrl: '/storybook/campus.jpg',
        displayOrder: 4,
        type: FeaturedItemType.CUSTOM,
        content:
          '<h1 class="rte-heading">Some Title</h1><p>Join a growing community of Harvard and worldwide researchers who share data in the Harvard Dataverse Repository</p>'
      }
    ]
  }

  static createCustomFeaturedItem(
    img: 'css' | 'books',
    props?: Partial<CustomFeaturedItem>
  ): CustomFeaturedItem {
    return {
      id: 1,
      imageFileUrl: `/storybook/${img}.webp`,
      displayOrder: 1,
      type: FeaturedItemType.CUSTOM,
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
      dvObjectId: '12345',
      type: FeaturedItemType.COLLECTION,
      description:
        'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Explicabo impedit perferendis expedita fuga harum quis excepturi porro accusantium earum quos. ',
      ...props
    }
  }

  static createDvObjectDatasetFeaturedItem(
    props?: Partial<DvObjectFeaturedItem>
  ): DvObjectFeaturedItem {
    return {
      id: 1,
      displayOrder: 1,
      dvObjectId: '12345',
      type: FeaturedItemType.DATASET,
      description:
        'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Explicabo impedit perferendis expedita fuga harum quis excepturi porro accusantium earum quos. ',
      ...props
    }
  }

  static createDvObjectFileFeaturedItem(
    props?: Partial<DvObjectFeaturedItem>
  ): DvObjectFeaturedItem {
    return {
      id: 1,
      displayOrder: 1,
      dvObjectId: '12345',
      type: FeaturedItemType.FILE,
      description:
        'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Explicabo impedit perferendis expedita fuga harum quis excepturi porro accusantium earum quos. ',
      ...props
    }
  }
}
