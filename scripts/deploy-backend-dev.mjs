// Copies the production build in dist/ into a Dataverse backend checkout, where
// docker-compose-dev.spa.yml auto-deploys it to /modern.
//
// Usage: npm run build:backend-dev [-- <path to IQSS/dataverse checkout>]   (default: ../dataverse)

import { spawnSync } from 'node:child_process'
import { cp, mkdir, readdir, rm, stat } from 'node:fs/promises'
import path from 'node:path'
import { loadEnv } from 'vite'

const backendRepo = path.resolve(process.argv[2] ?? '../dataverse')
const distDir = path.resolve('dist')
const targetDir = path.join(backendRepo, 'docker-dev-volumes', 'app', 'spa')

const exists = (p) =>
  stat(p).then(
    () => true,
    () => false
  )

if (!(await exists(path.join(backendRepo, 'docker-compose-dev.yml')))) {
  throw new Error(`${backendRepo} does not look like an IQSS/dataverse checkout`)
}
if (!(await exists(path.join(distDir, 'index.html')))) {
  throw new Error('dist/ is missing, run `npm run build` first')
}

// Write dist/config.js with the .env.backend-dev values (prefixed shell variables take precedence)
const env = loadEnv('backend-dev', process.cwd(), ['DATAVERSE_BACKEND_URL', 'OIDC_'])
const result = spawnSync(process.execPath, ['scripts/write-runtime-config.mjs'], {
  env: { ...process.env, ...env },
  stdio: 'inherit'
})
if (result.status !== 0) process.exit(result.status ?? 1)

// Empty the directory instead of removing it, so a running container's bind mount stays valid
await mkdir(targetDir, { recursive: true })
for (const entry of await readdir(targetDir)) {
  await rm(path.join(targetDir, entry), { recursive: true, force: true })
}
await cp(distDir, targetDir, { recursive: true })
// Payara needs WEB-INF/web.xml to deploy the directory as a web app (also serves index.html on 404)
await mkdir(path.join(targetDir, 'WEB-INF'), { recursive: true })
await cp(path.resolve('deployment/payara/web.xml'), path.join(targetDir, 'WEB-INF', 'web.xml'))

console.log(`SPA copied to ${targetDir} (backendUrl: ${env.DATAVERSE_BACKEND_URL})`)
console.log('Open http://localhost:8080/modern (a running backend dev env serves it right away;')
console.log('otherwise start it with docker-compose-dev.yml + docker-compose-dev.spa.yml)')
