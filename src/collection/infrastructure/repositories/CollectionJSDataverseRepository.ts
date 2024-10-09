import { CollectionRepository } from '../../domain/repositories/CollectionRepository'
import { Collection } from '../../domain/models/Collection'
import {
  createCollection,
  getCollection,
  getCollectionFacets,
  getCollectionUserPermissions,
  getCollectionItems
} from '@iqss/dataverse-client-javascript'
import { JSCollectionMapper } from '../mappers/JSCollectionMapper'
import { CollectionDTO } from '../../domain/useCases/DTOs/CollectionDTO'
import { CollectionFacet } from '../../domain/models/CollectionFacet'
import { CollectionUserPermissions } from '../../domain/models/CollectionUserPermissions'
import { CollectionItemsPaginationInfo } from '../../domain/models/CollectionItemsPaginationInfo'
import { CollectionItemSubset } from '../../domain/models/CollectionItemSubset'
import { CollectionSearchCriteria } from '../../domain/models/CollectionSearchCriteria'
import { JSCollectionItemsMapper } from '../mappers/JSCollectionItemsMapper'
import { CollectionFeaturedItem } from '@/collection/domain/models/CollectionFeaturedItem'

export class CollectionJSDataverseRepository implements CollectionRepository {
  getById(id: string): Promise<Collection> {
    return getCollection
      .execute(id)
      .then((jsCollection) => JSCollectionMapper.toCollection(jsCollection))
  }

  create(collection: CollectionDTO, hostCollection?: string): Promise<number> {
    return createCollection
      .execute(collection, hostCollection)
      .then((newCollectionIdentifier) => newCollectionIdentifier)
  }

  getFacets(collectionIdOrAlias: number | string): Promise<CollectionFacet[]> {
    return getCollectionFacets.execute(collectionIdOrAlias).then((facets) => facets)
  }

  getUserPermissions(collectionIdOrAlias: number | string): Promise<CollectionUserPermissions> {
    return getCollectionUserPermissions
      .execute(collectionIdOrAlias)
      .then((jsCollectionUserPermissions) => jsCollectionUserPermissions)
  }

  getItems(
    collectionId: string,
    paginationInfo: CollectionItemsPaginationInfo,
    searchCriteria: CollectionSearchCriteria
  ): Promise<CollectionItemSubset> {
    return getCollectionItems
      .execute(collectionId, paginationInfo?.pageSize, paginationInfo?.offset, searchCriteria)
      .then((jsCollectionItemSubset) => {
        const collectionItemsPreviewsMapped = JSCollectionItemsMapper.toCollectionItemsPreviews(
          jsCollectionItemSubset.items
        )

        return {
          items: collectionItemsPreviewsMapped,
          totalItemCount: jsCollectionItemSubset.totalItemCount
        }
      })
  }

  getFeaturedItems(_collectionIdOrAlias: number | string): Promise<CollectionFeaturedItem[]> {
    // TODO:ME Mocked data for now

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            title: 'Featured item 1',
            description:
              'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aut alias eos expedita quae quisquam ea nemo neque incidunt amet. Odit quos libero aliquam labore dicta eaque dolorum, consequuntur itaque corrupti, reiciendis quas ab. Voluptatem alias, quam, aliquid excepturi repudiandae ab ex pariatur, est id perspiciatis porro impedit adipisci beatae ipsam.'
          },
          {
            title: 'Featured item 2',
            description:
              'Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem assumenda nam repellendus adipisci doloremque fugit maiores. Repudiandae sequi illo eum quod id quisquam vero enim ipsa distinctio, quia, consequatur harum dolor non voluptatibus ipsum, rem vel quo voluptates magni eveniet velit hic! Repellendus, provident? Dolore maxime ullam ut est, delectus itaque beatae alias corporis doloremque architecto magni officiis tenetur reprehenderit.',
            image: {
              url: 'https://via.placeholder.com/150x80',
              altText: 'Placeholder image item 2'
            }
          },
          {
            title: 'Featured item 3',
            description:
              'Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem assumenda nam repellendus adipisci doloremque fugit maiores. Repudiandae sequi illo eum quod id quisquam vero enim ipsa distinctio, quia, consequatur harum dolor non voluptatibus ipsum, rem vel quo voluptates magni eveniet velit hic! Repellendus, provident? Dolore maxime ullam ut est, delectus itaque beatae alias corporis doloremque architecto magni officiis tenetur reprehenderit.',
            image: {
              url: 'https://via.placeholder.com/400x400',
              altText: 'Placeholder image item 2'
            }
          },
          {
            title: 'Featured item 4',
            description:
              'Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem assumenda nam repellendus adipisci doloremque fugit maiores. Repudiandae sequi illo eum quod id quisquam vero enim ipsa distinctio, quia, consequatur harum dolor non voluptatibus ipsum, rem vel quo voluptates magni eveniet velit hic! Repellendus, provident? Dolore maxime ullam ut est, delectus itaque beatae alias corporis doloremque architecto magni officiis tenetur reprehenderit.',
            image: {
              url: 'https://via.placeholder.com/800x400',
              altText: 'Placeholder image item 2'
            }
          },
          {
            title: 'Featured item 5',
            description:
              'Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere enim alias quibusdam debitis quaerat, consectetur velit aliquid ipsum! Iusto obcaecati quibusdam hic nam voluptate. Consequuntur laborum officia aliquid recusandae ut, numquam sequi explicabo voluptatum reprehenderit, minima nulla repudiandae at magni fugit quis. Numquam architecto voluptas repudiandae vel totam officia ut? Nobis ex natus optio. Laborum veniam inventore suscipit architecto consectetur minima commodi dolore ducimus ipsam sint vitae doloremque, dolorem ullam! Iusto corporis commodi, pariatur vel magni, dolorum vero non, exercitationem cumque in deserunt? Iste quia dolor aut ullam dolorem eum quidem id accusamus officiis dolore. Quia placeat sapiente aperiam vero distinctio quidem, fugiat recusandae quisquam saepe ut, nesciunt laborum. Aspernatur ea, quasi, facilis impedit optio repellendus quo dolorum velit officia nihil mollitia provident commodi, delectus vero sint porro modi dolores? Ipsam doloribus impedit iure nemo architecto minima explicabo, eligendi dolorem voluptatem sequi aperiam, quisquam placeat ullam facere ut, minus at sit inventore enim eveniet cum. Repellendus eius quam architecto vel cum quod, tenetur neque deserunt, hic a perferendis adipisci fuga quibusdam dignissimos accusantium autem. Quisquam, ipsum harum fugit voluptatum aperiam minus corrupti hic qui impedit eveniet facere ut iure omnis error dicta nobis eum. Repellendus quia, laboriosam laudantium voluptates expedita fuga nulla? Quia nobis labore possimus debitis temporibus minus neque molestiae quam! Repellat reiciendis culpa similique odit doloribus quas praesentium quasi. Voluptatem amet iusto dolore, id, ut eligendi soluta assumenda excepturi perferendis, reiciendis odit explicabo ipsam maiores. Aut corporis eveniet quia repudiandae dolorem nam, excepturi ipsam veniam amet perferendis ullam eaque suscipit unde consequuntur asperiores maiores vel. Adipisci, asperiores. Iure quasi natus repudiandae quod, placeat blanditiis earum tenetur at dolores? Laudantium nam aperiam architecto consequatur, quos molestiae, amet sit itaque debitis neque quo? Iste repellendus vero illo deleniti eum impedit perferendis odit earum, iusto in porro id itaque quasi voluptate.'
          }
        ])

        // resolve([])
      }, 1_000)
    })
  }
}
