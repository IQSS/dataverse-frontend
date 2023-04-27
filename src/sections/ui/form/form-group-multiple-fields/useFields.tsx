import React, { ReactElement, ReactNode, useState } from 'react'
import { FormGroup } from '../form-group/FormGroup'

function getFieldsWithIndex(fields: Array<ReactNode>) {
  return fields.map((field, index) => getFieldWithIndex(field, index))
}

function getFieldWithIndex(field: ReactNode, fieldIndex: number) {
  return React.Children.map(field, (child) => {
    if (!React.isValidElement(child)) {
      return child
    }

    const childProps = getPropsWithFieldIndex(child, fieldIndex)

    if (child.props.children) {
      childProps.children = getFieldWithIndex(child.props.children, fieldIndex)
    }

    return React.cloneElement(child, childProps)
  })
}

function getPropsWithFieldIndex(child: ReactElement, fieldIndex: number) {
  const isFormGroup = (child: ReactNode) => {
    return React.isValidElement(child) && child.type === FormGroup
  }

  return isFormGroup(child)
    ? { ...child.props, fieldIndex: fieldIndex.toString() }
    : { ...child.props }
}

export function useFields(initialField: ReactNode | undefined, withDynamicFields?: boolean) {
  const initialFieldWithIndex = withDynamicFields
    ? getFieldWithIndex(initialField, 0)
    : initialField
  const [fields, setFields] = useState([initialFieldWithIndex])

  const addField = (field: ReactNode | undefined) =>
    setFields(getFieldsWithIndex([...fields, field]))

  const removeField = (fieldIndex: number) =>
    setFields(getFieldsWithIndex(fields.filter((_, i) => i !== fieldIndex)))

  return { fields, addField, removeField }
}
