import { Col, Form, Row } from '@iqss/dataverse-design-system'
import { type MetadataField } from '../../../../../../../../metadata-block-info/domain/models/MetadataBlockInfo'
import { MetadataFormField, type CommonFieldProps } from '..'
import styles from '../index.module.scss'

interface ComposedFieldProps extends CommonFieldProps {
  metadataBlockName: string
  childMetadataFields: Record<string, MetadataField>
  compoundParentName?: string
  fieldsArrayIndex?: number
}

export const ComposedField = ({
  metadataBlockName,
  title,
  name,
  description,
  childMetadataFields,
  rulesToApply
}: ComposedFieldProps) => {
  return (
    <Form.GroupWithMultipleFields
      title={title}
      message={description}
      required={Boolean(rulesToApply?.required)}>
      <Row>
        <Col sm={9} className={styles['composed-fields-grid']}>
          {Object.entries(childMetadataFields).map(
            ([childMetadataFieldKey, childMetadataFieldInfo]) => {
              return (
                <MetadataFormField
                  key={childMetadataFieldKey}
                  metadataFieldInfo={childMetadataFieldInfo}
                  metadataBlockName={metadataBlockName}
                  withinMultipleFieldsGroup={true}
                  compoundParentName={name}
                  compoundParentIsRequired={Boolean(rulesToApply?.required)}
                />
              )
            }
          )}
        </Col>
      </Row>
    </Form.GroupWithMultipleFields>
  )
}
