import { PageNumbersButtonsWithEllipsis } from '../../../../../../../src/sections/dataset/dataset-files/files-table/table-pagination/PageNumbersButtonsWithEllipsis'

let goToPage: (pageIndex: number) => void
const selectedPageIndex = 3
const pageCount = 100
describe('PageNumbersButtonsWithEllipsis', () => {
  beforeEach(() => {
    goToPage = cy.stub().resolves()
  })

  it('renders page numbers with last ellipsis correctly', () => {
    cy.customMount(
      <PageNumbersButtonsWithEllipsis
        selectedPageIndex={selectedPageIndex}
        pageCount={pageCount}
        goToPage={goToPage}
      />
    )

    cy.findAllByRole('button').then((buttons) => {
      expect(buttons).to.have.length(11)
      expect(buttons[0]).to.have.text('1')
      expect(buttons[1]).to.have.text('2')
      expect(buttons[2]).to.have.text('3')
      expect(buttons[3]).to.have.text('5')
      expect(buttons[4]).to.have.text('6')
      expect(buttons[5]).to.have.text('7')
      expect(buttons[6]).to.have.text('8')
      expect(buttons[7]).to.have.text('9')
      expect(buttons[8]).to.have.text('10')
      expect(buttons[9]).to.have.text('…More')
      expect(buttons[10]).to.have.text('100')
    })

    const activeListItem = cy.findByText(/4/i).parent('li')
    activeListItem.should('have.class', 'active')
  })

  it('calls goToPage function when a page number is clicked', () => {
    cy.customMount(
      <PageNumbersButtonsWithEllipsis
        selectedPageIndex={selectedPageIndex}
        pageCount={pageCount}
        goToPage={goToPage}
      />
    )

    cy.findByText('1').click()
    cy.wrap(goToPage).should('have.been.calledWith', 0)

    cy.findByText('7').click()
    cy.wrap(goToPage).should('have.been.calledWith', 6)
  })

  it('renders both ellipsis correctly', () => {
    const selectedPageIndex = 20

    cy.customMount(
      <PageNumbersButtonsWithEllipsis
        selectedPageIndex={selectedPageIndex}
        pageCount={pageCount}
        goToPage={goToPage}
      />
    )

    cy.findAllByRole('button').then((buttons) => {
      expect(buttons).to.have.length(13)
      expect(buttons[0]).to.have.text('1')
      expect(buttons[1]).to.have.text('…More')
      expect(buttons[2]).to.have.text('16')
      expect(buttons[3]).to.have.text('17')
      expect(buttons[4]).to.have.text('18')
      expect(buttons[5]).to.have.text('19')
      expect(buttons[6]).to.have.text('20')
      expect(buttons[7]).to.have.text('22')
      expect(buttons[8]).to.have.text('23')
      expect(buttons[9]).to.have.text('24')
      expect(buttons[10]).to.have.text('25')
      expect(buttons[11]).to.have.text('…More')
      expect(buttons[12]).to.have.text('100')
    })

    const activeListItem = cy.findByText(/21/i).parent('li')
    activeListItem.should('have.class', 'active')
  })

  it('calls goToPage function when first and last page numbers are clicked', () => {
    const selectedPageIndex = 20

    cy.customMount(
      <PageNumbersButtonsWithEllipsis
        selectedPageIndex={selectedPageIndex}
        pageCount={pageCount}
        goToPage={goToPage}
      />
    )

    cy.findByText('1').click()
    cy.wrap(goToPage).should('have.been.calledWith', 0)

    cy.findByText('100').click()
    cy.wrap(goToPage).should('have.been.calledWith', 99)
  })
})
