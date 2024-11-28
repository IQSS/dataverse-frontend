import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { Col, Row, Stack } from '@iqss/dataverse-design-system'

export const FormFieldsSkeleton = () => (
  <SkeletonTheme>
    <section data-testid="form-fields-skeleton">
      <LabelAndFieldSkeleton withHelperText />
      <LabelAndFieldSkeleton />
      <LabelAndFieldSkeleton />
      <LabelAndFieldSkeleton />
      <LabelAndFieldSkeleton />
      <LabelAndFieldSkeleton />
      <LabelAndFieldSkeleton termsOfUse />

      <Stack direction="horizontal" className="pt-3">
        <Skeleton width={120} height={38} />
        <Skeleton width={80} height={38} />
      </Stack>
    </section>
  </SkeletonTheme>
)

interface LabelAndFieldSkeletonProps {
  withHelperText?: boolean
  termsOfUse?: boolean
}

const LabelAndFieldSkeleton = ({ withHelperText, termsOfUse }: LabelAndFieldSkeletonProps) => (
  <Row style={{ marginBottom: 16 }}>
    <Col md={3} className="text-end">
      <Skeleton width={120} />
    </Col>
    <Col md={6}>
      <Stack gap={2}>
        {withHelperText && <Skeleton width="100%" height={26} />}
        <Skeleton width="100%" height={termsOfUse ? 60 : 38} />
        {termsOfUse && (
          <Stack direction="horizontal" gap={2}>
            <Skeleton width={16} height={16} />
            <Skeleton width={300} height={16} />
          </Stack>
        )}
      </Stack>
    </Col>
  </Row>
)
