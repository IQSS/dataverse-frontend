import { RichTextEditor } from '../../../src/lib/components/rich-text-editor/RichTextEditor'

const editorContentId = 'test-editor-content-id'

const textToType = 'Hello Dataverse!'

describe('RichTextEditor', () => {
  it('should render the component', () => {
    cy.mount(<RichTextEditor />)

    cy.findByTestId('rich-text-editor-wrapper').should('exist').should('be.visible')
  })

  it('should render the component with an id in the editor content', () => {
    cy.mount(<RichTextEditor editorContentId={editorContentId} />)

    cy.get(`#${editorContentId}`).should('exist')
  })

  it('should render the component with an aria-labelledby attribute in the editor content', () => {
    const ariaLabelledBy = 'test-aria-labelledby'

    cy.mount(
      <RichTextEditor
        editorContentAriaLabelledBy={ariaLabelledBy}
        editorContentId={editorContentId}
      />
    )

    cy.get(`#${editorContentId}`).should('have.attr', 'aria-labelledby', ariaLabelledBy)
  })

  it('should render the component with initial value', () => {
    const initialValue = '<p>Hello <strong>Dataverse</strong>!</p>'

    cy.mount(<RichTextEditor editorContentId={editorContentId} initialValue={initialValue} />)

    cy.get(`#${editorContentId}`).should('contain.html', initialValue)
  })

  it('should render the component with disabled state', () => {
    cy.mount(<RichTextEditor editorContentId={editorContentId} disabled />)

    cy.get(`#${editorContentId}`).should('have.attr', 'contenteditable', 'false')
  })

  it('should call onChange when the content changes', () => {
    const onChange = cy.spy().as('onChange')

    cy.mount(<RichTextEditor editorContentId={editorContentId} onChange={onChange} />)

    cy.get(`#${editorContentId}`).type(textToType)

    cy.get('@onChange').should('have.been.calledWith', `<p>${textToType}</p>`)
  })

  describe('Editor Actions', () => {
    it('should apply the heading 1', () => {
      cy.mount(<RichTextEditor editorContentId={editorContentId} />)

      cy.get(`#${editorContentId}`).type(textToType)

      cy.findByLabelText('Heading 1').click()

      cy.get(`#${editorContentId}`).should('contain.html', `<h1>${textToType}</h1>`)

      cy.findByLabelText('Heading 1').should('have.attr', 'aria-pressed', 'true')
    })

    it('should apply the heading 2', () => {
      cy.mount(<RichTextEditor editorContentId={editorContentId} />)

      cy.get(`#${editorContentId}`).type(textToType)

      cy.findByLabelText('Heading 2').click()

      cy.get(`#${editorContentId}`).should('contain.html', `<h2>${textToType}</h2>`)

      cy.findByLabelText('Heading 2').should('have.attr', 'aria-pressed', 'true')
    })

    it('should apply the heading 3', () => {
      cy.mount(<RichTextEditor editorContentId={editorContentId} />)

      cy.get(`#${editorContentId}`).type(textToType)

      cy.findByLabelText('Heading 3').click()

      cy.get(`#${editorContentId}`).should('contain.html', `<h3>${textToType}</h3>`)

      cy.findByLabelText('Heading 3').should('have.attr', 'aria-pressed', 'true')
    })

    it('should apply the Bold', () => {
      cy.mount(<RichTextEditor editorContentId={editorContentId} />)

      cy.get(`#${editorContentId}`).type(textToType)

      cy.get(`#${editorContentId}`).type('{selectall}')

      cy.findByLabelText('Bold').click()

      cy.get(`#${editorContentId}`).should('contain.html', `<p><strong>${textToType}</strong></p>`)

      cy.findByLabelText('Bold').should('have.attr', 'aria-pressed', 'true')
    })

    it('should apply the Italic', () => {
      cy.mount(<RichTextEditor editorContentId={editorContentId} />)

      cy.get(`#${editorContentId}`).type(textToType)

      cy.get(`#${editorContentId}`).type('{selectall}')

      cy.findByLabelText('Italic').click()

      cy.get(`#${editorContentId}`).should('contain.html', `<p><em>${textToType}</em></p>`)

      cy.findByLabelText('Italic').should('have.attr', 'aria-pressed', 'true')
    })

    it('should apply the Underline', () => {
      cy.mount(<RichTextEditor editorContentId={editorContentId} />)

      cy.get(`#${editorContentId}`).type(textToType)

      cy.get(`#${editorContentId}`).type('{selectall}')

      cy.findByLabelText('Underline').click()

      cy.get(`#${editorContentId}`).should('contain.html', `<p><u>${textToType}</u></p>`)

      cy.findByLabelText('Underline').should('have.attr', 'aria-pressed', 'true')
    })

    it('should apply the Striketrough', () => {
      cy.mount(<RichTextEditor editorContentId={editorContentId} />)

      cy.get(`#${editorContentId}`).type(textToType)

      cy.get(`#${editorContentId}`).type('{selectall}')

      cy.findByLabelText('Strikethrough').click()

      cy.get(`#${editorContentId}`).should('contain.html', `<p><s>${textToType}</s></p>`)

      cy.findByLabelText('Strikethrough').should('have.attr', 'aria-pressed', 'true')
    })

    it('should apply the Unordered list', () => {
      cy.mount(<RichTextEditor editorContentId={editorContentId} />)

      cy.get(`#${editorContentId}`).type(textToType)

      cy.get(`#${editorContentId}`).type('{selectall}')

      cy.findByLabelText('Unordered list').click()

      cy.get(`#${editorContentId}`).should('contain.html', `<ul><li><p>${textToType}</p></li></ul>`)

      cy.findByLabelText('Unordered list').should('have.attr', 'aria-pressed', 'true')
    })

    it('should apply the Ordered list', () => {
      cy.mount(<RichTextEditor editorContentId={editorContentId} />)

      cy.get(`#${editorContentId}`).type(textToType)

      cy.get(`#${editorContentId}`).type('{selectall}')

      cy.findByLabelText('Ordered list').click()

      cy.get(`#${editorContentId}`).should('contain.html', `<ol><li><p>${textToType}</p></li></ol>`)

      cy.findByLabelText('Ordered list').should('have.attr', 'aria-pressed', 'true')
    })

    it('should apply the Code', () => {
      cy.mount(<RichTextEditor editorContentId={editorContentId} />)

      cy.get(`#${editorContentId}`).type(textToType)

      cy.get(`#${editorContentId}`).type('{selectall}')

      cy.findByLabelText('Code').click()

      cy.get(`#${editorContentId}`).should('contain.html', `<p><code>${textToType}</code></p>`)

      cy.findByLabelText('Code').should('have.attr', 'aria-pressed', 'true')
    })

    it('should apply the Code block', () => {
      cy.mount(<RichTextEditor editorContentId={editorContentId} />)

      cy.get(`#${editorContentId}`).type(textToType)

      cy.get(`#${editorContentId}`).type('{selectall}')

      cy.findByLabelText('Code block').click()

      cy.get(`#${editorContentId}`).should('contain.html', `<pre><code>${textToType}</code></pre>`)

      cy.findByLabelText('Code block').should('have.attr', 'aria-pressed', 'true')
    })

    it('should apply the blockquote', () => {
      cy.mount(<RichTextEditor editorContentId={editorContentId} />)

      cy.get(`#${editorContentId}`).type(textToType)

      cy.get(`#${editorContentId}`).type('{selectall}')

      cy.findByLabelText('Blockquote').click()

      cy.get(`#${editorContentId}`).should(
        'contain.html',
        `<blockquote><p>${textToType}</p></blockquote>`
      )

      cy.findByLabelText('Blockquote').should('have.attr', 'aria-pressed', 'true')
    })

    describe('Link functionalities', () => {
      it('should apply the link', () => {
        cy.mount(<RichTextEditor editorContentId={editorContentId} />)

        cy.get(`#${editorContentId}`).type('Here goes a link')

        cy.get(`#${editorContentId}`).type('{selectall}')

        cy.findByLabelText('Add link').click()

        cy.findByLabelText('Link').type('https://www.dataverse.com')

        cy.findByRole('button', { name: 'OK' }).click()

        cy.get(`#${editorContentId}`).should(
          'contain.html',
          '<p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.dataverse.com">Here goes a link</a></p>'
        )
      })

      it('close the link dialog', () => {
        cy.mount(<RichTextEditor editorContentId={editorContentId} />)

        cy.get(`#${editorContentId}`).type('Here goes a link')

        cy.get(`#${editorContentId}`).type('{selectall}')

        cy.findByLabelText('Add link').click()

        cy.findByRole('button', { name: 'Cancel' }).click()

        cy.findByLabelText('Link').should('not.exist')
      })

      it('should not apply the link when the URL is empty', () => {
        cy.mount(<RichTextEditor editorContentId={editorContentId} />)

        cy.get(`#${editorContentId}`).type('Here goes a link')

        cy.get(`#${editorContentId}`).type('{selectall}')

        cy.findByLabelText('Add link').click()

        cy.findByRole('button', { name: 'OK' }).click()

        cy.get(`#${editorContentId}`).should('contain.html', '<p>Here goes a link</p>')
      })
    })

    describe('Undo and Redo functionalities', () => {
      it('should undo the last action', () => {
        cy.mount(<RichTextEditor editorContentId={editorContentId} />)

        cy.clock()

        cy.get(`#${editorContentId}`).type(textToType)

        cy.tick(500)

        cy.get(`#${editorContentId}`).type(' added text')

        cy.findByLabelText('Undo').click()

        cy.get(`#${editorContentId}`).should('contain.html', `<p>${textToType}</p>`)

        cy.clock().then((clock) => clock.restore())
      })

      it('should redo the last action', () => {
        cy.mount(<RichTextEditor editorContentId={editorContentId} />)

        cy.clock()

        cy.get(`#${editorContentId}`).type(textToType)

        cy.tick(500)

        cy.get(`#${editorContentId}`).type(' added text')

        cy.findByLabelText('Undo').click()

        cy.findByLabelText('Redo').click()

        cy.get(`#${editorContentId}`).should('contain.html', `<p>${textToType} added text</p>`)

        cy.clock().then((clock) => clock.restore())
      })
    })
  })
})
