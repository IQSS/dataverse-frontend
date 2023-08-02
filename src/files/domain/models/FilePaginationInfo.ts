export class FilePaginationInfo {
  constructor(
    public readonly page: number = 1,
    public readonly pageSize: number = 10,
    public readonly total: number = 0
  ) {}

  withTotal(total: number): FilePaginationInfo {
    return new FilePaginationInfo(this.page, this.pageSize, total)
  }
  goToPage(page: number): FilePaginationInfo {
    return new FilePaginationInfo(page, this.pageSize, this.total)
  }

  goToPreviousPage(): FilePaginationInfo {
    if (!this.hasPreviousPage) throw new Error('No previous page')
    return this.goToPage(this.previousPage!)
  }

  goToNextPage(): FilePaginationInfo {
    if (!this.hasNextPage) throw new Error('No next page')
    return this.goToPage(this.nextPage!)
  }

  withPageSize(pageSize: number): FilePaginationInfo {
    const getNewPage = (oldPageSize: number, newPageSize: number) => {
      const newPage = Math.ceil((this.page * oldPageSize) / newPageSize)
      return newPage > 0 ? newPage : 1
    }
    return new FilePaginationInfo(getNewPage(this.pageSize, pageSize), pageSize, this.total)
  }

  get totalPages(): number {
    return Math.ceil(this.total / this.pageSize)
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
