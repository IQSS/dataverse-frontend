import TopBarProgress from 'react-topbar-progress-indicator'
import { useTheme } from 'dataverse-design-system'
import { useEffect, useState } from 'react'
import { useLoading } from '../../loading/LoadingContext'
import isChromatic from 'chromatic/isChromatic'

const TopBarProgressIndicator = () => {
  const theme = useTheme()
  const { isLoading } = useLoading()
  const [progress, setProgress] = useState(false)

  useEffect(() => {
    setProgress(isLoading && !isChromatic())
  }, [isLoading])

  TopBarProgress.config({
    barColors: {
      '0': theme.color.brand,
      '1.0': theme.color.secondary
    },
    shadowBlur: 5
  })

  return progress ? <TopBarProgress /> : <></>
}

export default TopBarProgressIndicator
