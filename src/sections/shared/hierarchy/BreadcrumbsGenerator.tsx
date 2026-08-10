import { Breadcrumb } from '@iqss/dataverse-design-system'
import { Link } from 'react-router-dom'
import {
  DvObjectType,
  UpwardHierarchyNode
} from '../../../shared/hierarchy/domain/models/UpwardHierarchyNode'
import { LinkToPage } from '../link-to-page/LinkToPage'
import { Route } from '../../Route.enum'
import styles from './BreadcrumbsGenerator.module.scss'

interface ActionItem {
  text: string
  url?: string
}

type BreadcrumbGeneratorProps =
  | {
      hierarchy: UpwardHierarchyNode
      withActionItem?: false
      actionItemText?: never
      actionItems?: never
    }
  | {
      hierarchy: UpwardHierarchyNode
      withActionItem: true
      actionItemText: string
      actionItems?: ActionItem[]
    }

export function BreadcrumbsGenerator({
  hierarchy,
  withActionItem,
  actionItemText,
  actionItems
}: BreadcrumbGeneratorProps) {
  const hierarchyArray = hierarchy.toArray()
  const resolvedActionItems = withActionItem ? actionItems ?? [{ text: actionItemText }] : []

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
      {withActionItem &&
        resolvedActionItems.map((item, index) => {
          const isLast = index === resolvedActionItems.length - 1

          if (isLast || !item.url) {
            return (
              <Breadcrumb.Item key={item.text} active>
                {item.text}
              </Breadcrumb.Item>
            )
          }

          return (
            <Breadcrumb.Item
              key={item.text}
              linkAs={Link}
              linkProps={{
                to: item.url
              }}>
              {item.text}
            </Breadcrumb.Item>
          )
        })}
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
