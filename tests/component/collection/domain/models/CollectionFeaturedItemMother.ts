import { CollectionFeaturedItem } from '@/collection/domain/models/CollectionFeaturedItem'

export class CollectionFeaturedItemMother {
  static createFeaturedItems(): CollectionFeaturedItem[] {
    return [
      {
        id: 'item-1-id',
        type: 'custom',
        order: 1,
        title: 'Featured item 1',
        content:
          '<h2 class="rte-heading">Some Title</h2><h3 class="rte-heading">Heading 3</h3><p class="rte-paragraph">Hello <strong class="rte-bold">Dataverse</strong> <em class="rte-italic">new </em><s class="rte-strike">rick</s> <strong class="rte-bold">rich</strong> <em class="rte-italic">text</em> <code class="rte-code">editor</code>! This is a <a target="_blank" rel="noopener noreferrer nofollow" class="rte-link" href="https://beta.dataverse.org/spa/">link</a>.</p><ul class="rte-bullet-list"><li><p class="rte-paragraph">Item</p></li><li><p class="rte-paragraph">Item</p></li></ul><ol class="rte-ordered-list"><li><p class="rte-paragraph">Item 1</p></li><li><p class="rte-paragraph">Item 2</p></li></ol><pre class="rte-code-block"><code class="language-typescriptreact">onUpdate: ({ editor }) =&gt; onChange &amp;&amp; onChange(editor.getHTML())</code></pre><blockquote class="rte-blockquote"><p class="rte-paragraph">This is a blockquoute</p></blockquote><p class="rte-paragraph"></p><p class="rte-paragraph"></p>'
      },
      {
        id: 'item-2-id',
        type: 'custom',
        order: 2,
        title: 'Featured item 2',
        content:
          '<h2 class="rte-heading">Some Title</h2><h3 class="rte-heading">Heading 3</h3><p class="rte-paragraph">Hello <strong class="rte-bold">Dataverse</strong> <em class="rte-italic">new </em><s class="rte-strike">rick</s> <strong class="rte-bold">rich</strong> <em class="rte-italic">text</em> <code class="rte-code">editor</code>! This is a <a target="_blank" rel="noopener noreferrer nofollow" class="rte-link" href="https://beta.dataverse.org/spa/">link</a>.</p><ul class="rte-bullet-list"><li><p class="rte-paragraph">Item</p></li><li><p class="rte-paragraph">Item</p></li></ul><ol class="rte-ordered-list"><li><p class="rte-paragraph">Item 1</p></li><li><p class="rte-paragraph">Item 2</p></li></ol><pre class="rte-code-block"><code class="language-typescriptreact">onUpdate: ({ editor }) =&gt; onChange &amp;&amp; onChange(editor.getHTML())</code></pre><blockquote class="rte-blockquote"><p class="rte-paragraph">This is a blockquoute</p></blockquote><p class="rte-paragraph"></p><p class="rte-paragraph"></p>'
      },
      {
        id: 'item-3-id',
        type: 'custom',
        order: 3,
        title: 'Featured item 3',
        content:
          '<h2 class="rte-heading">Some Title</h2><h3 class="rte-heading">Heading 3</h3><p class="rte-paragraph">Hello <strong class="rte-bold">Dataverse</strong> <em class="rte-italic">new </em><s class="rte-strike">rick</s> <strong class="rte-bold">rich</strong> <em class="rte-italic">text</em> <code class="rte-code">editor</code>! This is a <a target="_blank" rel="noopener noreferrer nofollow" class="rte-link" href="https://beta.dataverse.org/spa/">link</a>.</p><ul class="rte-bullet-list"><li><p class="rte-paragraph">Item</p></li><li><p class="rte-paragraph">Item</p></li></ul><ol class="rte-ordered-list"><li><p class="rte-paragraph">Item 1</p></li><li><p class="rte-paragraph">Item 2</p></li></ol><pre class="rte-code-block"><code class="language-typescriptreact">onUpdate: ({ editor }) =&gt; onChange &amp;&amp; onChange(editor.getHTML())</code></pre><blockquote class="rte-blockquote"><p class="rte-paragraph">This is a blockquoute</p></blockquote><p class="rte-paragraph"></p><p class="rte-paragraph"></p>'
      },
      {
        id: 'item-4-id',
        type: 'custom',
        order: 4,
        title: 'Featured item 4',
        content:
          '<h2 class="rte-heading">Some Title</h2><h3 class="rte-heading">Heading 3</h3><p class="rte-paragraph">Hello <strong class="rte-bold">Dataverse</strong> <em class="rte-italic">new </em><s class="rte-strike">rick</s> <strong class="rte-bold">rich</strong> <em class="rte-italic">text</em> <code class="rte-code">editor</code>! This is a <a target="_blank" rel="noopener noreferrer nofollow" class="rte-link" href="https://beta.dataverse.org/spa/">link</a>.</p><ul class="rte-bullet-list"><li><p class="rte-paragraph">Item</p></li><li><p class="rte-paragraph">Item</p></li></ul><ol class="rte-ordered-list"><li><p class="rte-paragraph">Item 1</p></li><li><p class="rte-paragraph">Item 2</p></li></ol><pre class="rte-code-block"><code class="language-typescriptreact">onUpdate: ({ editor }) =&gt; onChange &amp;&amp; onChange(editor.getHTML())</code></pre><blockquote class="rte-blockquote"><p class="rte-paragraph">This is a blockquoute</p></blockquote><p class="rte-paragraph"></p><p class="rte-paragraph"></p>'
      }
    ]
  }

  static createFeaturedItem(props?: Partial<CollectionFeaturedItem>): CollectionFeaturedItem {
    return {
      id: 'item-id',
      type: 'custom',
      order: 1,
      title: 'Featured item',
      content:
        '<p>Lorem <strong>ipsum</strong>, dolor sit <em>amet</em> consectetur adipisicing elit. Aut alias eos expedita quae quisquam ea nemo neque incidunt amet. Odit quos libero aliquam labore dicta eaque dolorum, consequuntur itaque corrupti, reiciendis quas ab. Voluptatem alias, quam, aliquid excepturi repudiandae ab ex pariatur, est id perspiciatis porro impedit adipisci beatae ipsam.</p>',
      imageUrl: 'https://via.placeholder.com/150x80',
      ...props
    }
  }
}
