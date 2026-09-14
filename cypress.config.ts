import { defineConfig } from 'cypress'
import vitePreprocessor from 'cypress-vite'
import path from 'path'
import fs from 'node:fs'
import os from 'node:os'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)
const solrCollectionUrl = 'http://localhost:8983/solr/collection1'
const solrCoreAdminUrl = 'http://localhost:8983/solr/admin/cores'
const solrSchemaPath = '/var/solr/data/collection1/conf/schema.xml'

type ExecFileError = Error & {
  stderr?: string
  stdout?: string
}

export default defineConfig({
  video: false,
  e2e: {
    baseUrl: 'http://localhost:8000',
    specPattern: 'tests/e2e-integration/**/*.spec.{js,jsx,ts,tsx}',
    fixturesFolder: 'tests/e2e-integration/fixtures',
    screenshotOnRunFailure: false,
    video: false,
    viewportWidth: 1920,
    viewportHeight: 1080,
    supportFile: 'tests/support/e2e.ts',
    setupNodeEvents(on, config) {
      on('file:preprocessor', vitePreprocessor(path.resolve(__dirname, './vite.config.ts')))

      on('task', {
        async solrSchemaFieldExists(fieldName: string): Promise<boolean> {
          const statusCode = await runDockerCommand(config, [
            'exec',
            getSolrContainerName(config),
            'curl',
            '-sS',
            '-o',
            '/tmp/solr-schema-field-response.json',
            '-w',
            '%{http_code}',
            `${solrCollectionUrl}/schema/fields/${encodeURIComponent(fieldName)}`
          ])

          if (statusCode.trim() === '200') {
            return true
          }

          if (statusCode.trim() === '404') {
            return false
          }

          throw new Error(`Unexpected Solr schema field check status for ${fieldName}: ${statusCode}`)
        },
        async replaceSolrSchemaWithDataverseGeneratedSchema(): Promise<null> {
          const generatedSchemaFragment = await getDataverseGeneratedSolrSchemaFragment(config)
          const currentSchema = await runDockerCommand(config, [
            'exec',
            getSolrContainerName(config),
            'cat',
            solrSchemaPath
          ])
          const mergedSchema = mergeGeneratedSchemaFragment(currentSchema, generatedSchemaFragment)
          await copySchemaToSolrContainer(config, mergedSchema)
          await reloadSolrCore(config)
          return null
        }
      })
    },
    defaultCommandTimeout: 10_000 // https://docs.cypress.io/guides/references/configuration#Timeouts
  },
  component: {
    indexHtmlFile: 'tests/support/component-index.html',
    specPattern: ['tests/component/**/*.spec.{js,jsx,ts,tsx}'],
    supportFile: 'tests/support/component.ts',
    fixturesFolder: 'tests/component/fixtures',
    devServer: {
      framework: 'react',
      bundler: 'vite'
    },
    setupNodeEvents(on, config) {
      // eslint-disable-next-line  @typescript-eslint/no-unsafe-call, @typescript-eslint/no-var-requires
      require('@cypress/code-coverage/task')(on, config)

      return config
    }
  },
  env: {
    frontendBasePath: '/modern',
    backendUrl: 'http://localhost:8000',
    oidcClientId: 'test',
    oidcAuthorizationEndpoint: 'http://localhost:8000/realms/test/protocol/openid-connect/auth',
    oidcTokenEndpoint: 'http://localhost:8000/realms/test/protocol/openid-connect/token',
    oidcLogoutEndpoint: 'http://localhost:8000/realms/test/protocol/openid-connect/logout',
    oidcLocalStorageKeyPrefix: 'DV_',
    languages: [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Español' }
    ],
    defaultLanguage: 'en',
    branding: {
      dataverseName: 'Dataverse'
    },
    homepage: {
      supportUrl: 'https://support.dataverse.harvard.edu/'
    },
    footer: {
      copyrightHolder: 'The President & Fellows of Harvard College',
      privacyPolicyUrl: 'https://support.dataverse.harvard.edu/harvard-dataverse-privacy-policy'
    },
    codeCoverage: {
      exclude: ['tests/**/*.*', '**/ErrorPage.tsx', '**/EditGuestBook.tsx']
    }
  }
})

function getSolrContainerName(config: Cypress.PluginConfigOptions): string {
  return (config.env.solrContainerName as string | undefined) ?? 'dev_solr'
}

async function getDataverseGeneratedSolrSchemaFragment(
  config: Cypress.PluginConfigOptions
): Promise<string> {
  const backendUrl = config.env.backendUrl as string
  const response = await fetch(`${backendUrl}/api/v1/admin/index/solr/schema`)

  if (!response.ok) {
    throw new Error(`Error while getting Dataverse-generated Solr schema: ${response.status}`)
  }

  return response.text()
}

async function copySchemaToSolrContainer(
  config: Cypress.PluginConfigOptions,
  schemaXml: string
): Promise<void> {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dataverse-solr-schema-'))
  const tempSchemaPath = path.join(tempDir, 'schema.xml')

  try {
    fs.writeFileSync(tempSchemaPath, schemaXml)
    await runDockerCommand(config, [
      'cp',
      tempSchemaPath,
      `${getSolrContainerName(config)}:${solrSchemaPath}`
    ])
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true })
  }
}

async function reloadSolrCore(config: Cypress.PluginConfigOptions): Promise<void> {
  await runDockerCommand(config, [
    'exec',
    getSolrContainerName(config),
    'curl',
    '-sS',
    `${solrCoreAdminUrl}?action=RELOAD&core=collection1&wt=json`
  ])
}

function mergeGeneratedSchemaFragment(
  currentSchema: string,
  generatedSchemaFragment: string
): string {
  const generatedSchemaLines = generatedSchemaFragment.split('\n')
  const fieldLines = generatedSchemaLines.filter((line) => line.includes('<field '))
  const copyFieldLines = generatedSchemaLines.filter((line) => line.includes('<copyField '))

  return replaceSchemaSection(
    replaceSchemaSection(
      currentSchema,
      '<!-- SCHEMA-FIELDS::BEGIN -->',
      '<!-- SCHEMA-FIELDS::END -->',
      fieldLines
    ),
    '<!-- SCHEMA-COPY-FIELDS::BEGIN -->',
    '<!-- SCHEMA-COPY-FIELDS::END -->',
    copyFieldLines
  )
}

function replaceSchemaSection(
  schema: string,
  beginMarker: string,
  endMarker: string,
  replacementLines: string[]
): string {
  const beginIndex = schema.indexOf(beginMarker)
  const endIndex = schema.indexOf(endMarker)

  if (beginIndex === -1 || endIndex === -1 || beginIndex > endIndex) {
    throw new Error(`Could not find Solr schema section ${beginMarker}.`)
  }

  return [
    schema.slice(0, beginIndex + beginMarker.length),
    '',
    replacementLines.join('\n'),
    schema.slice(endIndex)
  ].join('\n')
}

async function runDockerCommand(
  _config: Cypress.PluginConfigOptions,
  args: string[]
): Promise<string> {
  try {
    const { stdout } = await execFileAsync('docker', args, { maxBuffer: 10 * 1024 * 1024 })
    return stdout
  } catch (error) {
    const execError = error as ExecFileError
    throw new Error(
      `Docker command failed: docker ${args.join(' ')}. Reason was: ${
        execError.stderr ?? execError.stdout ?? execError.message
      }`
    )
  }
}
