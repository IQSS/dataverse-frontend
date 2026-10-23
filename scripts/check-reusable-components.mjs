import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const root = 'dist-reusable-components/reusable-components'
const forbidden = ['Configuration not found', '__APP_CONFIG__']

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? walk(path) : path.endsWith('.js') ? [path] : []
  })
}

const offenders = walk(root).filter((file) => {
  const source = readFileSync(file, 'utf8')
  return forbidden.some((needle) => source.includes(needle))
})

if (offenders.length > 0) {
  console.error('Reusable components must not depend on the SPA runtime config (public/config.js).')
  console.error('Found the SPA config loader in:\n  ' + offenders.join('\n  '))
  process.exit(1)
}
console.log('reusable components: no SPA config dependency')
