import { useRef, useState } from 'react'
import { Editor } from '@tiptap/react'
import { ButtonGroup } from '../button-group/ButtonGroup'
import { Button } from '../button/Button'
import {
  ArrowLeft,
  ArrowRight,
  BlockquoteRight,
  Code,
  CodeSquare,
  Link,
  ListOl,
  ListUl,
  TypeBold,
  TypeH1,
  TypeH2,
  TypeH3,
  TypeItalic,
  TypeStrikethrough,
  TypeUnderline
} from 'react-bootstrap-icons'
import { Modal } from '../modal/Modal'
import { Form } from '../form/Form'
import { Col } from '../grid/Col'
import styles from './EditorActions.module.scss'

const EDITOR_FORMATS = {
  heading: 'heading',
  bold: 'bold',
  italic: 'italic',
  underline: 'underline',
  strike: 'strike',
  code: 'code',
  codeBlock: 'codeBlock',
  link: 'link',
  blockquote: 'blockquote',
  bulletList: 'bulletList',
  orderedList: 'orderedList'
} as const

interface EditorActionsProps {
  editor: Editor
  disabled?: boolean
}

export const EditorActions = ({ editor, disabled }: EditorActionsProps) => {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const linkTextfieldRef = useRef<HTMLInputElement>(null)

  const handleOpenLinkDialog = () => setLinkDialogOpen(true)
  const handleCloseLinkDialog = () => setLinkDialogOpen(false)

  const handleOKLinkDialog = () => {
    const url = linkTextfieldRef.current?.value

    if (url) {
      editor.chain().focus().extendMarkRange(EDITOR_FORMATS.link).setLink({ href: url }).run()
    } else {
      editor.chain().focus().extendMarkRange(EDITOR_FORMATS.link).unsetLink().run()
    }
    setLinkDialogOpen(false)
  }

  const handleToggleH1 = () => editor.chain().focus().toggleHeading({ level: 1 }).run()
  const isActiveH1 = !disabled && editor.isActive(EDITOR_FORMATS.heading, { level: 1 })

  const handleToggleH2 = () => editor.chain().focus().toggleHeading({ level: 2 }).run()
  const isActiveH2 = !disabled && editor.isActive(EDITOR_FORMATS.heading, { level: 2 })

  const handleToggleH3 = () => editor.chain().focus().toggleHeading({ level: 3 }).run()
  const isActiveH3 = !disabled && editor.isActive(EDITOR_FORMATS.heading, { level: 3 })

  const handleToggleBold = () => editor.chain().focus().toggleBold().run()
  const isActiveBold = !disabled && editor.isActive(EDITOR_FORMATS.bold)

  const handleToggleItalic = () => editor.chain().focus().toggleItalic().run()
  const isActiveItalic = !disabled && editor.isActive(EDITOR_FORMATS.italic)

  const handleToggleUnderline = () => editor.chain().focus().toggleUnderline().run()
  const isActiveUnderline = !disabled && editor.isActive(EDITOR_FORMATS.underline)

  const handleToggleStrike = () => editor.chain().focus().toggleStrike().run()
  const isActiveStrike = !disabled && editor.isActive(EDITOR_FORMATS.strike)

  const handleToggleCode = () => editor.chain().focus().toggleCode().run()
  const isActiveCode = !disabled && editor.isActive(EDITOR_FORMATS.code)

  const handleToogleCodeBlock = () => editor.chain().focus().toggleCodeBlock().run()
  const isActiveCodeBlock = !disabled && editor.isActive(EDITOR_FORMATS.codeBlock)

  const handleToggleBlockquote = () => editor.chain().focus().toggleBlockquote().run()
  const isActiveBlockquote = !disabled && editor.isActive(EDITOR_FORMATS.blockquote)

  const handleToggleBulletList = () => editor.chain().focus().toggleBulletList().run()
  const isActiveBulletList = !disabled && editor.isActive(EDITOR_FORMATS.bulletList)

  const handleToggleOrderedList = () => editor.chain().focus().toggleOrderedList().run()
  const isActiveOrderedList = !disabled && editor.isActive(EDITOR_FORMATS.orderedList)

  const handleUndo = () => editor.chain().focus().undo().run()
  const handleRedo = () => editor.chain().focus().redo().run()

  return (
    <>
      <div className={styles['editor-actions-wrapper']}>
        {/* Headings */}
        <ButtonGroup>
          <Button
            onClick={handleToggleH1}
            className={`${styles['editor-actions-button']} ${isActiveH1 ? styles.selected : ''}`}
            aria-pressed={isActiveH1}
            aria-label="Heading 1"
            disabled={disabled}
            title="Heading 1"
            variant="secondary"
            size="sm"
            icon={<TypeH1 size={18} />}
          />
          <Button
            onClick={handleToggleH2}
            className={`${styles['editor-actions-button']} ${isActiveH2 ? styles.selected : ''}`}
            aria-pressed={isActiveH2}
            aria-label="Heading 2"
            disabled={disabled}
            title="Heading 2"
            variant="secondary"
            size="sm"
            icon={<TypeH2 size={18} />}
          />
          <Button
            onClick={handleToggleH3}
            className={`${styles['editor-actions-button']} ${isActiveH3 ? styles.selected : ''}`}
            aria-pressed={isActiveH3}
            aria-label="Heading 3"
            disabled={disabled}
            title="Heading 3"
            variant="secondary"
            size="sm"
            icon={<TypeH3 size={18} />}
          />
        </ButtonGroup>

        {/* Font styles */}
        <ButtonGroup>
          <Button
            onClick={handleToggleBold}
            className={`${styles['editor-actions-button']} ${isActiveBold ? styles.selected : ''}`}
            aria-pressed={isActiveBold}
            aria-label="Bold"
            disabled={disabled}
            title="Bold"
            variant="secondary"
            size="sm"
            icon={<TypeBold size={18} />}
          />
          <Button
            onClick={handleToggleItalic}
            className={`${styles['editor-actions-button']} ${
              isActiveItalic ? styles.selected : ''
            }`}
            aria-pressed={isActiveItalic}
            aria-label="Italic"
            disabled={disabled}
            title="Italic"
            variant="secondary"
            size="sm"
            icon={<TypeItalic size={18} />}
          />

          <Button
            onClick={handleToggleUnderline}
            className={`${styles['editor-actions-button']} ${
              isActiveUnderline ? styles.selected : ''
            }`}
            aria-pressed={isActiveUnderline}
            aria-label="Underline"
            disabled={disabled}
            title="Underline"
            variant="secondary"
            size="sm"
            icon={<TypeUnderline size={18} />}
          />
          <Button
            onClick={handleToggleStrike}
            className={`${styles['editor-actions-button']} ${
              isActiveStrike ? styles.selected : ''
            }`}
            aria-pressed={isActiveStrike}
            aria-label="Strikethrough"
            disabled={disabled}
            title="Strikethrough"
            variant="secondary"
            size="sm"
            icon={<TypeStrikethrough size={18} />}
          />
        </ButtonGroup>

        {/* Lists */}
        <ButtonGroup>
          <Button
            onClick={handleToggleBulletList}
            className={`${styles['editor-actions-button']} ${
              isActiveBulletList ? styles.selected : ''
            }`}
            aria-pressed={isActiveBulletList}
            aria-label="Unordered list"
            disabled={disabled}
            title="Unordered list"
            variant="secondary"
            size="sm"
            icon={<ListUl size={18} />}
          />
          <Button
            onClick={handleToggleOrderedList}
            className={`${styles['editor-actions-button']} ${
              isActiveOrderedList ? styles.selected : ''
            }`}
            aria-pressed={isActiveOrderedList}
            aria-label="Ordered list"
            disabled={disabled}
            title="Ordered list"
            variant="secondary"
            size="sm"
            icon={<ListOl size={18} />}
          />
        </ButtonGroup>

        {/* Extras */}
        <ButtonGroup>
          <Button
            onClick={handleOpenLinkDialog}
            className={`${styles['editor-actions-button']}`}
            aria-label="Add link"
            disabled={disabled}
            title="Add link"
            variant="secondary"
            size="sm"
            icon={<Link size={18} />}
          />
          <Button
            onClick={handleToggleCode}
            className={`${styles['editor-actions-button']} ${isActiveCode ? styles.selected : ''}`}
            aria-pressed={isActiveCode}
            aria-label="Code"
            disabled={disabled}
            title="Code"
            variant="secondary"
            size="sm"
            icon={<Code size={18} />}
          />
          <Button
            onClick={handleToogleCodeBlock}
            className={`${styles['editor-actions-button']} ${
              isActiveCodeBlock ? styles.selected : ''
            }`}
            aria-pressed={isActiveCodeBlock}
            aria-label="Code block"
            disabled={disabled}
            title="Code block"
            variant="secondary"
            size="sm"
            icon={<CodeSquare size={18} />}
          />
          <Button
            onClick={handleToggleBlockquote}
            className={`${styles['editor-actions-button']} ${
              isActiveBlockquote ? styles.selected : ''
            }`}
            aria-pressed={isActiveBlockquote}
            aria-label="Blockquote"
            title="Blockquote"
            disabled={disabled}
            variant="secondary"
            size="sm"
            icon={<BlockquoteRight size={18} />}
          />
        </ButtonGroup>

        {/* Undo - Redo */}
        <ButtonGroup>
          <Button
            onClick={handleUndo}
            className={`${styles['editor-actions-button']}`}
            aria-label="Undo"
            disabled={disabled || !editor.can().undo()}
            title="Undo"
            variant="secondary"
            size="sm"
            icon={<ArrowLeft size={18} />}
          />
          <Button
            onClick={handleRedo}
            className={`${styles['editor-actions-button']}`}
            aria-label="Redo"
            disabled={disabled || !editor.can().redo()}
            title="Redo"
            variant="secondary"
            size="sm"
            icon={<ArrowRight size={18} />}
          />
        </ButtonGroup>
      </div>

      {/* Dialog for pasting a url to the link */}
      <Modal show={linkDialogOpen} onHide={handleCloseLinkDialog} size="lg">
        <Modal.Header>
          <Modal.Title>Add link</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="link-url" as={Col}>
            <Form.Group.Label column>Link</Form.Group.Label>
            <Col>
              <Form.Group.Input type="text" ref={linkTextfieldRef} />
            </Col>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleOKLinkDialog} variant="primary">
            OK
          </Button>
          <Button onClick={handleCloseLinkDialog} variant="secondary">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
