import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { buildRuntimeConfig, serializeRuntimeConfig } from './runtime-config.mjs'

const sourcePath = path.resolve('public/config.js')
const outputPath = path.resolve('dist/config.js')

const runtimeConfig = await buildRuntimeConfig(sourcePath)

await mkdir(path.dirname(outputPath), { recursive: true })
await writeFile(outputPath, serializeRuntimeConfig(runtimeConfig))
