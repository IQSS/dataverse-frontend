import { Breadcrumb } from '@iqss/dataverse-design-system'
import {
  DvObjectType,
  UpwardHierarchyNode
} from '../../../shared/hierarchy/domain/models/UpwardHierarchyNode'
import { LinkToPage } from '../link-to-page/LinkToPage'
import { Route } from '../../Route.enum'

interface BreadcrumbGeneratorProps {
  hierarchy: UpwardHierarchyNode
}

export function BreadcrumbsGenerator({ hierarchy }: BreadcrumbGeneratorProps) {
  const hierarchyArray = hierarchy.toArray()
  return (
    <Breadcrumb>
      {hierarchyArray.map((item, index) => {
        const isLast = index === hierarchyArray.length - 1
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
            <Breadcrumb.Item key={index}>
              <LinkToPage page={Route.HOME}>{item.name}</LinkToPage>
            </Breadcrumb.Item>
          )
        }

        return (
          <Breadcrumb.Item key={index}>
            <LinkToDvObject name={item.name} type={item.type} id={item.id} version={item.version} />
          </Breadcrumb.Item>
        )
      })}
    </Breadcrumb>
  )
}

const dvObjectTypeToRoute: Record<string, Route> = {
  dataset: Route.DATASETS,
  collection: Route.COLLECTIONS,
  file: Route.FILES
}

const LinkToDvObject = ({
  name,
  type,
  id,
  version
}: {
  name: string
  type: string
  id: string
  version?: string
}) => {
  const idParam =
    type === DvObjectType.DATASET
      ? { ...(id ? { persistentId: id } : {}) }
      : { ...(id ? { id } : {}) }

  return (
    <LinkToPage
      page={dvObjectTypeToRoute[type]}
      searchParams={{ ...(version ? { version } : {}), ...idParam }}>
      {name}
    </LinkToPage>
  )
}
