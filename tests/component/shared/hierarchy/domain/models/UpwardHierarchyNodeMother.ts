import { faker } from '@faker-js/faker'
import {
  DvObjectType,
  UpwardHierarchyNode
} from '../../../../../../src/shared/hierarchy/domain/models/UpwardHierarchyNode'

export class UpwardHierarchyNodeMother {
  static create(props?: Partial<UpwardHierarchyNode>): UpwardHierarchyNode {
    return new UpwardHierarchyNode(
      props?.id ?? faker.datatype.uuid(),
      props?.name ?? faker.lorem.word(),
      props?.type ?? faker.helpers.arrayElement(Object.values(DvObjectType)),
      props?.parent ?? undefined
    )
  }
}
