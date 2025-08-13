import { Breadcrumb } from '@iqss/dataverse-design-system'
import {
  DvObjectType,
  UpwardHierarchyNode
} from '../../../shared/hierarchy/domain/models/UpwardHierarchyNode'
import { LinkToPage } from '../link-to-page/LinkToPage'
import { Route } from '../../Route.enum'
import styles from './BreadcrumbsGenerator.module.scss'

type BreadcrumbGeneratorProps =
  | {
      hierarchy: UpwardHierarchyNode
      withActionItem?: false
      actionItemText?: never
    }
  | {
      hierarchy: UpwardHierarchyNode
      withActionItem: true
      actionItemText: string
    }

export function BreadcrumbsGenerator({
  hierarchy,
  withActionItem,
  actionItemText
}: BreadcrumbGeneratorProps) {
  const hierarchyArray = hierarchy.toArray()

  return (
    <Breadcrumb className={styles['breadcrumb-generator']}>
      {hierarchyArray.map((item, index) => {
        const isLast = withActionItem ? false : index === hierarchyArray.length - 1
        const isFirst = index === 0

        if (isLast) {
          return (
            <Breadcrumb.Item key={index} active>
              {item.name}
            </Breadcrumb.Item>
          )
        }

        if (isFirst) {
          return (
            <Breadcrumb.Item
              key={index}
              linkAs={LinkToPage}
              linkProps={{
                page: Route.COLLECTIONS_BASE,
                children: <>{item.name}</>
              }}>
              {item.name}
            </Breadcrumb.Item>
          )
        }

        return (
          <Breadcrumb.Item
            key={index}
            linkAs={LinkToDvObject}
            linkProps={{
              name: item.name,
              type: item.type,
              id: item.id,
              persistentId: item.persistentId,
              version: item.version
            }}>
            {item.name}
          </Breadcrumb.Item>
        )
      })}
      {withActionItem && <Breadcrumb.Item active>{actionItemText}</Breadcrumb.Item>}
    </Breadcrumb>
  )
}

const dvObjectTypeToRoute: Record<DvObjectType, Route> = {
  dataset: Route.DATASETS,
  collection: Route.COLLECTIONS,
  file: Route.FILES
}

const LinkToDvObject = ({
  name,
  type,
  id,
  persistentId,
  version
}: {
  name: string
  type: DvObjectType
  id: string
  persistentId?: string
  version?: string
}) => {
  return (
    <LinkToPage
      page={dvObjectTypeToRoute[type]}
      type={type}
      searchParams={{
        ...(persistentId ? { persistentId } : { id }),
        ...(version ? { version } : {})
      }}>
      {name}
    </LinkToPage>
  )
}
