export enum DvObjectType {
  COLLECTION = 'collection',
  DATASET = 'dataset',
  FILE = 'file'
}

export class UpwardHierarchyNode {
  constructor(
    public readonly name: string,
    public readonly type: DvObjectType,
    public readonly id: string,
    public readonly persistentId?: string,
    public readonly version?: string,
    public readonly isReleased?: boolean,
    public readonly parent?: UpwardHierarchyNode
  ) {}

  public toArray(): UpwardHierarchyNode[] {
    const array: UpwardHierarchyNode[] = [this]
    let currentNode: UpwardHierarchyNode | undefined = this.parent

    while (currentNode) {
      array.unshift(currentNode)
      currentNode = currentNode.parent
    }

    return array
  }
}
