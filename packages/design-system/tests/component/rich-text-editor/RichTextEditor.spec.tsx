import {
  RichTextEditor,
  RichTextEditorCustomClasses
} from '../../../src/lib/components/rich-text-editor/RichTextEditor'

const editorContentId = 'test-editor-content-id'

const textToType = 'Hello Dataverse!'

const testImageUrl = 'https://picsum.photos/id/237/640/480'

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

  it('should render the component with an aria-required attribute in the editor content', () => {
    cy.mount(<RichTextEditor ariaRequired editorContentId={editorContentId} />)

    cy.get(`#${editorContentId}`).should('have.attr', 'aria-required', 'true')
  })

  it('should render the component with an invalid class', () => {
    cy.mount(<RichTextEditor invalid editorContentId={editorContentId} />)

    cy.get('[data-testid="rich-text-editor-wrapper"]').should('have.class', 'invalid')
  })

  it('should render the component with initial value', () => {
    const initialValue = `<p class="${RichTextEditorCustomClasses.PARAGRAPH}">Hello <strong class="${RichTextEditorCustomClasses.BOLD}">Dataverse</strong>!</p>`

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

    cy.get('@onChange').should(
      'have.been.calledWith',
      `<p class="${RichTextEditorCustomClasses.PARAGRAPH}">${textToType}</p>`
    )
  })

  describe('Editor Actions', () => {
    it('should apply the heading 1', () => {
      cy.mount(<RichTextEditor editorContentId={editorContentId} />)

      cy.get(`#${editorContentId}`).type(textToType)

      cy.findByLabelText('Heading 1').click()

      cy.get(`#${editorContentId}`).should(
        'contain.html',
        `<h1 class="${RichTextEditorCustomClasses.HEADING}">${textToType}</h1>`
      )

      cy.findByLabelText('Heading 1').should('have.attr', 'aria-pressed', 'true')
    })

    it('should apply the heading 2', () => {
      cy.mount(<RichTextEditor editorContentId={editorContentId} />)

      cy.get(`#${editorContentId}`).type(textToType)

      cy.findByLabelText('Heading 2').click()

      cy.get(`#${editorContentId}`).should(
        'contain.html',
        `<h2 class="${RichTextEditorCustomClasses.HEADING}">${textToType}</h2>`
      )

      cy.findByLabelText('Heading 2').should('have.attr', 'aria-pressed', 'true')
    })

    it('should apply the heading 3', () => {
      cy.mount(<RichTextEditor editorContentId={editorContentId} />)

      cy.get(`#${editorContentId}`).type(textToType)

      cy.findByLabelText('Heading 3').click()

      cy.get(`#${editorContentId}`).should(
        'contain.html',
        `<h3 class="${RichTextEditorCustomClasses.HEADING}">${textToType}</h3>`
      )

      cy.findByLabelText('Heading 3').should('have.attr', 'aria-pressed', 'true')
    })

    it('should apply the Bold', () => {
      cy.mount(<RichTextEditor editorContentId={editorContentId} />)

      cy.get(`#${editorContentId}`).type(textToType)

      cy.get(`#${editorContentId}`).type('{selectall}')

      cy.findByLabelText('Bold').click()

      cy.get(`#${editorContentId}`).should(
        'contain.html',
        `<p class="${RichTextEditorCustomClasses.PARAGRAPH}"><strong class="${RichTextEditorCustomClasses.BOLD}">${textToType}</strong></p>`
      )

      cy.findByLabelText('Bold').should('have.attr', 'aria-pressed', 'true')
    })

    it('should apply the Italic', () => {
      cy.mount(<RichTextEditor editorContentId={editorContentId} />)

      cy.get(`#${editorContentId}`).type(textToType)

      cy.get(`#${editorContentId}`).type('{selectall}')

      cy.findByLabelText('Italic').click()

      cy.get(`#${editorContentId}`).should(
        'contain.html',
        `<p class="${RichTextEditorCustomClasses.PARAGRAPH}"><em class="${RichTextEditorCustomClasses.ITALIC}">${textToType}</em></p>`
      )

      cy.findByLabelText('Italic').should('have.attr', 'aria-pressed', 'true')
    })

    it('should apply the Underline', () => {
      cy.mount(<RichTextEditor editorContentId={editorContentId} />)

      cy.get(`#${editorContentId}`).type(textToType)

      cy.get(`#${editorContentId}`).type('{selectall}')

      cy.findByLabelText('Underline').click()

      cy.get(`#${editorContentId}`).should(
        'contain.html',
        `<p class="${RichTextEditorCustomClasses.PARAGRAPH}"><u class="${RichTextEditorCustomClasses.UNDERLINE}">${textToType}</u></p>`
      )

      cy.findByLabelText('Underline').should('have.attr', 'aria-pressed', 'true')
    })

    it('should apply the Striketrough', () => {
      cy.mount(<RichTextEditor editorContentId={editorContentId} />)

      cy.get(`#${editorContentId}`).type(textToType)

      cy.get(`#${editorContentId}`).type('{selectall}')

      cy.findByLabelText('Strikethrough').click()

      cy.get(`#${editorContentId}`).should(
        'contain.html',
        `<p class="${RichTextEditorCustomClasses.PARAGRAPH}"><s class="${RichTextEditorCustomClasses.STRIKE}">${textToType}</s></p>`
      )

      cy.findByLabelText('Strikethrough').should('have.attr', 'aria-pressed', 'true')
    })

    it('should apply the Unordered list', () => {
      cy.mount(<RichTextEditor editorContentId={editorContentId} />)

      cy.get(`#${editorContentId}`).type(textToType)

      cy.get(`#${editorContentId}`).type('{selectall}')

      cy.findByLabelText('Unordered list').click()

      cy.get(`#${editorContentId}`).should(
        'contain.html',
        `<ul class="${RichTextEditorCustomClasses.BULLET_LIST}"><li><p class="${RichTextEditorCustomClasses.PARAGRAPH}">${textToType}</p></li></ul>`
      )

      cy.findByLabelText('Unordered list').should('have.attr', 'aria-pressed', 'true')
    })

    it('should apply the Ordered list', () => {
      cy.mount(<RichTextEditor editorContentId={editorContentId} />)

      cy.get(`#${editorContentId}`).type(textToType)

      cy.get(`#${editorContentId}`).type('{selectall}')

      cy.findByLabelText('Ordered list').click()

      cy.get(`#${editorContentId}`).should(
        'contain.html',
        `<ol class="${RichTextEditorCustomClasses.ORDERED_LIST}"><li><p class="${RichTextEditorCustomClasses.PARAGRAPH}">${textToType}</p></li></ol>`
      )

      cy.findByLabelText('Ordered list').should('have.attr', 'aria-pressed', 'true')
    })

    it('should apply the Code', () => {
      cy.mount(<RichTextEditor editorContentId={editorContentId} />)

      cy.get(`#${editorContentId}`).type(textToType)

      cy.get(`#${editorContentId}`).type('{selectall}')

      cy.findByLabelText('Code').click()

      cy.get(`#${editorContentId}`).should(
        'contain.html',
        `<p class="${RichTextEditorCustomClasses.PARAGRAPH}"><code class="${RichTextEditorCustomClasses.CODE}">${textToType}</code></p>`
      )

      cy.findByLabelText('Code').should('have.attr', 'aria-pressed', 'true')
    })

    it('should apply the Code block', () => {
      cy.mount(<RichTextEditor editorContentId={editorContentId} />)

      cy.get(`#${editorContentId}`).type(textToType)

      cy.get(`#${editorContentId}`).type('{selectall}')

      cy.findByLabelText('Code block').click()

      cy.get(`#${editorContentId}`).should(
        'contain.html',
        `<pre class="${RichTextEditorCustomClasses.CODE_BLOCK}"><code>${textToType}</code></pre>`
      )

      cy.findByLabelText('Code block').should('have.attr', 'aria-pressed', 'true')
    })

    it('should apply the blockquote', () => {
      cy.mount(<RichTextEditor editorContentId={editorContentId} />)

      cy.get(`#${editorContentId}`).type(textToType)

      cy.get(`#${editorContentId}`).type('{selectall}')

      cy.findByLabelText('Blockquote').click()

      cy.get(`#${editorContentId}`).should(
        'contain.html',
        `<blockquote class="${RichTextEditorCustomClasses.BLOCKQUOTE}"><p class="${RichTextEditorCustomClasses.PARAGRAPH}">${textToType}</p></blockquote>`
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
          `<p class="${RichTextEditorCustomClasses.PARAGRAPH}"><a target="_blank" rel="noopener noreferrer nofollow" class="${RichTextEditorCustomClasses.LINK}" href="https://www.dataverse.com">Here goes a link</a></p>`
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

        cy.get(`#${editorContentId}`).should(
          'contain.html',
          `<p class="${RichTextEditorCustomClasses.PARAGRAPH}">Here goes a link</p>`
        )
      })

      it('should update an existing link', () => {
        cy.mount(<RichTextEditor editorContentId={editorContentId} />)

        cy.get(`#${editorContentId}`).type('Here goes a link')

        cy.get(`#${editorContentId}`).type('{selectall}')

        cy.findByLabelText('Add link').click()

        cy.findByLabelText('Link').type('https://www.dataverse.com')

        cy.findByRole('button', { name: 'OK' }).click()

        cy.get(`#${editorContentId}`).should(
          'contain.html',
          `<p class="${RichTextEditorCustomClasses.PARAGRAPH}"><a target="_blank" rel="noopener noreferrer nofollow" class="${RichTextEditorCustomClasses.LINK}" href="https://www.dataverse.com">Here goes a link</a></p>`
        )

        cy.get(`#${editorContentId}`).type('{selectall}')

        cy.findByLabelText('Add link').click()
        cy.findByLabelText('Link').should('have.value', 'https://www.dataverse.com')
        cy.findByLabelText('Link').clear().type('https://www.dataverse.com/another-link')

        cy.findByRole('button', { name: 'OK' }).click()

        cy.get(`#${editorContentId}`).should(
          'contain.html',
          `<p class="${RichTextEditorCustomClasses.PARAGRAPH}"><a target="_blank" rel="noopener noreferrer nofollow" class="${RichTextEditorCustomClasses.LINK}" href="https://www.dataverse.com/another-link">Here goes a link</a></p>`
        )
      })
    })

    describe('Image functionalities', () => {
      beforeEach(() => {
        cy.viewport('macbook-15')
      })
      it('should insert and image', () => {
        cy.mount(<RichTextEditor editorContentId={editorContentId} />)

        cy.findByLabelText('Add image').click()

        cy.findByLabelText('Image URL').type(testImageUrl)
        cy.findByLabelText('Alternative text').type('A random image')

        cy.findByRole('button', { name: 'OK' }).click()

        cy.get(`#${editorContentId}`).then((el) => {
          const html = el[0].innerHTML
          expect(html).to.include(
            `<img src="${testImageUrl}" alt="A random image" class="${RichTextEditorCustomClasses.IMAGE}">`
          )
        })
      })

      it('should insert an image and align it to the left, center and right', () => {
        cy.mount(<RichTextEditor editorContentId={editorContentId} />)

        cy.findByLabelText('Add image').click()

        cy.findByLabelText('Image URL').type(testImageUrl)
        cy.findByLabelText('Alternative text').type('A random image')

        cy.findByRole('button', { name: 'OK' }).click()

        cy.get(`#${editorContentId}`).then((el) => {
          const html = el[0].innerHTML
          expect(html).to.include(
            `<img src="${testImageUrl}" alt="A random image" class="${RichTextEditorCustomClasses.IMAGE}">`
          )
        })

        cy.findByAltText('A random image').click()
        cy.findByLabelText('Align left').click()
        cy.get(`#${editorContentId}`).then((el) => {
          const html = el[0].innerHTML
          expect(html).to.include(
            `<img src="${testImageUrl}" alt="A random image" class="${RichTextEditorCustomClasses.IMAGE} ${RichTextEditorCustomClasses.IMAGE_ALIGN_LEFT}">`
          )
        })

        cy.findByAltText('A random image').click()
        cy.findByLabelText('Align center').click()
        cy.get(`#${editorContentId}`).then((el) => {
          const html = el[0].innerHTML
          expect(html).to.include(
            `<img src="${testImageUrl}" alt="A random image" class="${RichTextEditorCustomClasses.IMAGE} ${RichTextEditorCustomClasses.IMAGE_ALIGN_CENTER}">`
          )
        })

        cy.findByAltText('A random image').click()
        cy.findByLabelText('Align right').click()
        cy.get(`#${editorContentId}`).then((el) => {
          const html = el[0].innerHTML
          expect(html).to.include(
            `<img src="${testImageUrl}" alt="A random image" class="${RichTextEditorCustomClasses.IMAGE} ${RichTextEditorCustomClasses.IMAGE_ALIGN_RIGHT}">`
          )
        })
      })

      describe('Image resizing', () => {
        it('should insert an image and shrink its width', () => {
          cy.mount(<RichTextEditor editorContentId={editorContentId} />)

          cy.findByLabelText('Add image').click()

          cy.findByLabelText('Image URL').type(testImageUrl)
          cy.findByLabelText('Alternative text').type('A random image')

          cy.findByRole('button', { name: 'OK' }).click()

          cy.get(`#${editorContentId}`).then((el) => {
            const html = el[0].innerHTML
            expect(html).to.include(
              `<img src="${testImageUrl}" alt="A random image" class="${RichTextEditorCustomClasses.IMAGE}">`
            )
          })

          cy.findByAltText('A random image').click()
          cy.get('.resize-dot')
            .eq(1)
            .trigger('pointerdown', { which: 1, force: true })
            .trigger('pointermove', { x: -100, y: 0, force: true })
            .trigger('pointerup')

          cy.get(`#${editorContentId}`).then((el) => {
            const html = el[0].innerHTML
            expect(html).to.include(
              `<img src="${testImageUrl}" alt="A random image" class="${RichTextEditorCustomClasses.IMAGE} rte-w-40">`
            )
          })
        })

        it('should insert an image and expand its width', () => {
          cy.mount(<RichTextEditor editorContentId={editorContentId} />)

          cy.findByLabelText('Add image').click()

          cy.findByLabelText('Image URL').type(testImageUrl)
          cy.findByLabelText('Alternative text').type('A random image')

          cy.findByRole('button', { name: 'OK' }).click()

          cy.get(`#${editorContentId}`).then((el) => {
            const html = el[0].innerHTML
            expect(html).to.include(
              `<img src="${testImageUrl}" alt="A random image" class="${RichTextEditorCustomClasses.IMAGE}">`
            )
          })

          cy.findByAltText('A random image').click()
          cy.get('.resize-dot')
            .eq(1)
            .trigger('pointerdown', { which: 1, force: true })
            .trigger('pointermove', { x: 100, y: 0, force: true })
            .trigger('pointerup')

          cy.get(`#${editorContentId}`).then((el) => {
            const html = el[0].innerHTML
            expect(html).to.include(
              `<img src="${testImageUrl}" alt="A random image" class="${RichTextEditorCustomClasses.IMAGE} rte-w-55">`
            )
          })
        })

        it('should insert an image and shrink its width from the top left resize dot handler', () => {
          cy.mount(<RichTextEditor editorContentId={editorContentId} />)

          cy.findByLabelText('Add image').click()

          cy.findByLabelText('Image URL').type(testImageUrl)
          cy.findByLabelText('Alternative text').type('A random image')

          cy.findByRole('button', { name: 'OK' }).click()

          cy.get(`#${editorContentId}`).then((el) => {
            const html = el[0].innerHTML
            expect(html).to.include(
              `<img src="${testImageUrl}" alt="A random image" class="${RichTextEditorCustomClasses.IMAGE}">`
            )
          })

          cy.findByAltText('A random image').click()
          cy.get('.resize-dot')
            .eq(2)
            .trigger('pointerdown', { which: 1, force: true })
            .trigger('pointermove', { x: 100, y: 0, force: true })
            .trigger('pointerup')

          cy.get(`#${editorContentId}`).then((el) => {
            const html = el[0].innerHTML
            expect(html).to.include(
              `<img src="${testImageUrl}" alt="A random image" class="${RichTextEditorCustomClasses.IMAGE} rte-w-40">`
            )
          })
        })

        it('should only apply one width class and remove the others', () => {
          cy.mount(<RichTextEditor editorContentId={editorContentId} />)

          cy.findByLabelText('Add image').click()

          cy.findByLabelText('Image URL').type(testImageUrl)
          cy.findByLabelText('Alternative text').type('A random image')

          cy.findByRole('button', { name: 'OK' }).click()

          cy.get(`#${editorContentId}`).then((el) => {
            const html = el[0].innerHTML
            expect(html).to.include(
              `<img src="${testImageUrl}" alt="A random image" class="${RichTextEditorCustomClasses.IMAGE}">`
            )
          })

          cy.findByAltText('A random image').click()
          cy.get('.resize-dot')
            .eq(1)
            .trigger('pointerdown', { which: 1, force: true })
            .trigger('pointermove', { x: -100, y: 0, force: true })
            .trigger('pointerup')

          cy.get(`#${editorContentId}`).then((el) => {
            const html = el[0].innerHTML
            expect(html).to.include(
              `<img src="${testImageUrl}" alt="A random image" class="${RichTextEditorCustomClasses.IMAGE} rte-w-40">`
            )
          })

          cy.findByAltText('A random image').click()
          cy.get('.resize-dot')
            .eq(1)
            .trigger('pointerdown', { which: 1, force: true })
            .trigger('pointermove', { x: -100, y: 0, force: true })
            .trigger('pointerup')

          cy.get(`#${editorContentId}`).then((el) => {
            const html = el[0].innerHTML
            expect(html).to.include(
              `<img src="${testImageUrl}" alt="A random image" class="${RichTextEditorCustomClasses.IMAGE} rte-w-30">`
            )
          })
        })
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

        cy.get(`#${editorContentId}`).should(
          'contain.html',
          `<p class="${RichTextEditorCustomClasses.PARAGRAPH}">${textToType}</p>`
        )

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

        cy.get(`#${editorContentId}`).should(
          'contain.html',
          `<p class="${RichTextEditorCustomClasses.PARAGRAPH}">${textToType} added text</p>`
        )

        cy.clock().then((clock) => clock.restore())
      })
    })
  })
})
