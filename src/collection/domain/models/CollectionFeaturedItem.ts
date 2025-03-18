export type CollectionFeaturedItem = CustomFeaturedItem | DvObjectFeaturedItem

export type CustomFeaturedItem = {
  id: number
  type?: 'custom' // Optional for now for demo purposes
  content: string
  imageFileName?: string
  imageFileUrl?: string
  displayOrder: number
}

export type DvObjectFeaturedItem = {
  id: number
  type?: 'collection' | 'dataset' | 'file' // Optional for now for demo purposes
  linkUrl?: string // Optional for now for demo purposes
  title?: string // Optional for now for demo purposes
  description?: string // Optional for now for demo purposes
}
