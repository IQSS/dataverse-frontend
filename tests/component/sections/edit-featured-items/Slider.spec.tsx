import { Slider } from '@/sections/edit-collection-featured-items/featured-items-form/preview-carousel/slider/Slider'

const twoItems = ['Item One', 'Item Two']
const oneItemOnly = ['Item One']
const dataTestId = 'slider-test-id'

describe('Slider', () => {
  beforeEach(() => {
    cy.viewport(1440, 1080)
  })

  it('renders the slider with prev and next button and indicators with default labels', () => {
    cy.customMount(
      <Slider
        dataTestId={dataTestId}
        items={twoItems.map((item, index) => (
          <p key={index}>{item}</p>
        ))}
      />
    )

    cy.findByTestId(dataTestId).as('sliderContainer').should('exist')
    cy.findByLabelText('Next').as('nextButton').should('exist').should('be.visible')
    cy.findByLabelText('Previous').as('prevButton').should('exist').should('be.visible')
    cy.findByLabelText('Go to slide 1').should('exist').should('be.visible')
    cy.findByLabelText('Go to slide 2').should('exist').should('be.visible')

    cy.findByText('Item One').should('exist').should('be.visible')
    cy.findByText('Item Two').should('exist').should('not.be.visible')
  })

  it('renders the slider with one item only, without prev and next button and indicators', () => {
    cy.customMount(
      <Slider
        dataTestId={dataTestId}
        items={oneItemOnly.map((item, index) => (
          <p key={index}>{item}</p>
        ))}
      />
    )

    cy.findByTestId(dataTestId).as('sliderContainer').should('exist')
    cy.findByLabelText('Next').should('not.exist')
    cy.findByLabelText('Previous').should('not.exist')
    cy.findByLabelText('Go to slide 1').should('not.exist')

    cy.findByText('Item One').should('exist').should('be.visible')
  })

  it('renders the slider with custom labels', () => {
    const customLabels = {
      prevLabel: 'Previous Item',
      nextLabel: 'Next Item',
      dotLabel: 'Slide to'
    }

    cy.customMount(
      <Slider
        dataTestId={dataTestId}
        prevLabel={customLabels.prevLabel}
        nextLabel={customLabels.nextLabel}
        dotLabel={customLabels.dotLabel}
        items={twoItems.map((item, index) => (
          <p key={index}>{item}</p>
        ))}
      />
    )

    cy.findByLabelText(customLabels.nextLabel).as('nextButton').should('exist').should('be.visible')
    cy.findByLabelText(customLabels.prevLabel).as('prevButton').should('exist').should('be.visible')
    cy.findByLabelText(`${customLabels.dotLabel} 1`).should('exist').should('be.visible')
    cy.findByLabelText(`${customLabels.dotLabel} 2`).should('exist').should('be.visible')
  })

  it('scrolls to the next item when the next button is clicked', () => {
    cy.customMount(
      <Slider
        dataTestId={dataTestId}
        items={twoItems.map((item, index) => (
          <p key={index}>{item}</p>
        ))}
      />
    )

    cy.findByLabelText('Next').as('nextButton').should('exist').should('be.visible')

    cy.findByText('Item One').should('exist').should('be.visible')
    cy.findByText('Item Two').should('exist').should('not.be.visible')

    cy.get('@nextButton').click()

    cy.findByText('Item One').should('exist').should('not.be.visible')
    cy.findByText('Item Two').should('exist').should('be.visible')
  })

  it('scrolls to the previous item when the previous button is clicked', () => {
    cy.customMount(
      <Slider
        dataTestId={dataTestId}
        items={twoItems.map((item, index) => (
          <p key={index}>{item}</p>
        ))}
      />
    )
    cy.findByLabelText('Next').as('nextButton').should('exist').should('be.visible')
    cy.findByLabelText('Previous').as('prevButton').should('exist').should('be.visible')

    cy.findByText('Item One').should('exist').should('be.visible')
    cy.findByText('Item Two').should('exist').should('not.be.visible')

    cy.get('@nextButton').click()

    cy.findByText('Item One').should('exist').should('not.be.visible')
    cy.findByText('Item Two').should('exist').should('be.visible')

    cy.get('@prevButton').click()

    cy.findByText('Item One').should('exist').should('be.visible')
    cy.findByText('Item Two').should('exist').should('not.be.visible')
  })

  it('scrolls to the item when the indicator is clicked', () => {
    cy.customMount(
      <Slider
        dataTestId={dataTestId}
        items={twoItems.map((item, index) => (
          <p key={index}>{item}</p>
        ))}
      />
    )

    cy.findByText('Item One').should('exist').should('be.visible')
    cy.findByText('Item Two').should('exist').should('not.be.visible')

    cy.findByLabelText('Go to slide 2').click()

    cy.findByText('Item One').should('exist').should('not.be.visible')
    cy.findByText('Item Two').should('exist').should('be.visible')

    cy.findByLabelText('Go to slide 1').click()

    cy.findByText('Item One').should('exist').should('be.visible')
    cy.findByText('Item Two').should('exist').should('not.be.visible')
  })
})
