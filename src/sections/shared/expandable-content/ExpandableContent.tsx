import { useState, useRef, useEffect, useId, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import { Button, Tooltip } from '@iqss/dataverse-design-system'
import { DashCircle, PlusCircle } from 'react-bootstrap-icons'
import styles from './ExpandableContent.module.scss'

interface ExpandableContentProps {
  children: React.ReactNode
  contentName: string
  maxHeight?: number
}

export const ExpandableContent = ({
  children,
  contentName,
  maxHeight = 250
}: ExpandableContentProps) => {
  const { t } = useTranslation('shared', { keyPrefix: 'expandableContent' })
  const [maxContentHeight, setMaxContentHeight] = useState<number>(maxHeight)
  const [expanded, setExpanded] = useState(false)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const contentId = useId()

  useLayoutEffect(() => {
    const el = contentRef.current
    if (el) {
      setIsOverflowing(el.scrollHeight > maxHeight)
    }
  }, [children, maxHeight])

  useEffect(() => {
    const el = contentRef.current
    if (el) {
      const fullHeight = el.scrollHeight
      setIsOverflowing(fullHeight > maxHeight)
      setMaxContentHeight(expanded ? fullHeight : maxHeight)
    }
  }, [children, expanded, maxHeight])

  const toggleExpanded = () => {
    if (expanded && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    setExpanded((prev) => !prev)
  }

  return (
    <div
      className={cn(styles['expandable-content-wrapper'], {
        [styles.expanded]: expanded
      })}
      ref={containerRef}>
      <div
        id={contentId}
        className={styles['expandable-content']}
        ref={contentRef}
        style={{ maxHeight: `${maxContentHeight}px` }}>
        {children}
      </div>
      {isOverflowing && (
        <>
          <div className={styles['gradient-overlay']} />
          <div className="d-flex justify-content-center">
            <Tooltip
              placement="top"
              overlay={
                expanded
                  ? t('truncateLessTip', { contentName })
                  : t('truncateMoreTip', { contentName })
              }>
              <Button
                className={styles['toggle-button']}
                onClick={toggleExpanded}
                variant="link"
                size="sm"
                aria-controls={contentId}>
                {expanded ? (
                  <span className="d-flex align-items-center gap-1">
                    {t('truncateLessBtn', { contentName })} <DashCircle />
                  </span>
                ) : (
                  <span className="d-flex align-items-center gap-1">
                    {t('truncateMoreBtn', { contentName })} <PlusCircle />
                  </span>
                )}
              </Button>
            </Tooltip>
          </div>
        </>
      )}
    </div>
  )
}
