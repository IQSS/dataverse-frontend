import { Card, Carousel } from 'react-bootstrap'
import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons'
import { Collection } from '@/collection/domain/models/Collection'
import { MarkdownComponent } from '@/sections/dataset/markdown/MarkdownComponent'
import styles from './FeaturedItems.module.scss'

interface FeaturedItemsProps {
  collection: Collection
}

const FeaturedItems = ({ collection }: FeaturedItemsProps) => {
  return (
    <Carousel
      fade
      slide
      controls
      indicators
      interval={null}
      className={styles['featured-items-carousel']}
      prevIcon={<ChevronLeft color="black" size={40} />}
      nextIcon={<ChevronRight color="black" size={40} />}>
      {/* First item should be the description */}
      {/* Description can't be inside the cover, this one has a limited height */}
      {collection.description && (
        <Carousel.Item>
          <Card className={styles['featured-item-card']}>
            <Card.Body>
              <Card.Title as="h2">About</Card.Title>

              <MarkdownComponent markdown={collection.description} />
            </Card.Body>
          </Card>
        </Carousel.Item>
      )}

      <Carousel.Item>
        <Card className={styles['featured-item-card']}>
          <Card.Body>
            <Card.Title as="h2">Featured Item 1 (text content)</Card.Title>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Et maiores quas soluta,
              tenetur magnam deserunt voluptates natus quae facilis culpa, est veritatis ab
              consequatur provident adipisci, eligendi molestias corporis harum quia ullam tempore
              consequuntur. Voluptatibus nisi, amet eveniet odit, praesentium a voluptatem eligendi
              alias ex, tempore beatae aut numquam nobis! Unde corrupti, dignissimos blanditiis
              atque nesciunt doloribus rem et ullam quos laborum aliquam minus. Quidem ut, itaque,
              molestiae animi quam eveniet sint nostrum, non suscipit quis nihil qui veniam officia!
              Optio maiores eius totam voluptatem nam dignissimos, reiciendis soluta delectus amet.
              Excepturi, omnis! Ex reiciendis itaque, magnam reprehenderit
            </p>
          </Card.Body>
        </Card>
      </Carousel.Item>
      <Carousel.Item>
        <Card className={styles['featured-item-card']}>
          <Card.Body>
            <Card.Title as="h2">Featured Item 2 (image on the left + text content)</Card.Title>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <img src="https://placehold.co/300x200" alt="placeholder" />
              <p>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illo, animi error! Dolores
                aliquid quis sunt dolore saepe veritatis soluta earum. Iure temporibus laborum dolor
                vero eligendi, mollitia consequatur fugiat aliquam optio? Eligendi accusamus
                consequatur consequuntur alias quis libero, in eum et nemo repellendus ipsum
                delectus ex voluptatem ab labore enim.
              </p>
            </div>
          </Card.Body>
        </Card>
      </Carousel.Item>
      <Carousel.Item>
        <Card className={styles['featured-item-card']}>
          <Card.Body>
            <Card.Title as="h2">Featured Item 3 (Long text)</Card.Title>
            <p>
              Fugit, non dolorum! Blanditiis ipsa tempore doloremque optio dolor explicabo, ducimus
              dolorum placeat, similique hic omnis illo fugit, officia quaerat excepturi ullam
              accusantium quae ipsam quod impedit tempora eaque voluptas praesentium. Assumenda
              delectus incidunt pariatur eius, deserunt libero repudiandae dolore unde, magni sunt
              ratione explicabo, voluptatibus omnis velit labore perspiciatis facilis? Iusto
              quibusdam recusandae impedit commodi officia quas dolore eveniet. Beatae earum
              aspernatur nobis sunt dolor consectetur odio, nisi expedita quia porro nulla molestias
              obcaecati rem mollitia repellat error tempore quisquam accusantium maiores quibusdam
              optio? Incidunt, perferendis laboriosam. Sequi deleniti nisi delectus doloremque
              voluptatibus sit ad, earum nam nobis? Distinctio laborum quae quis cum, natus soluta.
              Omnis perferendis quia pariatur minus. Iure iusto facilis velit omnis veritatis quos
              dolorem incidunt sapiente, eum temporibus autem aperiam dicta voluptas quod voluptate
              odit voluptatibus doloremque illo! In exercitationem reiciendis voluptatem nulla
              dolorum fuga illum iste, ducimus deleniti eius deserunt eveniet doloremque velit id
              nemo aliquid, quisquam dolorem, quasi dolore. Ducimus doloremque delectus pariatur
              quam, ex in corporis magni enim mollitia et quaerat distinctio vel corrupti, assumenda
              voluptatum dolore. Cum magni obcaecati rerum placeat ab at assumenda autem commodi
              itaque ipsam, minima, vel nulla quam tempora sunt perferendis voluptatibus. Placeat
              dolores laborum, quisquam animi aliquam ipsa eaque non nobis ab magni alias
              perspiciatis officiis mollitia iure quae velit at reprehenderit. Fugiat sint sunt
              dolores, soluta eos reprehenderit quo inventore aperiam iste ratione blanditiis
              necessitatibus cumque tempore labore incidunt quia adipisci facere voluptatem. Ducimus
              quisquam dolores quaerat repellat at id nostrum ipsam porro atque facere dignissimos
              voluptatem quidem ullam commodi, sunt doloribus eaque nulla maiores architecto impedit
              praesentium eum, explicabo et debitis! Quibusdam asperiores inventore eius nulla
              veritatis deleniti iure error. Alias pariatur maxime nam similique quas delectus eum,
              corrupti, consectetur expedita exercitationem nostrum incidunt odio minus nobis hic?
              Vero a consequuntur eos ad delectus voluptate quibusdam, aspernatur alias atque,
              nostrum aliquid obcaecati numquam beatae! Blanditiis recusandae quibusdam, odio
              debitis, in dicta ab alias consectetur labore ipsam illo delectus expedita eos iusto
              velit. Soluta rem iste, explicabo, sed animi et eligendi quos maxime, nobis illum qui?
              Omnis assumenda ab accusamus ipsum, optio accusantium veniam cumque nemo eaque
              voluptatibus nesciunt eligendi vel obcaecati, culpa alias molestias id molestiae at
              labore. Tenetur tempore quia architecto culpa reprehenderit accusamus perspiciatis
              veritatis ratione sunt quos. Repellendus dignissimos molestiae debitis repellat
              quisquam dicta non tenetur fugiat ipsa neque in, temporibus sequi possimus impedit
              recusandae rem minus laboriosam expedita eaque eos officia exercitationem hic
              molestias? Rem nesciunt natus molestias? Quisquam, nemo? Consequuntur autem eos omnis
              culpa maxime ducimus libero aliquam adipisci a dolores consectetur non mollitia velit
              atque, ex animi aperiam ab quisquam dolorem repudiandae. Mollitia in ad dolor.
              Voluptatibus voluptatum voluptates minus est aut! Laborum porro est ipsum illum, ullam
              maxime temporibus voluptas architecto ut deleniti! Cum doloribus earum dolores
              dignissimos corrupti, aspernatur ut, rem nesciunt, quis excepturi temporibus
              reprehenderit. Repudiandae voluptatum non nemo illo molestias ducimus harum maiores,
              eum aperiam necessitatibus in deserunt velit, saepe fugit fuga quos quod dolorem
              accusantium magnam eos nostrum accusamus itaque commodi! Iusto ullam nostrum a animi
              doloremque fugiat? Veritatis optio quae, error voluptatibus quibusdam sunt nemo, eos,
              numquam nulla accusantium exercitationem. Consequatur sapiente, ipsa esse reiciendis
              fuga blanditiis pariatur, atque labore autem, aperiam tempore consectetur. Et.
            </p>
          </Card.Body>
        </Card>
      </Carousel.Item>
    </Carousel>
  )
}

export default FeaturedItems
