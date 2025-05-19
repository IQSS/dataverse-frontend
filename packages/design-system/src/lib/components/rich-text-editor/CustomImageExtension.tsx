import Image from '@tiptap/extension-image'
import { RichTextEditorCustomClasses } from './RichTextEditor'

/**
 * This file extends the default Image extension of TipTap to be able to adjust the size and align the image position.
 * It was inspired by this repository https://github.com/bae-sh/tiptap-extension-resize-image by https://github.com/bae-sh
 * and modified to fit our needs in terms of a11ty, styling(using classes instead of inline styles) and pointer events instead of mouse and touch events.
 * See also documentation about Custom Extensions: https://tiptap.dev/docs/editor/extensions/custom-extensions/extend-existing
 */

export const CustomImageExtension = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: RichTextEditorCustomClasses.IMAGE,
        renderHTML: (attributes) => {
          return {
            class: attributes.class as string
          }
        }
      }
    }
  },
  addNodeView() {
    return ({ node, editor, getPos }) => {
      const { view } = editor
      const { class: nodeImgClass } = node.attrs
      const $wrapper = document.createElement('div')
      const $container = document.createElement('div')
      const $img = document.createElement('img')

      const dispatchNodeView = () => {
        if (typeof getPos === 'function') {
          const newAttrs = {
            ...node.attrs,
            class: $img.className
          }
          view.dispatch(view.state.tr.setNodeMarkup(getPos(), null, newAttrs))
        }
      }

      const paintImageAlignmentController = () => {
        const $imgAlignmentController = document.createElement('div')
        $imgAlignmentController.classList.add('img-alignment-controller')
        $imgAlignmentController.setAttribute('role', 'group')

        const $leftController = document.createElement('button')
        const $centerController = document.createElement('button')
        const $rightController = document.createElement('button')

        $leftController.setAttribute('aria-label', 'Align left')
        $leftController.setAttribute('title', 'Align left')
        $leftController.setAttribute('type', 'button')

        $centerController.setAttribute('aria-label', 'Align center')
        $centerController.setAttribute('title', 'Align center')
        $centerController.setAttribute('type', 'button')

        $rightController.setAttribute('aria-label', 'Align right')
        $rightController.setAttribute('title', 'Align right')
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

        const applyAlignment = (alignment: string) => {
          // Remove all alignment classes first
          alignmentsClasses.forEach((cls) => $img.classList.remove(cls))

          // Add the selected alignment class
          $img.classList.add(alignment)

          // Persist changes
          dispatchNodeView()
        }

        $leftController.addEventListener('click', () =>
          applyAlignment(RichTextEditorCustomClasses.IMAGE_ALIGN_LEFT)
        )
        $centerController.addEventListener('click', () =>
          applyAlignment(RichTextEditorCustomClasses.IMAGE_ALIGN_CENTER)
        )
        $rightController.addEventListener('click', () =>
          applyAlignment(RichTextEditorCustomClasses.IMAGE_ALIGN_RIGHT)
        )

        $imgAlignmentController.append($leftController, $centerController, $rightController)
        $container.appendChild($imgAlignmentController)
      }

      $wrapper.setAttribute('style', `display: flex;`)
      $wrapper.appendChild($container)

      $container.classList.add('image-resize-container')

      const alignmentsClasses = [
        RichTextEditorCustomClasses.IMAGE_ALIGN_LEFT,
        RichTextEditorCustomClasses.IMAGE_ALIGN_CENTER,
        RichTextEditorCustomClasses.IMAGE_ALIGN_RIGHT
      ]

      // Detect if the class from the img contains alignment class and add it to the container otherwise it wont be aligned inside the rich text editor content
      const matchedAlignment = alignmentsClasses.find((alignment) =>
        (nodeImgClass as string).includes(alignment)
      )

      if (matchedAlignment) {
        $container.classList.add(matchedAlignment)
      }

      // Detect if the class from the img contains width class and add it to the container to simulate the same width inside the rich text editor content
      const matchedWidth = (nodeImgClass as string).match(/rte-w-(\d+)/)
      if (matchedWidth) {
        const widthClass = matchedWidth[0]
        $container.classList.add(widthClass)
      }

      $container.appendChild($img)

      Object.entries(node.attrs).forEach(([key, value]) => {
        if (value === undefined || value === null) return
        $img.setAttribute(key, value as string)
      })

      const dotsPosition = [
        `top: -4px; left: -4px; cursor: nwse-resize;`,
        `top: -4px; right: -4px; cursor: nesw-resize;`,
        `bottom: -4px; left: -4px; cursor: nesw-resize;`,
        `bottom: -4px; right: -4px; cursor: nwse-resize;`
      ]

      let isResizing = false
      let startX: number, startWidth: number

      $container.addEventListener('click', () => {
        //remove remaining dots and position controller

        if ($container.childElementCount > 3) {
          for (let i = 0; i < 5; i++) {
            $container.removeChild($container.lastChild as Node)
          }
        }

        paintImageAlignmentController()

        // Add resize dots to the corners and resize functionality
        Array.from({ length: 4 }, (_, index) => {
          const $resizeDot = document.createElement('div')
          $resizeDot.classList.add('resize-dot')
          $resizeDot.setAttribute('style', `position: absolute; ${dotsPosition[index]}`)

          const transformAndApplyWidthToClassname = (newWidth: number) => {
            const parentWidth =
              $container.parentElement?.offsetWidth || /* istanbul ignore next */ 1 // avoid division by zero
            const percentage = Math.min(100, Math.max(5, (newWidth / parentWidth) * 100)) // clamp between 5% and 100%
            const roundedPercentage = Math.round(percentage / 5) * 5 // round to nearest 5%

            const className = `rte-w-${roundedPercentage}`

            // Remove previous width classes like w-5, w-10, etc.
            $img.classList.forEach((cls) => {
              if (/^rte-w-\d+$/.test(cls)) {
                $img.classList.remove(cls)
              }
            })
            $container.classList.forEach((cls) => {
              if (/^rte-w-\d+$/.test(cls)) {
                $container.classList.remove(cls)
              }
            })
            $container.classList.add(className)
            $img.classList.add(className)
          }

          $resizeDot.addEventListener(
            'pointerdown',
            (e: PointerEvent) => {
              e.preventDefault() // Prevent unwanted scrolling or selection
              isResizing = true
              startX = e.clientX
              startWidth = $container.offsetWidth

              const onPointerMove = (e: PointerEvent) => {
                if (!isResizing) return
                const deltaX = index % 2 === 0 ? -(e.clientX - startX) : e.clientX - startX

                const newWidth = startWidth + deltaX

                transformAndApplyWidthToClassname(newWidth)
              }

              const onPointerUp = () => {
                if (isResizing) {
                  isResizing = false
                }
                dispatchNodeView()

                document.removeEventListener('pointermove', onPointerMove)
                document.removeEventListener('pointerup', onPointerUp)
              }

              document.addEventListener('pointermove', onPointerMove)
              document.addEventListener('pointerup', onPointerUp)
            },
            { passive: false }
          )

          $container.appendChild($resizeDot)
        })
      })

      // Remove the image alignment controller and resize dots when clicking outside the container
      document.addEventListener('click', (e: MouseEvent) => {
        const $target = e.target as HTMLElement
        const isClickInside = $container.contains($target)

        if (!isClickInside) {
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
