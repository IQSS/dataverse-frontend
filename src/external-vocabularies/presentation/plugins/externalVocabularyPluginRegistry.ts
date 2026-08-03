import { ExternalVocabularyConfig } from '@/external-vocabularies/domain/models/ExternalVocabularyConfig'
import { ExternalVocabularyPlugin } from './ExternalVocabularyPlugin'
import { orcidPersonPlugin } from './examples/orcidPersonPlugin'
import { personOrOrganizationPlugin } from './examples/personOrOrganizationPlugin'
import { rorOrganizationPlugin } from './examples/rorOrganizationPlugin'
import { skosmosVocabularyPlugin } from './examples/skosmosVocabularyPlugin'

const registeredExternalVocabularyPlugins: ExternalVocabularyPlugin[] = [
  personOrOrganizationPlugin,
  orcidPersonPlugin,
  rorOrganizationPlugin,
  skosmosVocabularyPlugin
]

export function registerExternalVocabularyPlugin(plugin: ExternalVocabularyPlugin): void {
  const existingPluginIndex = registeredExternalVocabularyPlugins.findIndex(
    (registeredPlugin) => registeredPlugin.id === plugin.id
  )

  if (existingPluginIndex >= 0) {
    registeredExternalVocabularyPlugins.splice(existingPluginIndex, 1, plugin)
    return
  }

  registeredExternalVocabularyPlugins.push(plugin)
}

export function getExternalVocabularyPlugin(
  externalVocabulary?: ExternalVocabularyConfig
): ExternalVocabularyPlugin | undefined {
  if (!externalVocabulary) {
    return undefined
  }

  return registeredExternalVocabularyPlugins.find((plugin) => plugin.matches(externalVocabulary))
}

export function listExternalVocabularyPlugins(): ExternalVocabularyPlugin[] {
  return [...registeredExternalVocabularyPlugins]
}
