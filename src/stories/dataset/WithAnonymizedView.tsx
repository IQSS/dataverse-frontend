import { StoryFn } from '@storybook/react'
import { AnonymizedContext } from '../../sections/dataset/anonymized/AnonymizedContext'

export const WithAnonymizedView = (Story: StoryFn) => {
  const setAnonymizedView = () => {}

  return (
    <AnonymizedContext.Provider value={{ anonymizedView: true, setAnonymizedView }}>
      <Story />
    </AnonymizedContext.Provider>
  )
}
