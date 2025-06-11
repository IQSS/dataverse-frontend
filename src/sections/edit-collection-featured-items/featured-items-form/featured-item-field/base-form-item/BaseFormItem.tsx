import { Controller, UseControllerProps, useFormContext } from 'react-hook-form'
import { Card } from '@iqss/dataverse-design-system'
import cn from 'classnames'
import { FeaturedItemType } from '@/collection/domain/models/CollectionFeaturedItem'
import styles from './BaseFormItem.module.scss'

/**
 * This is the default form item that will be used when the user is adding a new featured item.
 * The user will select which type of featured item wants, custom or dvobject.
 * It will be able to unselect the type of featured item and select it again.
 */

interface BaseFormItemProps {
  itemIndex: number
  onSelectType: (index: number, type: FeaturedItemType) => void
}

export const BaseFormItem = ({ itemIndex, onSelectType }: BaseFormItemProps) => {
  const { control } = useFormContext()

  const rules: UseControllerProps['rules'] = {
    validate: (value) => {
      if (value === 'base') {
        return `Please select a type of featured item or remove the item.`
      }
      return true
    }
  }

  return (
    <div>
      <p>
        <strong>Select a type of featured item 👇</strong>
      </p>

      <Controller
        name={`featuredItems.${itemIndex}.type`}
        control={control}
        rules={rules}
        render={({ field: { ref }, fieldState: { invalid, error } }) => {
          return (
            <>
              {invalid && <div className="text-danger small mb-1">{error?.message}</div>}
              <ul
                className={cn(styles['types-list'], {
                  [styles['is-invalid']]: invalid
                })}>
                <input type="text" className="visually-hidden" ref={ref} />
                <li>
                  <Card
                    className={styles['card-option']}
                    onClick={() => onSelectType(itemIndex, FeaturedItemType.CUSTOM)}>
                    <Card.Body>
                      <span>
                        <strong>Custom</strong>
                      </span>
                      <br />
                      <span className="small text-muted">
                        This type of featured item allows you to create blog posts, news, or any
                        other type of content you want to feature in the collection. It can include
                        rich content and an optional image as a banner.
                      </span>
                    </Card.Body>
                  </Card>
                </li>
                {/* TODO:ME - Probably we want to avoid feature dv objects if the collection is not published yet? See https://guides.dataverse.org/en/latest/user/dataverse-management.html#featured-dataverse-collection */}
                <li>
                  <Card
                    className={styles['card-option']}
                    onClick={() => onSelectType(itemIndex, FeaturedItemType.COLLECTION)}>
                    <Card.Body>
                      <span>
                        <strong>Dataverse Object</strong>
                        <br />
                        <span className="small text-muted">
                          This type of featured item allows you to feature a{' '}
                          <strong>collection</strong>, <strong>dataset</strong>, or{' '}
                          <strong>file</strong>.
                        </span>
                      </span>
                    </Card.Body>
                  </Card>
                </li>
              </ul>
            </>
          )
        }}
      />
    </div>
  )
}
