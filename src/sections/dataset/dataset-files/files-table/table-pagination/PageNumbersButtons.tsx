import { Pagination } from 'dataverse-design-system'

interface PageNumbersButtonsProps {
  startPageIndex: number
  endPageIndex: number
  selectedPageIndex: number
  goToPage: (pageIndex: number) => void
}
export function PageNumbersButtons({
  startPageIndex,
  endPageIndex,
  selectedPageIndex,
  goToPage
}: PageNumbersButtonsProps) {
  const arrayOfPageNumbers = Array.from({ length: endPageIndex - startPageIndex + 1 })

  return (
    <>
      {arrayOfPageNumbers.map((_, index) => {
        const pageIndex = startPageIndex + index
        const pageNumber = pageIndex + 1
        return (
          <Pagination.Item
            key={pageNumber}
            pageNumber={pageNumber}
            onClick={() => goToPage(pageIndex)}
            active={selectedPageIndex === pageIndex}
          />
        )
      })}
    </>
  )
}
