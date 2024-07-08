interface CreateCollectionProps {
  ownerCollectionId?: string
}

export function CreateCollection({ ownerCollectionId }: CreateCollectionProps) {
  return (
    <div>
      <p>CreateCollection</p>
      <p>Owner Collection ID: {ownerCollectionId ?? 'root'}</p>
    </div>
  )
}

export default CreateCollection
