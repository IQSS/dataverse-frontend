import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons'
import { Button } from '@iqss/dataverse-design-system'
import cn from 'classnames'
import styles from './Slider.module.scss'

interface SliderProps {
  items: React.ReactNode[]
  showDots?: boolean
  showArrows?: boolean
  nextLabel?: string
  prevLabel?: string
  dotLabel?: string
  className?: string
}

export const Slider = ({
  items,
  showDots = true,
  showArrows = true,
  prevLabel = 'Previous',
  nextLabel = 'Next',
  dotLabel = 'Go to slide',
  className
}: SliderProps) => {
  const sliderRef = useRef<HTMLDivElement | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleScroll = () => {
    if (sliderRef.current) {
      const index = Math.round(sliderRef.current.scrollLeft / sliderRef.current.offsetWidth)
      setCurrentIndex(index)
    }
  }

  const scrollTo = (index: number) => {
    if (sliderRef.current) {
      sliderRef.current.scrollTo({
        left: index * sliderRef.current.offsetWidth,
        behavior: 'smooth'
      })
    }
  }

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      scrollTo(currentIndex + 1)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      scrollTo(currentIndex - 1)
    }
  }

  return (
    <div
      className={cn(
        styles['slider-container'],
        {
          [styles['with-dots']]: showDots
        },
        className
      )}>
      {showArrows && (
        <Button
          className={styles['slider-arrow']}
          size="sm"
          aria-label={prevLabel}
          onClick={handlePrev}
          disabled={currentIndex === 0}>
          <ChevronLeft size={30} />
        </Button>
      )}
      <div className={styles['slider']} ref={sliderRef} onScroll={handleScroll} tabIndex={0}>
        {items.map((item, index) => (
          <div key={index} className={styles['slider-item']}>
            {item}
          </div>
        ))}
      </div>
      {showArrows && (
        <Button
          className={styles['slider-arrow']}
          size="sm"
          aria-label={nextLabel}
          onClick={handleNext}
          disabled={currentIndex === items.length - 1}>
          <ChevronRight size={30} />
        </Button>
      )}
      {showDots && (
        <div className={styles['slider-dots']}>
          {items.map((_, index) => (
            <button
              key={index}
              className={cn(styles['dot'], { [styles['active']]: index === currentIndex })}
              onClick={() => scrollTo(index)}
              aria-label={`${dotLabel} ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
