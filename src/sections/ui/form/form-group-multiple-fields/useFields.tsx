import React, { ReactElement, ReactNode, useState } from 'react'
import { FormGroup } from '../form-group/FormGroup'

function getFieldsWithIndex(fields: Array<ReactNode>) {
  return fields.map((field, index) => getFieldWithIndex(field, index))
}

function getFieldWithIndex(field: ReactNode, fieldIndex: number) {
  return React.Children.map(field, (child: ReactNode) => {
    if (!React.isValidElement(child)) {
      return child
    }

    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    const childProps = getPropsWithFieldIndex(child, fieldIndex)

    /* eslint-disable @typescript-eslint/no-unsafe-member-access */
    if (child.props.children) {
      /* eslint-disable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument */
      childProps.children = getFieldWithIndex(child.props.children, fieldIndex)
    }

    /* eslint-disable @typescript-eslint/no-unsafe-argument */
    return React.cloneElement(child, childProps)
  })
}

function getPropsWithFieldIndex(child: ReactElement, fieldIndex: number) {
  const isFormGroup = (child: ReactNode) => {
    return React.isValidElement(child) && child.type === FormGroup
  }

  /* eslint-disable @typescript-eslint/no-unsafe-return */
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
