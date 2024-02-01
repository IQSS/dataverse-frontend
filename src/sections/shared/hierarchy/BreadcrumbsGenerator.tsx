import { Breadcrumb } from '@iqss/dataverse-design-system'
import { UpwardHierarchyNode } from '../../../shared/hierarchy/domain/models/UpwardHierarchyNode'

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
            {item.name}
          </Breadcrumb.Item>
        )
      })}
    </Breadcrumb>
  )
}
