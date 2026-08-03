# External Vocabulary Presentation Plugins

This folder is a frontend-only demo of protocol-specific external vocabulary presentation and workflow plugins.

Today the registry is populated with built-in examples:

- `dataverse.example.person-or-organization-jsf`
- `dataverse.example.orcid-person`
- `dataverse.example.ror-organization`
- `dataverse.example.skosmos`

A plugin can:

- match an `ExternalVocabularyConfig` from CVocConf
- replace the form field workflow with `FormField`
- customize generic search result rendering with `formatTerm`
- customize managed-field mapping with `getManagedFieldValue`
- replace dataset metadata display with `DisplayValue`

Later, an external package could export one or more `ExternalVocabularyPlugin` objects and the application shell could register them with:

```ts
import { registerExternalVocabularyPlugin } from '@/external-vocabularies/presentation/plugins/externalVocabularyPluginRegistry'
import { myProtocolPlugin } from '@dataverse-community/my-protocol-plugin'

registerExternalVocabularyPlugin(myProtocolPlugin)
```

CVocConf remains the activation/configuration source. The registry only decides which frontend presentation/workflow behavior to use for the configured protocol.
