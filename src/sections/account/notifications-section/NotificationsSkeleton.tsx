import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Stack } from '@iqss/dataverse-design-system'
import styles from './NotificationsSection.module.scss'

interface NotificationSkeletonProps {
  rows?: number
}

export function NotificationSkeleton({ rows = 5 }: NotificationSkeletonProps) {
  const safeRows = Math.max(1, rows)

  return (
    <SkeletonTheme>
      <section aria-busy={true} aria-live="polite">
        <Stack gap={3} style={{ width: '100%' }}>
          <Stack
            direction="horizontal"
            gap={2}
            style={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
            <Skeleton height={14} width="45%" style={{ borderRadius: 4 }} />
            <Skeleton height={28} width={140} style={{ borderRadius: 6 }} />
          </Stack>

          <div className="d-flex flex-column gap-2">
            {Array.from({ length: safeRows }).map((_, index) => (
              <div key={index} className={`${styles['notification-item']} ${styles['unread']}`}>
                <div style={{ width: '100%' }}>
                  <Skeleton height={14} width="70%" style={{ borderRadius: 4, marginBottom: 6 }} />
                  <Skeleton height={12} width="35%" style={{ borderRadius: 4 }} />
                </div>

                <Skeleton height={28} width={28} style={{ borderRadius: 6, flexShrink: 0 }} />
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Skeleton height={32} width={220} style={{ borderRadius: 6 }} />
            </div>
          </div>
        </Stack>
      </section>
    </SkeletonTheme>
  )
}

export default NotificationSkeleton
