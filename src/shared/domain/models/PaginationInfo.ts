export class PaginationInfo<T extends PaginationInfo<T>> {
  constructor(
    public readonly page: number = 1,
    public readonly pageSize: number = 10,
    public readonly totalItems: number = 0,
    public readonly itemName: string = 'Item'
  ) {}

  get offset(): number {
    return (this.page - 1) * this.pageSize
  }

  get pageStartItem(): number {
    return (this.page - 1) * this.pageSize + 1
  }

  get pageEndItem(): number {
    return Math.min(this.pageStartItem + this.pageSize - 1, this.totalItems)
  }

  withTotal(total: number): T {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new (this.constructor as new (...args: any[]) => T)(this.page, this.pageSize, total)
  }
  goToPage(page: number): T {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new (this.constructor as new (...args: any[]) => T)(page, this.pageSize, this.totalItems)
  }

  goToPreviousPage(): T {
    if (!this.previousPage) throw new Error('No previous page')
    return this.goToPage(this.previousPage)
  }

  goToNextPage(): T {
    if (!this.nextPage) throw new Error('No next page')
    return this.goToPage(this.nextPage)
  }

  withPageSize(pageSize: number): T {
    const getNewPage = (oldPageSize: number, newPageSize: number) => {
      const newPage = Math.ceil((this.page * oldPageSize) / newPageSize)
      return newPage > 0 ? newPage : 1
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new (this.constructor as new (...args: any[]) => T)(
      getNewPage(this.pageSize, pageSize),
      pageSize,
      this.totalItems
    )
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize)
  }

  get hasPreviousPage(): boolean {
    return this.page > 1
  }

  get hasNextPage(): boolean {
    return this.page < this.totalPages
  }

  get previousPage(): number | undefined {
    return this.hasPreviousPage ? this.page - 1 : undefined
  }

  get nextPage(): number | undefined {
    return this.hasNextPage ? this.page + 1 : undefined
  }
}
