import { mkdirSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sass from 'sass'

const require = createRequire(import.meta.url)
const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const bootstrapPackageRoot = path.dirname(require.resolve('bootstrap/package.json'))
const nodeModulesRoot = path.dirname(bootstrapPackageRoot)
const inputFile = path.join(packageRoot, 'src/lib/assets/styles/bootstrap-global.scss')
const outputFile = path.join(packageRoot, 'dist/bootstrap-global.css')

const result = sass.compile(inputFile, {
  loadPaths: [nodeModulesRoot],
  style: 'compressed'
})

mkdirSync(path.dirname(outputFile), { recursive: true })
writeFileSync(outputFile, `${result.css}\n`)
