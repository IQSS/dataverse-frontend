import { useState } from 'react'
import { Button, Offcanvas } from '@iqss/dataverse-design-system'
import { FunnelFill } from 'react-bootstrap-icons'
import styles from './FilterPanel.module.scss'

export const FilterPanel = () => {
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  return (
    <div className={styles['filter-panel']}>
      <Button
        variant="primary"
        className={styles['toggle-canvas-btn']}
        onClick={handleShow}
        size="sm">
        <FunnelFill /> Filter Results
      </Button>

      <Offcanvas show={show} onHide={handleClose} responsive="lg">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filter Results</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>All the content goes here</Offcanvas.Body>
      </Offcanvas>
    </div>
  )
}
