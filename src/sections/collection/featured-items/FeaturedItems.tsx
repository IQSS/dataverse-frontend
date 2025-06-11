import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { Button, useTheme } from '@iqss/dataverse-design-system'
import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { FeaturedItemType } from '@/collection/domain/models/CollectionFeaturedItem'
import { useGetCollectionFeaturedItems } from '../useGetCollectionFeaturedItems'
import { CustomFeaturedItemCard } from './custom-featured-item-card/CustomFeaturedItemCard'
import { DvObjectFeaturedItemCard } from './dv-object-featured-item-card/DvObjectFeaturedItemCard'
import styles from './FeaturedItems.module.scss'

export interface FeaturedItemsProps {
  collectionRepository: CollectionRepository
  collectionId: string
  className?: string
  withLoadingSkeleton?: boolean
}

export const FeaturedItems = ({
  collectionRepository,
  collectionId,
  className,
  withLoadingSkeleton
}: FeaturedItemsProps) => {
  const { t } = useTranslation('collection')
  const theme = useTheme()
  const sliderRef = useRef<HTMLDivElement | null>(null)
  const [backBtnDisabled, setBackBtnDisabled] = useState(true)
  const [nextBtnDisabled, setNextBtnDisabled] = useState(false)
  const [isOverflowing, setIsOverflowing] = useState(false)

  const { collectionFeaturedItems, isLoading: isLoadingCollectionFeaturedItems } =
    useGetCollectionFeaturedItems(collectionRepository, collectionId)

  const hasFeaturedItems = collectionFeaturedItems.length > 0

  useEffect(() => {
    if (sliderRef.current) {
      setIsOverflowing(sliderRef.current.scrollWidth > sliderRef.current.clientWidth)
    }

    const handleResize = () => {
      if (sliderRef.current) {
        /* istanbul ignore next */ setIsOverflowing(
          sliderRef.current.scrollWidth > sliderRef.current?.clientWidth
        )
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [collectionFeaturedItems])

  if (isLoadingCollectionFeaturedItems && withLoadingSkeleton) {
    return (
      <SkeletonTheme>
        <div
          data-testid="featured-items-skeleton"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1.5rem',
            marginBottom: '1.5rem',
            overflowX: 'hidden'
          }}>
          <Skeleton height={240} width={280} />
          <Skeleton height={240} width={280} />
          <Skeleton height={240} width={280} />
          <Skeleton height={240} width={280} />
        </div>
      </SkeletonTheme>
    )
  }

  if (isLoadingCollectionFeaturedItems && !withLoadingSkeleton) {
    return null
  }

  if (!isLoadingCollectionFeaturedItems && !hasFeaturedItems) {
    return null
  }

  const oneItemOnly = collectionFeaturedItems.length === 1

  const handleNext = () => {
    if (sliderRef.current) {
      const { width } = sliderRef.current.getBoundingClientRect()

      sliderRef.current.scrollBy({
        left: width,
        behavior: 'smooth'
      })
    }
  }

  const handlePrev = () => {
    if (sliderRef.current) {
      const { width } = sliderRef.current.getBoundingClientRect()

      sliderRef.current.scrollBy({
        left: -width,
        behavior: 'smooth'
      })
    }
  }

  const checkSliderPositionToDisableButtons = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current

      if (scrollLeft < 50) {
        setBackBtnDisabled(true)
      } else {
        setBackBtnDisabled(false)
      }

      // 50 is the threshold to know when the scroll is at the end
      if (scrollLeft + clientWidth > scrollWidth - 50) {
        setNextBtnDisabled(true)
      } else {
        setNextBtnDisabled(false)
      }
    }
  }

  return (
    <div className={`${styles.featured_items} ${className || ''}`} data-testid="featured-items">
      <h4>{t('featuredItems.title')}</h4>

      <div className={styles['slider-container']} data-testid="featured-items-slider">
        {!oneItemOnly && isOverflowing && (
          <Button
            className={styles['slider-arrow']}
            size="sm"
            variant="secondary"
            aria-label={t('featuredItems.slider.prevLabel')}
            onClick={handlePrev}
            data-testid="featured-items-slider-prev-btn"
            disabled={backBtnDisabled}>
            <ChevronLeft size={30} color={theme.color.primary} />
          </Button>
        )}

        <div
          className={styles['slider']}
          ref={sliderRef}
          onScroll={() => {
            checkSliderPositionToDisableButtons()
          }}
          tabIndex={0}>
          {collectionFeaturedItems.map((item, index) => (
            <div key={index} className={styles['slider-item']} data-index={index}>
              {item.type === FeaturedItemType.CUSTOM ? (
                <CustomFeaturedItemCard
                  featuredItem={item}
                  collectionId={collectionId}
                  key={item.id}
                />
              ) : (
                <DvObjectFeaturedItemCard featuredItem={item} key={item.id} />
              )}
            </div>
          ))}
        </div>

        {!oneItemOnly && isOverflowing && (
          <Button
            className={styles['slider-arrow']}
            size="sm"
            variant="secondary"
            aria-label={t('featuredItems.slider.nextLabel')}
            onClick={handleNext}
            data-testid="featured-items-slider-next-btn"
            disabled={nextBtnDisabled}>
            <ChevronRight size={30} color={theme.color.primary} />
          </Button>
        )}
      </div>
    </div>
  )
}
