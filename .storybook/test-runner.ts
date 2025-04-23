import { injectAxe, checkA11y, configureAxe } from 'axe-playwright'

import { getStoryContext } from '@storybook/test-runner'

import type { TestRunnerConfig } from '@storybook/test-runner'

const a11yConfig: TestRunnerConfig = {
  async preVisit(page, context) {
    const { parameters } = await getStoryContext(page, context)

    // Wait for the Story
    if (parameters.waitForSelector) {
      console.dir({ waitForSelector: parameters.waitForSelector })
      await page.waitForSelector(parameters.waitForSelector, {
        timeout: 15_000
      })
    }
    // await page.locator(parameters.waitForSelector).waitFor({ state: 'attached', timeout: 15_000 })

    // if (tags.includes('wait-attached')) {
    //   await page.locator('#kc-login-template').waitFor({ state: 'attached', timeout: 15_000 })
    // }

    await injectAxe(page)
  },
  async postVisit(page, context) {
    const storyContext = await getStoryContext(page, context)

    await configureAxe(page, {
      rules: storyContext.parameters?.a11y?.config?.rules
    })

    await checkA11y(page, '#storybook-root', {
      detailedReport: true,
      detailedReportOptions: {
        html: true
      }
    })
  }
}

module.exports = a11yConfig
