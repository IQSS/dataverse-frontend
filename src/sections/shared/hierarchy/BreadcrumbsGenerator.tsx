import { Breadcrumb } from '@iqss/dataverse-design-system'
import { UpwardHierarchyNode } from '../../../shared/hierarchy/domain/models/UpwardHierarchyNode'
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
        return (
          <Breadcrumb.Item key={index} active={isLast}>
            {isLast ? (
              item.name
            ) : (
              <LinkToPage
                page={dvObjectTypeToRoute[item.type]}
                searchParams={{
                  id: item.id,
                  ...(item.version ? { version: item.version } : {})
                }}>
                {item.name}
              </LinkToPage>
            )}
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
