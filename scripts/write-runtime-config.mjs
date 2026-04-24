import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import vm from 'node:vm'

const sourcePath = path.resolve('public/config.js')
const outputPath = path.resolve('dist/config.js')

const source = await readFile(sourcePath, 'utf8')

const sandbox = { window: {} }
vm.createContext(sandbox)
new vm.Script(source, { filename: sourcePath }).runInContext(sandbox)

const baseConfig = sandbox.window.__APP_CONFIG__

if (!baseConfig || typeof baseConfig !== 'object') {
  throw new Error(`Expected window.__APP_CONFIG__ to be defined in ${sourcePath}`)
}

const withOverride = (key, value) => (value ? { [key]: value } : {})

const runtimeConfig = {
  ...baseConfig,
  ...withOverride('backendUrl', process.env.DATAVERSE_BACKEND_URL),
  oidc: {
    ...baseConfig.oidc,
    ...withOverride('clientId', process.env.OIDC_CLIENT_ID),
    ...withOverride('authorizationEndpoint', process.env.OIDC_AUTHORIZATION_ENDPOINT),
    ...withOverride('tokenEndpoint', process.env.OIDC_TOKEN_ENDPOINT),
    ...withOverride('logoutEndpoint', process.env.OIDC_LOGOUT_ENDPOINT),
    ...withOverride('localStorageKeyPrefix', process.env.OIDC_STORAGE_KEY_PREFIX)
  }
}

await mkdir(path.dirname(outputPath), { recursive: true })
await writeFile(outputPath, `window.__APP_CONFIG__ = ${JSON.stringify(runtimeConfig, null, 2)}\n`)
