import { Pagination } from 'dataverse-design-system'
import { PageNumbersButtons } from './PageNumbersButtons'

interface TablePaginationNumbersWithEllipsisProps {
  selectedPageIndex: number
  pageCount: number
  goToPage: (pageIndex: number) => void
}

export function PageNumbersButtonsWithEllipsis({
  selectedPageIndex,
  pageCount,
  goToPage
}: TablePaginationNumbersWithEllipsisProps) {
  const firstPageNumber = 1
  const firstPageIndex = 0
  const lastPageIndex = pageCount - 1
  const { startPageIndex, endPageIndex } = calculatePageLimits(
    selectedPageIndex,
    firstPageIndex,
    lastPageIndex
  )

  return (
    <>
      {startPageIndex > firstPageIndex && (
        <>
          <Pagination.Item
            pageNumber={firstPageNumber}
            active={selectedPageIndex === firstPageIndex}
            onClick={() => goToPage(firstPageIndex)}
          />
          <Pagination.Ellipsis />
        </>
      )}
      <PageNumbersButtons
        selectedPageIndex={selectedPageIndex}
        startPageIndex={startPageIndex}
        endPageIndex={endPageIndex}
        goToPage={goToPage}
      />
      {endPageIndex < lastPageIndex && (
        <>
          <Pagination.Ellipsis />
          <Pagination.Item
            pageNumber={pageCount}
            active={selectedPageIndex === lastPageIndex}
            onClick={() => goToPage(lastPageIndex)}
          />
        </>
      )}
    </>
  )
}

function calculatePageLimits(
  selectedPageIndex: number,
  firstPageIndex: number,
  lastPageIndex: number
) {
  const visiblePageRange = 10
  let startPageIndex = Math.max(
    firstPageIndex,
    selectedPageIndex - Math.floor(visiblePageRange / 2)
  )
  let endPageIndex = Math.min(lastPageIndex, startPageIndex + visiblePageRange - 1)

  if (endPageIndex - startPageIndex + 1 < visiblePageRange) {
    endPageIndex = Math.min(lastPageIndex, startPageIndex + visiblePageRange - 1)
    startPageIndex = Math.max(firstPageIndex, endPageIndex - visiblePageRange + 1)
  }

  return { startPageIndex: startPageIndex, endPageIndex: endPageIndex }
}
