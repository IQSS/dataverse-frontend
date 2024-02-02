import { faker } from '@faker-js/faker'
import {
  DvObjectType,
  UpwardHierarchyNode
} from '../../../../../../src/shared/hierarchy/domain/models/UpwardHierarchyNode'

export class UpwardHierarchyNodeMother {
  static create(props?: Partial<UpwardHierarchyNode>): UpwardHierarchyNode {
    return new UpwardHierarchyNode(
      props?.name ?? faker.lorem.word(),
      props?.type ?? faker.helpers.arrayElement(Object.values(DvObjectType)),
      props?.id ?? undefined,
      props?.persistentId ?? undefined,
      props?.version ?? undefined,
      props?.parent ?? undefined
    )
  }

  static createFile(props?: Partial<UpwardHierarchyNode>): UpwardHierarchyNode {
    return this.create({
      ...props,
      type: DvObjectType.FILE
    })
  }

  static createDataset(props?: Partial<UpwardHierarchyNode>): UpwardHierarchyNode {
    return this.create({
      ...props,
      type: DvObjectType.DATASET
    })
  }

  static createCollection(props?: Partial<UpwardHierarchyNode>): UpwardHierarchyNode {
    return this.create({
      ...props,
      type: DvObjectType.COLLECTION
    })
  }
}
