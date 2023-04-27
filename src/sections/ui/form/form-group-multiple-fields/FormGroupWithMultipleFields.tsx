import { Row } from '../../grid/Row'
import { Col } from '../../grid/Col'
import React, { PropsWithChildren, ReactNode, useState } from 'react'
import styles from './FormGroupWithMultipleFields.module.scss'
import { RequiredInputSymbol } from '../required-input-symbol/RequiredInputSymbol'
import { DynamicFieldsButtons } from './dynamic-fields-buttons/DynamicFieldsButtons'
import { FormGroup } from '../form-group/FormGroup'

const Title = ({ title, required }: { title: string; required?: boolean }) => (
  <span className={styles.title}>
    {title} {required && <RequiredInputSymbol />}
  </span>
)

function getFieldWithIndex(children: ReactNode, fieldIndex: number) {
  const isFormGroup = (child: ReactNode) => {
    return React.isValidElement(child) && child.type === FormGroup
  }

  return React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) {
      return child
    }

    const childProps = isFormGroup(child)
      ? { ...child.props, fieldIndex: fieldIndex.toString() }
      : { ...child.props }

    if (child.props.children) {
      childProps.children = getFieldWithIndex(child.props.children, fieldIndex)
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
        const fieldWithIndex = withDynamicFields ? getFieldWithIndex(field, index) : field

        return (
          <Row key={index}>
            <Col sm={3}>{isFirstField && <Title title={title} required={required} />}</Col>
            <Col sm={6}>{fieldWithIndex}</Col>
            <Col sm={3}>
              {withDynamicFields && (
                <DynamicFieldsButtons
                  originalField={isFirstField}
                  onAddButtonClick={() => setFields([...fields, fieldWithIndex])}
                  onRemoveButtonClick={() => setFields(fields.filter((_, i) => i !== index))}
                />
              )}
            </Col>
          </Row>
        )
      })}
    </>
  )
}
