import {
  TransferList,
  TransferListItem
} from '../../../src/lib/components/transfer-list/TransferList'

const availableItems: TransferListItem[] = [
  {
    label: 'Item A',
    value: 'A'
  },
  {
    label: 'Item B',
    value: 'B'
  },
  {
    label: 'Item C',
    value: 'C'
  },
  {
    label: 'Item D',
    value: 'D'
  },
  {
    label: 'Item E',
    value: 'E'
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
            value: 'A'
          },
          {
            label: 'Item C',
            value: 'C'
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
            value: 'A'
          },
          {
            label: 'Item C',
            value: 'C'
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
            value: 'A'
          },
          {
            label: 'Item C',
            value: 'C'
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
          value: 'A'
        },
        {
          label: 'Item C',
          value: 'C'
        },
        {
          label: 'Item E',
          value: 'E'
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
              value: 'A'
            },
            {
              label: 'Item C',
              value: 'C'
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
          value: 'A'
        },
        {
          label: 'Item B',
          value: 'B'
        },
        {
          label: 'Item C',
          value: 'C'
        },
        {
          label: 'Item D',
          value: 'D'
        },
        {
          label: 'Item E',
          value: 'E'
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
              value: 'A'
            },
            {
              label: 'Item C',
              value: 'C'
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
  })
})
