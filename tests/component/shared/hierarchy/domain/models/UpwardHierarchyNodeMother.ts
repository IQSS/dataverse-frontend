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
      undefined,
      props?.parent ?? undefined
    )
  }

  static createFile(props?: Partial<UpwardHierarchyNode>): UpwardHierarchyNode {
    return this.create({
      ...props,
      type: DvObjectType.FILE,
      parent: props?.parent ?? this.createDataset()
    })
  }

  static createDataset(props?: Partial<UpwardHierarchyNode>): UpwardHierarchyNode {
    return this.create({
      ...props,
      type: DvObjectType.DATASET,
      name: props?.name ?? 'Dataset Title',
      parent: props?.parent ?? this.createCollection()
    })
  }

  static createCollection(props?: Partial<UpwardHierarchyNode>): UpwardHierarchyNode {
    return this.create({
      ...props,
      type: DvObjectType.COLLECTION,
      name: props?.name ?? 'Root',
      id: props?.id ?? 'root'
    })
  }
}
