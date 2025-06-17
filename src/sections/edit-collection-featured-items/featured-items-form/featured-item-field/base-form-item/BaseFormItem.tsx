import { Controller, UseControllerProps, useFormContext } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
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
  onSelectType: (index: number, type: FeaturedItemType.CUSTOM | '' | 'base') => void
}

export const BaseFormItem = ({ itemIndex, onSelectType }: BaseFormItemProps) => {
  const { control } = useFormContext()
  const { t } = useTranslation('editCollectionFeaturedItems')

  const rules: UseControllerProps['rules'] = {
    validate: (value) => {
      if (value === 'base') {
        return t('baseItem.required')
      }
      return true
    }
  }

  return (
    <div>
      <p>
        <strong>{t('baseItem.label')} 👇</strong>
      </p>

      <Controller
        name={`featuredItems.${itemIndex}.type`}
        control={control}
        rules={rules}
        render={({ field: { ref }, fieldState: { invalid, error } }) => {
          return (
            <>
              {invalid && <div className="text-danger small mb-1">{error?.message}</div>}
              {/* This hidden input is needed for scrolling this field into view if the user submits the form and didn't select an option */}
              <input
                type="text"
                className="visually-hidden"
                ref={ref}
                aria-label={t('baseItem.required')}
                tabIndex={-1}
              />

              <ul
                className={cn(styles['types-list'], {
                  [styles['is-invalid']]: invalid
                })}>
                <li>
                  <Card
                    className={styles['card-option']}
                    onClick={() => onSelectType(itemIndex, FeaturedItemType.CUSTOM)}>
                    <Card.Body>
                      <span>
                        <strong>{t('baseItem.custom.label')}</strong>
                      </span>
                      <br />
                      <span className="small text-muted">{t('baseItem.custom.description')}</span>
                    </Card.Body>
                  </Card>
                </li>

                <li>
                  <Card
                    className={styles['card-option']}
                    onClick={() => onSelectType(itemIndex, '')}>
                    <Card.Body>
                      <span>
                        <strong>{t('baseItem.dvObject.label')}</strong>
                        <br />
                        <span className="small text-muted">
                          <Trans
                            t={t}
                            i18nKey="baseItem.dvObject.description"
                            components={{ bold: <strong /> }}
                          />
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
