import Image from '@tiptap/extension-image'
/**
 * This file extends the default Image extension of TipTap to be able to adjust the size and align the image position.
 * See documentation about Custom Extensions: https://tiptap.dev/docs/editor/extensions/custom-extensions/extend-existing
 */

// TODO:ME - Change the corner dots styles, move those styles to the scss fille.
// TODO:ME - Understand that resizing part.
// TODO:ME - What will addAttributes().style.defualt do with default images in the editor?
// TODO:ME - Understand // const isClickInside = $container.contains($target) || $target.style.cssText === iconStyle - why was settting again the iconStyle styles
export const CustomImageExtension = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: 'width: 100%; height: auto;',
        parseHTML: (element) => {
          const width = element.getAttribute('width')
          return width ? `width: ${width}px; height: auto;` : `${element.style.cssText}`
        }
      }
    }
  },
  addNodeView() {
    return ({ node, editor, getPos }) => {
      const { view } = editor
      const { style } = node.attrs
      const $wrapper = document.createElement('section')
      const $container = document.createElement('div')
      const $img = document.createElement('img')
      //   const iconStyle =
      //     'display: grid; place-items:center; width: 24px; height: 24px; cursor: pointer;'

      const dispatchNodeView = () => {
        if (typeof getPos === 'function') {
          const newAttrs = {
            ...node.attrs,
            style: `${$img.style.cssText}`
          }
          view.dispatch(view.state.tr.setNodeMarkup(getPos(), null, newAttrs))
        }
      }
      const paintImageAlignmentController = () => {
        const $imgAlignmentController = document.createElement('div')
        $imgAlignmentController.setAttribute('id', 'img-alignment-controller')
        $imgAlignmentController.setAttribute('role', 'group')

        const $leftController = document.createElement('button')
        const $centerController = document.createElement('button')
        const $rightController = document.createElement('button')

        $leftController.setAttribute('aria-label', 'Align left')
        $centerController.setAttribute('aria-label', 'Align center')
        $rightController.setAttribute('aria-label', 'Align right')
        $leftController.setAttribute('type', 'button')
        $centerController.setAttribute('type', 'button')
        $rightController.setAttribute('type', 'button')

        $leftController.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-text-left" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5"/>
            </svg>
        `

        $centerController.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-text-center" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M4 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5"/>
            </svg>
        `

        $rightController.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-text-right" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m4-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5"/>
            </svg>
        `

        $leftController.addEventListener('click', () => {
          $img.setAttribute('style', `${$img.style.cssText} margin: 0 auto 0 0;`)
          dispatchNodeView()
        })
        $centerController.addEventListener('click', () => {
          $img.setAttribute('style', `${$img.style.cssText} margin: 0 auto;`)
          dispatchNodeView()
        })
        $rightController.addEventListener('click', () => {
          $img.setAttribute('style', `${$img.style.cssText} margin: 0 0 0 auto;`)
          dispatchNodeView()
        })

        $imgAlignmentController.appendChild($leftController)
        $imgAlignmentController.appendChild($centerController)
        $imgAlignmentController.appendChild($rightController)

        $container.appendChild($imgAlignmentController)
      }

      $wrapper.setAttribute('style', `display: flex;`)
      $wrapper.appendChild($container)

      $container.setAttribute('id', 'image-resize-container')
      $container.setAttribute('style', `${style as string}`)
      $container.appendChild($img)

      Object.entries(node.attrs).forEach(([key, value]) => {
        // console.log({ key, value })
        if (value === undefined || value === null) return
        $img.setAttribute(key, value as string)
      })

      const isMobile = document.documentElement.clientWidth < 768
      const dotPosition = isMobile ? '-8px' : '-4px'
      const dotsPosition = [
        `top: ${dotPosition}; left: ${dotPosition}; cursor: nwse-resize;`,
        `top: ${dotPosition}; right: ${dotPosition}; cursor: nesw-resize;`,
        `bottom: ${dotPosition}; left: ${dotPosition}; cursor: nesw-resize;`,
        `bottom: ${dotPosition}; right: ${dotPosition}; cursor: nwse-resize;`
      ]

      let isResizing = false
      let startX: number, startWidth: number

      $container.addEventListener('click', () => {
        //remove remaining dots and position controller
        const isMobile = document.documentElement.clientWidth < 768
        isMobile && (document.querySelector('.ProseMirror-focused') as HTMLElement)?.blur()

        if ($container.childElementCount > 3) {
          for (let i = 0; i < 5; i++) {
            $container.removeChild($container.lastChild as Node)
          }
        }

        paintImageAlignmentController()

        $container.setAttribute('style', `${style as string}`)

        Array.from({ length: 4 }, (_, index) => {
          const $dot = document.createElement('div')
          $dot.setAttribute(
            'style',
            `position: absolute; width: ${isMobile ? 16 : 9}px; height: ${
              isMobile ? 16 : 9
            }px; border: 1.5px solid #6C6C6C; border-radius: 50%; ${dotsPosition[index]}`
          )

          $dot.addEventListener('mousedown', (e) => {
            e.preventDefault()
            isResizing = true
            startX = e.clientX
            startWidth = $container.offsetWidth

            const onMouseMove = (e: MouseEvent) => {
              if (!isResizing) return
              const deltaX = index % 2 === 0 ? -(e.clientX - startX) : e.clientX - startX

              const newWidth = startWidth + deltaX

              $container.style.width = `${newWidth}px`

              $img.style.width = `${newWidth}px`
            }

            const onMouseUp = () => {
              if (isResizing) {
                isResizing = false
              }
              dispatchNodeView()

              document.removeEventListener('mousemove', onMouseMove)
              document.removeEventListener('mouseup', onMouseUp)
            }

            document.addEventListener('mousemove', onMouseMove)
            document.addEventListener('mouseup', onMouseUp)
          })

          $dot.addEventListener(
            'touchstart',
            (e) => {
              e.cancelable && e.preventDefault()
              isResizing = true
              startX = e.touches[0].clientX
              startWidth = $container.offsetWidth

              const onTouchMove = (e: TouchEvent) => {
                if (!isResizing) return
                const deltaX =
                  index % 2 === 0 ? -(e.touches[0].clientX - startX) : e.touches[0].clientX - startX

                const newWidth = startWidth + deltaX

                $container.style.width = `${newWidth}px`

                $img.style.width = `${newWidth}px`
              }

              const onTouchEnd = () => {
                if (isResizing) {
                  isResizing = false
                }
                dispatchNodeView()

                document.removeEventListener('touchmove', onTouchMove)
                document.removeEventListener('touchend', onTouchEnd)
              }

              document.addEventListener('touchmove', onTouchMove)
              document.addEventListener('touchend', onTouchEnd)
            },
            { passive: false }
          )
          $container.appendChild($dot)
        })
      })

      document.addEventListener('click', (e: MouseEvent) => {
        const $target = e.target as HTMLElement
        // const isClickInside = $container.contains($target) || $target.style.cssText === iconStyle
        const isClickInside = $container.contains($target) || $target.style.cssText === ''

        if (!isClickInside) {
          const containerStyle = $container.getAttribute('style')
          const newStyle = containerStyle?.replace('border: 1px dashed #6C6C6C;', '')
          $container.setAttribute('style', newStyle as string)

          if ($container.childElementCount > 3) {
            for (let i = 0; i < 5; i++) {
              $container.removeChild($container.lastChild as Node)
            }
          }
        }
      })

      return {
        dom: $wrapper
      }
    }
  }
})
