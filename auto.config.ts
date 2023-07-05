import { AutoRc } from 'auto'

/** Auto configuration */
export default function rc(): AutoRc {
  return {
    plugins: ['released', 'npm', 'all-contributors', 'first-time-contributor'],
    onlyPublishWithReleaseLabel: true,
    baseBranch: 'develop'
  }
}
