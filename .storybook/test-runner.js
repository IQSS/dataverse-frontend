const { injectAxe, checkA11y, configureAxe } = require('axe-playwright')

const { getStoryContext } = require('@storybook/test-runner')

module.exports = {
  async preRender(page) {
    await injectAxe(page)
  },
  async postRender(page, context) {
    const storyContext = await getStoryContext(page, context)

    await configureAxe(page, {
      rules: storyContext.parameters?.a11y?.config?.rules
    })

    await checkA11y(page, '#root', {
      detailedReport: true,
      detailedReportOptions: {
        html: true
      }
    })
  }
}
