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
          '<h1>Featured Item 1</h1> <p><strong>Lorem ipsum</strong> dolor sit amet, <em>consectetur adipiscing</em> elit. Vivamus luctus urna sed urna ultricies ac tempor dui sagittis.</p> <h2>Lorem Ipsum: Heading 2</h2> <p>Suspendisse potenti. In <strong>non</strong> libero a nibh <em>pellentesque</em> ultricies. Nulla facilisi.</p><ul> <li>Curabitur blandit tempus porttitor.</li> <li>Aenean lacinia bibendum nulla sed consectetur.</li> <li>Integer posuere erat a ante venenatis dapibus posuere velit aliquet.</li> </ul> <p>Quisque sit amet est et sapien ullamcorper pharetra. <strong>Vivamus venenatis</strong> vehicula ligula, a tincidunt orci blandit sed:</p> <ol> <li>Donec ullamcorper nulla non metus auctor fringilla.</li> <li>Nulla vitae elit libero, a pharetra augue.</li> <li>Cras mattis consectetur purus sit amet fermentum.</li> </ol> <blockquote>“Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent commodo cursus magna, vel scelerisque nisl consectetur et.”</blockquote> <p>Proin <code>code</code> varius, eros sit amet vestibulum interdum, lorem urna ultricies est, in malesuada sem erat id nunc.</p>',
        imageUrl: 'https://via.placeholder.com/400x400'
      },
      {
        id: 'item-2-id',
        type: 'custom',
        order: 2,
        title: 'Featured item 2',
        content:
          '<p>Lorem 2 <strong>ipsum</strong>, dolor sit <em>amet</em> consectetur adipisicing elit. Aut alias eos expedita quae quisquam ea nemo neque incidunt amet. Odit quos libero aliquam labore dicta eaque dolorum, consequuntur itaque corrupti, reiciendis quas ab. Voluptatem alias, quam, aliquid excepturi repudiandae ab ex pariatur, est id perspiciatis porro impedit adipisci beatae ipsam.</p>'
      },
      {
        id: 'item-3-id',
        type: 'custom',
        order: 3,
        title: 'Featured item 3',
        content:
          '<p>Lorem 3 <strong>ipsum</strong>, dolor sit <em>amet</em> consectetur adipisicing elit. Aut alias eos expedita quae quisquam ea nemo neque incidunt amet. Odit quos libero aliquam labore dicta eaque dolorum, consequuntur itaque corrupti, reiciendis quas ab. Voluptatem alias, quam, aliquid excepturi repudiandae ab ex pariatur, est id perspiciatis porro impedit adipisci beatae ipsam.</p>'
      },
      {
        id: 'item-4-id',
        type: 'custom',
        order: 4,
        title: 'Featured item 4',
        content:
          '<p>Lorem 4 <strong>ipsum</strong>, dolor sit <em>amet</em> consectetur adipisicing elit. Aut alias eos expedita quae quisquam ea nemo neque incidunt amet. Odit quos libero aliquam labore dicta eaque dolorum, consequuntur itaque corrupti, reiciendis quas ab. Voluptatem alias, quam, aliquid excepturi repudiandae ab ex pariatur, est id perspiciatis porro impedit adipisci beatae ipsam.</p>',
        imageUrl: 'https://via.placeholder.com/400x400'
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
