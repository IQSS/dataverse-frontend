import { Trans, useTranslation } from 'react-i18next'
import { useSession } from '@/sections/session/SessionContext'
import { Route } from '@/sections/Route.enum'
import { CollectionItemType } from '@/collection/domain/models/CollectionItemType'
import styles from './ItemsList.module.scss'

interface NoItemsMessageProps {
  itemsTypesSelected: CollectionItemType[]
}

export function NoItemsMessage({ itemsTypesSelected }: NoItemsMessageProps) {
  const { t } = useTranslation('collection')
  const { user } = useSession()

  const itemTypeMessages = {
    all: t('noItemsMessage.itemTypeMessage.all'),
    [CollectionItemType.COLLECTION]: t('noItemsMessage.itemTypeMessage.collection'),
    [CollectionItemType.DATASET]: t('noItemsMessage.itemTypeMessage.dataset'),
    [CollectionItemType.FILE]: t('noItemsMessage.itemTypeMessage.file'),
    collectionAndDataset: t('noItemsMessage.itemTypeMessage.collectionAndDataset'),
    collectionAndFile: t('noItemsMessage.itemTypeMessage.collectionAndFile'),
    datasetAndFile: t('noItemsMessage.itemTypeMessage.datasetAndFile')
  }

  const getMessageKey = (itemsTypesSelected: CollectionItemType[]) => {
    const itemCount = itemsTypesSelected.length

    if (itemCount === 3) return itemTypeMessages.all
    if (itemCount === 1) {
      const itemType = itemsTypesSelected[0]
      return itemTypeMessages[itemType]
    }

    if (itemCount === 2) {
      if (
        itemsTypesSelected.includes(CollectionItemType.COLLECTION) &&
        itemsTypesSelected.includes(CollectionItemType.DATASET)
      ) {
        return itemTypeMessages.collectionAndDataset
      }
      if (
        itemsTypesSelected.includes(CollectionItemType.COLLECTION) &&
        itemsTypesSelected.includes(CollectionItemType.FILE)
      ) {
        return itemTypeMessages.collectionAndFile
      }
      if (
        itemsTypesSelected.includes(CollectionItemType.DATASET) &&
        itemsTypesSelected.includes(CollectionItemType.FILE)
      ) {
        return itemTypeMessages.datasetAndFile
      }
    }
  }

  const messageKey = getMessageKey(itemsTypesSelected)

  return (
    <div className={styles['custom-message-container']}>
      {user ? (
        <p>{t('noItemsMessage.authenticated', { typeOfEmptyItems: messageKey })}</p>
      ) : (
        <Trans
          t={t}
          i18nKey="noItemsMessage.anonymous"
          values={{ typeOfEmptyItems: messageKey }}
          components={{
            1: <a href={Route.LOG_IN}>log in</a>
          }}
        />
      )}
    </div>
  )
}
