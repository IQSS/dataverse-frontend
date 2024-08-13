import {
  TransferList,
  TransferListItem
} from '../../../src/lib/components/transfer-list/TransferList'

const availableItems: TransferListItem[] = [
  {
    label: 'Item A',
    value: 'A',
    id: 'A'
  },
  {
    label: 'Item B',
    value: 'B',
    id: 'B'
  },
  {
    label: 'Item C',
    value: 'C',
    id: 'C'
  },
  {
    label: 'Item D',
    value: 'D',
    id: 'D'
  },
  {
    label: 'Item E',
    value: 'E',
    id: 'E'
  }
]

describe('TransferList', () => {
  beforeEach(() => {
    cy.viewport(1280, 720)
  })
  it('should render correctly', () => {
    cy.mount(<TransferList availableItems={availableItems} />)

    cy.findByTestId('left-list-group').as('leftList')
    cy.findByTestId('actions-column').as('actionsColumn')
    cy.findByTestId('right-list-group').as('rightList')

    cy.get('@leftList').should('exist')
    cy.get('@leftList').children().should('have.length', 5)
    cy.get('@leftList').within(() => {
      cy.findByText('Item A').should('exist')
      cy.findByText('Item B').should('exist')
      cy.findByText('Item C').should('exist')
      cy.findByText('Item D').should('exist')
      cy.findByText('Item E').should('exist')
    })

    cy.get('@rightList').should('exist')
    cy.get('@rightList').children().should('have.length', 0)
  })

  it('should render correctly with default selected items', () => {
    cy.mount(
      <TransferList
        availableItems={availableItems}
        defaultSelected={[
          {
            label: 'Item A',
            value: 'A',
            id: 'A'
          },
          {
            label: 'Item C',
            value: 'C',
            id: 'C'
          }
        ]}
      />
    )

    cy.findByTestId('left-list-group').as('leftList')
    cy.findByTestId('actions-column').as('actionsColumn')
    cy.findByTestId('right-list-group').as('rightList')

    cy.get('@leftList').should('exist')
    cy.get('@leftList').children().should('have.length', 3)
    cy.get('@leftList').within(() => {
      cy.findByText('Item A').should('not.exist')
      cy.findByText('Item B').should('exist')
      cy.findByText('Item C').should('not.exist')
      cy.findByText('Item D').should('exist')
      cy.findByText('Item E').should('exist')
    })

    cy.get('@rightList').should('exist')
    cy.get('@rightList').children().should('have.length', 2)
    cy.get('@rightList').within(() => {
      cy.findByText('Item A').should('exist')
      cy.findByText('Item C').should('exist')
    })
  })

  it('should move all items to the right', () => {
    cy.mount(<TransferList availableItems={availableItems} />)

    cy.findByTestId('left-list-group').as('leftList')
    cy.findByTestId('actions-column').as('actionsColumn')
    cy.findByTestId('right-list-group').as('rightList')

    cy.get('@leftList').should('exist')
    cy.get('@leftList').children().should('have.length', 5)
    cy.get('@rightList').should('exist')
    cy.get('@rightList').children().should('have.length', 0)

    cy.get('@actionsColumn').within(() => {
      cy.findByLabelText('move all right').click()
    })

    cy.get('@leftList').children().should('have.length', 0)
    cy.get('@rightList').children().should('have.length', 5)
  })

  it('should move all items to the left', () => {
    cy.mount(
      <TransferList
        availableItems={availableItems}
        defaultSelected={[
          {
            label: 'Item A',
            value: 'A',
            id: 'A'
          },
          {
            label: 'Item C',
            value: 'C',
            id: 'C'
          }
        ]}
      />
    )

    cy.findByTestId('left-list-group').as('leftList')
    cy.findByTestId('actions-column').as('actionsColumn')
    cy.findByTestId('right-list-group').as('rightList')

    cy.get('@leftList').should('exist')
    cy.get('@leftList').children().should('have.length', 3)
    cy.get('@rightList').should('exist')
    cy.get('@rightList').children().should('have.length', 2)

    cy.get('@actionsColumn').within(() => {
      cy.findByLabelText('move all left').click()
    })

    cy.get('@leftList').children().should('have.length', 5)
    cy.get('@rightList').children().should('have.length', 0)
  })

  it('should move selected items to the right', () => {
    cy.mount(<TransferList availableItems={availableItems} />)

    cy.findByTestId('left-list-group').as('leftList')
    cy.findByTestId('actions-column').as('actionsColumn')
    cy.findByTestId('right-list-group').as('rightList')

    cy.get('@leftList').should('exist')
    cy.get('@leftList').children().should('have.length', 5)
    cy.get('@rightList').should('exist')
    cy.get('@rightList').children().should('have.length', 0)

    cy.get('@actionsColumn').within(() => {
      cy.findByLabelText('move selected to right').should('be.disabled')
    })

    cy.get('@leftList').within(() => {
      cy.findByLabelText('Item A').click()
      cy.findByLabelText('Item C').click()
    })

    cy.get('@actionsColumn').within(() => {
      cy.findByLabelText('move selected to right').should('not.be.disabled')
      cy.findByLabelText('move selected to right').click()
    })

    cy.get('@leftList').children().should('have.length', 3)
    cy.get('@rightList').children().should('have.length', 2)

    cy.get('@leftList').within(() => {
      cy.findByText('Item A').should('not.exist')
      cy.findByText('Item B').should('exist')
      cy.findByText('Item C').should('not.exist')
      cy.findByText('Item D').should('exist')
      cy.findByText('Item E').should('exist')
    })

    cy.get('@rightList').within(() => {
      cy.findByText('Item A').should('exist')
      cy.findByText('Item B').should('not.exist')
      cy.findByText('Item C').should('exist')
      cy.findByText('Item D').should('not.exist')
      cy.findByText('Item E').should('not.exist')
    })
  })

  it('should move selected items to the left', () => {
    cy.mount(
      <TransferList
        availableItems={availableItems}
        defaultSelected={[
          {
            label: 'Item A',
            value: 'A',
            id: 'A'
          },
          {
            label: 'Item C',
            value: 'C',
            id: 'C'
          }
        ]}
      />
    )

    cy.findByTestId('left-list-group').as('leftList')
    cy.findByTestId('actions-column').as('actionsColumn')
    cy.findByTestId('right-list-group').as('rightList')

    cy.get('@leftList').should('exist')
    cy.get('@leftList').children().should('have.length', 3)
    cy.get('@rightList').should('exist')
    cy.get('@rightList').children().should('have.length', 2)

    cy.get('@actionsColumn').within(() => {
      cy.findByLabelText('move selected to left').should('be.disabled')
    })

    cy.get('@rightList').within(() => {
      cy.findByLabelText('Item A').click()
      cy.findByLabelText('Item C').click()
    })

    cy.get('@actionsColumn').within(() => {
      cy.findByLabelText('move selected to left').should('not.be.disabled')
      cy.findByLabelText('move selected to left').click()
    })

    cy.get('@leftList').children().should('have.length', 5)
    cy.get('@rightList').children().should('have.length', 0)

    cy.get('@leftList').within(() => {
      cy.findByText('Item A').should('exist')
      cy.findByText('Item B').should('exist')
      cy.findByText('Item C').should('exist')
      cy.findByText('Item D').should('exist')
      cy.findByText('Item E').should('exist')
    })
  })

  it('should show left and right labels', () => {
    cy.mount(
      <TransferList
        availableItems={availableItems}
        leftLabel="Left label"
        rightLabel="Right label"
      />
    )

    cy.findByTestId('left-list-group').as('leftList')
    cy.findByTestId('actions-column').as('actionsColumn')
    cy.findByTestId('right-list-group').as('rightList')

    cy.findByText('Left label').should('exist')
    cy.findByText('Right label').should('exist')
  })

  it('should check and uncheck items', () => {
    cy.mount(<TransferList availableItems={availableItems} />)

    cy.findByTestId('left-list-group').as('leftList')
    cy.findByTestId('actions-column').as('actionsColumn')
    cy.findByTestId('right-list-group').as('rightList')

    cy.get('@leftList').should('exist')
    cy.get('@leftList').children().should('have.length', 5)
    cy.get('@rightList').should('exist')
    cy.get('@rightList').children().should('have.length', 0)

    cy.get('@leftList').within(() => {
      cy.findByLabelText('Item A').should('not.be.checked')
      cy.findByLabelText('Item C').should('not.be.checked')
      cy.findByLabelText('Item E').should('not.be.checked')

      cy.findByLabelText('Item A').click()
      cy.findByLabelText('Item C').click()
      cy.findByLabelText('Item E').click()
    })

    cy.get('@leftList').within(() => {
      cy.findByLabelText('Item A').should('be.checked')
      cy.findByLabelText('Item C').should('be.checked')
      cy.findByLabelText('Item E').should('be.checked')
    })

    cy.get('@rightList').within(() => {
      cy.findByLabelText('Item A').should('not.exist')
      cy.findByLabelText('Item C').should('not.exist')
      cy.findByLabelText('Item E').should('not.exist')
    })

    cy.get('@leftList').within(() => {
      cy.findByLabelText('Item A').click()
      cy.findByLabelText('Item C').click()
      cy.findByLabelText('Item E').click()
    })

    cy.get('@leftList').within(() => {
      cy.findByLabelText('Item A').should('not.be.checked')
      cy.findByLabelText('Item C').should('not.be.checked')
      cy.findByLabelText('Item E').should('not.be.checked')
    })
  })

  describe('drag and drop', () => {
    it('should sort item A for Item B', () => {
      cy.mount(
        <TransferList
          availableItems={availableItems}
          defaultSelected={[
            {
              label: 'Item A',
              value: 'A',
              id: 'A'
            },
            {
              label: 'Item B',
              value: 'B',
              id: 'B'
            },
            {
              label: 'Item C',
              value: 'C',
              id: 'C'
            }
          ]}
        />
      )

      cy.findByTestId('right-list-group').as('rightList')

      // Check initial order of items
      cy.get('@rightList').within(() => {
        cy.get('[aria-roledescription="sortable"]').as('sortableItems')
        cy.get('@sortableItems').should('have.length', 3)

        cy.get('@sortableItems').spread((firstItem, secondItem, thirdItem) => {
          cy.wrap(firstItem).should('contain.text', 'Item A')
          cy.wrap(secondItem).should('contain.text', 'Item B')
          cy.wrap(thirdItem).should('contain.text', 'Item C')
        })
      })

      cy.wait(1000)

      cy.findAllByLabelText('press space to select and keys to drag').as('dragHandles')

      cy.get('@dragHandles').should('have.length', 3)

      cy.get('@dragHandles')
        .first()
        .focus()
        .type('{enter}')
        .type('{downArrow}')
        .type('{downArrow}') // with two presses of down arrow, item A should be moved to the Item B position
        .type('{enter}')

      // Check the new order of items
      cy.get('@rightList').within(() => {
        cy.get('[aria-roledescription="sortable"]').as('sortableItems')
        cy.get('@sortableItems').should('have.length', 3)

        cy.get('@sortableItems').spread((firstItem, secondItem, thirdItem) => {
          cy.wrap(firstItem).should('contain.text', 'Item B')
          cy.wrap(secondItem).should('contain.text', 'Item A')
          cy.wrap(thirdItem).should('contain.text', 'Item C')
        })
      })
    })

    it('should sort item C to the top of the list', () => {
      cy.mount(
        <TransferList
          availableItems={availableItems}
          defaultSelected={[
            {
              label: 'Item A',
              value: 'A',
              id: 'A'
            },
            {
              label: 'Item B',
              value: 'B',
              id: 'B'
            },
            {
              label: 'Item C',
              value: 'C',
              id: 'C'
            }
          ]}
        />
      )

      cy.findByTestId('right-list-group').as('rightList')

      // Check initial order of items
      cy.get('@rightList').within(() => {
        cy.get('[aria-roledescription="sortable"]').as('sortableItems')
        cy.get('@sortableItems').should('have.length', 3)

        cy.get('@sortableItems').spread((firstItem, secondItem, thirdItem) => {
          cy.wrap(firstItem).should('contain.text', 'Item A')
          cy.wrap(secondItem).should('contain.text', 'Item B')
          cy.wrap(thirdItem).should('contain.text', 'Item C')
        })
      })

      cy.wait(1000)

      cy.findAllByLabelText('press space to select and keys to drag').as('dragHandles')

      cy.get('@dragHandles').should('have.length', 3)

      cy.get('@dragHandles')
        .last()
        .focus()
        .type('{enter}')
        .type('{upArrow}')
        .type('{upArrow}')
        .type('{upArrow}')
        .type('{upArrow}') // with 4 press of up arrow, item C should be moved to the top of the list
        .type('{enter}')

      // Check the new order of items
      cy.get('@rightList').within(() => {
        cy.get('[aria-roledescription="sortable"]').as('sortableItems')
        cy.get('@sortableItems').should('have.length', 3)

        cy.get('@sortableItems').spread((firstItem, secondItem, thirdItem) => {
          cy.wrap(firstItem).should('contain.text', 'Item C')
          cy.wrap(secondItem).should('contain.text', 'Item A')
          cy.wrap(thirdItem).should('contain.text', 'Item B')
        })
      })
    })
  })

  describe('onChange calls', () => {
    it('should call onChange correctly when moving checked items to right', () => {
      const onChange = cy.stub().as('onChange')

      cy.mount(<TransferList availableItems={availableItems} onChange={onChange} />)

      cy.findByTestId('left-list-group').as('leftList')
      cy.findByTestId('actions-column').as('actionsColumn')
      cy.findByTestId('right-list-group').as('rightList')

      cy.get('@leftList').should('exist')
      cy.get('@leftList').children().should('have.length', 5)
      cy.get('@rightList').should('exist')
      cy.get('@rightList').children().should('have.length', 0)

      cy.get('@leftList').within(() => {
        cy.findByLabelText('Item A').click()
        cy.findByLabelText('Item C').click()
        cy.findByLabelText('Item E').click()
      })

      cy.get('@actionsColumn').within(() => {
        cy.findByLabelText('move selected to right').click()
      })
      cy.get('@onChange').should('have.been.calledOnce')
      cy.get('@onChange').should('have.been.calledWith', [
        {
          label: 'Item A',
          value: 'A',
          id: 'A'
        },
        {
          label: 'Item C',
          value: 'C',
          id: 'C'
        },
        {
          label: 'Item E',
          value: 'E',
          id: 'E'
        }
      ])
    })

    it('should call onChange correctly when moving checked items to left', () => {
      const onChange = cy.stub().as('onChange')

      cy.mount(
        <TransferList
          availableItems={availableItems}
          defaultSelected={[
            {
              label: 'Item A',
              value: 'A',
              id: 'A'
            },
            {
              label: 'Item C',
              value: 'C',
              id: 'C'
            }
          ]}
          onChange={onChange}
        />
      )

      cy.findByTestId('left-list-group').as('leftList')
      cy.findByTestId('actions-column').as('actionsColumn')
      cy.findByTestId('right-list-group').as('rightList')

      cy.get('@leftList').should('exist')
      cy.get('@leftList').children().should('have.length', 3)
      cy.get('@rightList').should('exist')
      cy.get('@rightList').children().should('have.length', 2)

      cy.get('@rightList').within(() => {
        cy.findByLabelText('Item A').click()
        cy.findByLabelText('Item C').click()
      })

      cy.get('@actionsColumn').within(() => {
        cy.findByLabelText('move selected to left').click()
      })

      cy.get('@onChange').should('have.been.calledOnce')
      cy.get('@onChange').should('have.been.calledWith', [])
    })

    it('should call onChange correctly when moving all items to right', () => {
      const onChange = cy.stub().as('onChange')

      cy.mount(<TransferList availableItems={availableItems} onChange={onChange} />)

      cy.findByTestId('left-list-group').as('leftList')
      cy.findByTestId('actions-column').as('actionsColumn')
      cy.findByTestId('right-list-group').as('rightList')

      cy.get('@leftList').should('exist')
      cy.get('@leftList').children().should('have.length', 5)
      cy.get('@rightList').should('exist')
      cy.get('@rightList').children().should('have.length', 0)

      cy.get('@actionsColumn').within(() => {
        cy.findByLabelText('move all right').click()
      })

      cy.get('@onChange').should('have.been.calledOnce')
      cy.get('@onChange').should('have.been.calledWith', [
        {
          label: 'Item A',
          value: 'A',
          id: 'A'
        },
        {
          label: 'Item B',
          value: 'B',
          id: 'B'
        },
        {
          label: 'Item C',
          value: 'C',
          id: 'C'
        },
        {
          label: 'Item D',
          value: 'D',
          id: 'D'
        },
        {
          label: 'Item E',
          value: 'E',
          id: 'E'
        }
      ])
    })

    it('should call onChange correctly when moving all items to left', () => {
      const onChange = cy.stub().as('onChange')

      cy.mount(
        <TransferList
          availableItems={availableItems}
          defaultSelected={[
            {
              label: 'Item A',
              value: 'A',
              id: 'A'
            },
            {
              label: 'Item C',
              value: 'C',
              id: 'C'
            }
          ]}
          onChange={onChange}
        />
      )

      cy.findByTestId('left-list-group').as('leftList')
      cy.findByTestId('actions-column').as('actionsColumn')
      cy.findByTestId('right-list-group').as('rightList')

      cy.get('@leftList').should('exist')
      cy.get('@leftList').children().should('have.length', 3)
      cy.get('@rightList').should('exist')
      cy.get('@rightList').children().should('have.length', 2)

      cy.get('@actionsColumn').within(() => {
        cy.findByLabelText('move all left').click()
      })

      cy.get('@onChange').should('have.been.calledOnce')
      cy.get('@onChange').should('have.been.calledWith', [])
    })

    it('should call onChange correctly when sorting items', () => {
      const onChange = cy.stub().as('onChange')

      cy.mount(
        <TransferList
          onChange={onChange}
          availableItems={availableItems}
          defaultSelected={[
            {
              label: 'Item A',
              value: 'A',
              id: 'A'
            },
            {
              label: 'Item B',
              value: 'B',
              id: 'B'
            },
            {
              label: 'Item C',
              value: 'C',
              id: 'C'
            }
          ]}
        />
      )

      cy.wait(1000)

      cy.findAllByLabelText('press space to select and keys to drag').as('dragHandles')

      cy.get('@dragHandles').should('have.length', 3)

      cy.get('@dragHandles')
        .first()
        .focus()
        .type('{enter}')
        .type('{downArrow}')
        .type('{downArrow}') // with two presses of down arrow, item A should be moved to the Item B position
        .type('{enter}')

      cy.get('@onChange').should('have.been.calledWith', [
        {
          label: 'Item B',
          value: 'B',
          id: 'B'
        },
        {
          label: 'Item A',
          value: 'A',
          id: 'A'
        },
        {
          label: 'Item C',
          value: 'C',
          id: 'C'
        }
      ])
    })
  })
})
