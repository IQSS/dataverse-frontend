import { FeaturedItemType } from '@/collection/domain/models/CollectionFeaturedItem'
import { Col, Form } from '@iqss/dataverse-design-system'

interface DvObjectFormItemProps {
  itemIndex: number
  featuredItemType: FeaturedItemType | ''
  editEnabled: boolean
}

export const DvObjectFormItem = ({
  itemIndex,
  featuredItemType,
  editEnabled
}: DvObjectFormItemProps) => {
  /*
  - Detect the featured item type based on the url identifiers.
  - After getting the identifier and type of it we can search for the object and see if it exists.
  - If it doesn't exist we show an error message to the user.
  - If it exists but it is outside the collection we show a warning message to the user like:
    - "This object is not part of this collection."
  - Then to the API we will just show the identifier and type of it.
  - A collection alias could be confused with a file identifier.
  - The url type and indentifier detector should handle both JSF and SPA urls for every object type.
  */

  return (
    <div>
      <Form.Group>
        <Form.Group.Label required htmlFor={`dv-object-id-${itemIndex}`} sm={3}>
          Dataverse Object Identifier
        </Form.Group.Label>
        <Col md={9}>
          <Form.Group.Input
            type="text"
            aria-required={true}
            placeholder={`${window.location.origin}/spa/datasets?persistentId=doi:10.5072/FK2/8YOKQI`}
          />
          <Form.Group.Text>
            Paste the Collection, Dataset or File URL you want to feature.
            <br /> You can also paste a Dataset DOI directly.
          </Form.Group.Text>
        </Col>
      </Form.Group>
    </div>
  )
}
