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
          '<p>Lorem 1 <strong>ipsum</strong>, dolor sit <em>amet</em> consectetur adipisicing elit. Aut alias eos expedita quae quisquam ea nemo neque incidunt amet. Odit quos libero aliquam labore dicta eaque dolorum, consequuntur itaque corrupti, reiciendis quas ab. Voluptatem alias, quam, aliquid excepturi repudiandae ab ex pariatur, est id perspiciatis porro impedit adipisci beatae ipsam.</p>'
      },
      {
        id: 'item-2-id',
        type: 'custom',
        order: 2,
        title: 'Featured item 2',
        content:
          '<p>Lorem 2 <strong>ipsum</strong>, dolor sit <em>amet</em> consectetur adipisicing elit. Aut alias eos expedita quae quisquam ea nemo neque incidunt amet. Odit quos libero aliquam labore dicta eaque dolorum, consequuntur itaque corrupti, reiciendis quas ab. Voluptatem alias, quam, aliquid excepturi repudiandae ab ex pariatur, est id perspiciatis porro impedit adipisci beatae ipsam.</p>',
        imageUrl: 'https://via.placeholder.com/150x80'
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
