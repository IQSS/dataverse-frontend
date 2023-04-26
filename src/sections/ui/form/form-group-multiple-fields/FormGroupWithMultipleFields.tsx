import { Row } from '../../grid/Row'
import { Col } from '../../grid/Col'
import React, { PropsWithChildren, ReactNode, useState } from 'react'
import styles from './FormGroupWithMultipleFields.module.scss'
import { RequiredInputSymbol } from '../required-input-symbol/RequiredInputSymbol'
import { DynamicFieldsButtons } from './dynamic-fields-buttons/DynamicFieldsButtons'

const MultipleFieldsTitle = ({ title, required }: { title: string; required?: boolean }) => (
  <span className={styles.title}>
    {title} {required && <RequiredInputSymbol />}
  </span>
)

function setChildrenKey(children: ReactNode, multipleFieldIndex: number) {
  return React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) {
      return child
    }

    // @ts-ignore
    const childProps = child.props.controlId
      ? { ...child.props, multipleFieldIndex: multipleFieldIndex }
      : { ...child.props }

    // @ts-ignore
    if (child.props.children) {
      // @ts-ignore
      childProps.children = setChildrenKey(child.props.children, multipleFieldIndex)
    }

    return React.cloneElement(child, childProps)
  })
}

interface FormGroupWithMultipleFieldsProps {
  title: string
  withDynamicFields?: boolean
  required?: boolean
}

export function FormGroupWithMultipleFields({
  title,
  withDynamicFields,
  required,
  children
}: PropsWithChildren<FormGroupWithMultipleFieldsProps>) {
  const [fields, setFields] = useState([children])

  return (
    <>
      {fields.map((field, index) => {
        const isFirstField = index == 0
        const fieldWithKey = setChildrenKey(field, index)

        return (
          <Row key={index}>
            <Col sm={3}>
              {isFirstField && <MultipleFieldsTitle title={title} required={required} />}
            </Col>
            <Col sm={6}>{fieldWithKey}</Col>
            <Col sm={3}>
              {withDynamicFields && (
                <DynamicFieldsButtons
                  onAddButtonClick={() => setFields([...fields, fieldWithKey])}
                  onRemoveButtonClick={() => setFields(fields.filter((_, i) => i !== index))}
                  originalField={isFirstField}
                />
              )}
            </Col>
          </Row>
        )
      })}
    </>
  )
}
