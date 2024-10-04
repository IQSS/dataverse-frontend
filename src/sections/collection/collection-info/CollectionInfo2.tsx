import { Badge } from '@iqss/dataverse-design-system'
import { Carousel } from 'react-bootstrap'
import coverExampleImage from '@/assets/cover-example.jpg'
import coverExampleImageDark from '@/assets/dark-cover-example.jpg'
import coverExampleImageLight from '@/assets/light-cover-example.jpg'

import { Collection } from '@/collection/domain/models/Collection'
import { DatasetLabelSemanticMeaning } from '@/dataset/domain/models/Dataset'
import { MarkdownComponent } from '@/sections/dataset/markdown/MarkdownComponent'
import { BreadcrumbsGenerator } from '@/sections/shared/hierarchy/BreadcrumbsGenerator'
import styles from './CollectionInfo2.module.scss'
import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons'

interface CollectionInfo2Props {
  collection: Collection
}

export const CollectionInfo2 = ({ collection }: CollectionInfo2Props) => {
  return (
    <div className={styles['collection-info']}>
      <div className={styles['top-section']}>
        {/* <img src={coverExampleImage} className={styles['cover-image']} alt="cover-image" /> */}
        <img src={coverExampleImageDark} className={styles['cover-image']} alt="cover-image" />
        {/* <img src={coverExampleImageLight} className={styles['cover-image']} alt="cover-image" /> */}

        <div className={styles.content}>
          <div className={styles['breadcrumbs-wrapper']}>
            <BreadcrumbsGenerator hierarchy={collection.hierarchy} />
          </div>

          <header className={styles.header}>
            <h1>{collection.name}</h1>
            <div className={styles.infoContainer}>
              {collection.affiliation && (
                <p className={styles.subtext}>({collection.affiliation})</p>
              )}
              {!collection.isReleased && (
                <div>
                  <Badge variant={DatasetLabelSemanticMeaning.WARNING}>Unpublished</Badge>
                </div>
              )}
            </div>
          </header>
        </div>
      </div>

      <div className={styles['bottom-section']}>
        <Carousel
          indicators
          controls
          slide
          interval={null}
          prevIcon={<ChevronLeft color="black" size={40} />}
          nextIcon={<ChevronRight color="black" size={40} />}>
          {/* First item should be the description */}
          {/* Description can't be inside the cover, this one has a limited height */}
          {collection.description && (
            <Carousel.Item>
              <div className={styles['featured-item']}>
                <h2>About (description of the collection if it has one)</h2>
                <div className={styles.description}>
                  <MarkdownComponent markdown={collection.description} />
                </div>
              </div>
            </Carousel.Item>
          )}

          <Carousel.Item>
            <div className={styles['featured-item']}>
              <h2>Featured Item 1 (text content)</h2>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Et maiores quas soluta,
                tenetur magnam deserunt voluptates natus quae facilis culpa, est veritatis ab
                consequatur provident adipisci, eligendi molestias corporis harum quia ullam tempore
                consequuntur. Voluptatibus nisi, amet eveniet odit, praesentium a voluptatem
                eligendi alias ex, tempore beatae aut numquam nobis! Unde corrupti, dignissimos
                blanditiis atque nesciunt doloribus rem et ullam quos laborum aliquam minus. Quidem
                ut, itaque, molestiae animi quam eveniet sint nostrum, non suscipit quis nihil qui
                veniam officia! Optio maiores eius totam voluptatem nam dignissimos, reiciendis
                soluta delectus amet. Excepturi, omnis! Ex reiciendis itaque, magnam reprehenderit
              </p>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className={styles['featured-item']}>
              <h2>Featured Item 2 (image on the left + text content)</h2>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <img src="https://placehold.co/300x200" alt="placeholder" />
                <p>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illo, animi error!
                  Dolores aliquid quis sunt dolore saepe veritatis soluta earum. Iure temporibus
                  laborum dolor vero eligendi, mollitia consequatur fugiat aliquam optio? Eligendi
                  accusamus consequatur consequuntur alias quis libero, in eum et nemo repellendus
                  ipsum delectus ex voluptatem ab labore enim.
                </p>
              </div>
            </div>
          </Carousel.Item>
        </Carousel>
      </div>
    </div>
  )
}
