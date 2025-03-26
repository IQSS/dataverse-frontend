import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../WithI18next'
import { FeaturedItemView } from '@/sections/featured-item/featured-item-view/FeaturedItemView'
import { CollectionFeaturedItemMother } from '@tests/component/collection/domain/models/CollectionFeaturedItemMother'
import { CollectionMother } from '@tests/component/collection/domain/models/CollectionMother'

const customFeaturedItemOne = CollectionFeaturedItemMother.createCustomFeaturedItem('css', {
  id: 1,
  displayOrder: 1,
  content: `<h1 class="rte-heading">A Friendly Introduction to Container Queries</h1>\n<h2 class="rte-heading">By Josh W. Comeau</h2>\n<p class="rte-paragraph"><br>For a very long time, the most-requested CSS feature has been <em class="rte-italic">container queries.</em> That’s been our holy grail, the biggest missing piece in the CSS toolkit.</p>\n<p class="rte-paragraph"><strong class="rte-bold">Well, container queries have finally arrived.</strong> They’ve been supported in all major browsers for almost two years. Our prayers have been answered!</p>\n<p class="rte-paragraph">We can now apply conditional CSS based on an element’s <em class="rte-italic">container</em>, using familiar syntax:</p>\n<pre class="rte-code-block"><code>@container (min-width: 40rem) {\r\n  .some-elem {\r\n    font-size: 1.5rem;\r\n  }\r\n}</code></pre>\n<p class="rte-paragraph"><strong class="rte-bold">Curiously, though, very few of us have actually been </strong><em class="rte-italic">using</em><strong class="rte-bold"> container queries.</strong> Most of the developers I’ve spoken with have only done a few brief experiments, if they’ve tried them at all. We finally have the tool we’ve been asking for, but we haven’t adopted it.</p>\n<p class="rte-paragraph">There are lots of reasons for this, but I think one of the biggest is that there’s been a lot of confusion around <em class="rte-italic">how they work.</em> Container queries are not as straightforward as media queries. In order to use them effectively, we need to understand what the constraints are, and how to work within them.</p>\n<p class="rte-paragraph">I’ve been using container queries for a few months now, and they really are quite lovely once you have the right mental model. In this blog post, we’ll unpack all of this stuff so that you can start using them in your work!</p>\n<h2 class="rte-heading">The basic idea</h2>\n<p class="rte-paragraph">So for the past couple of decades, our main tool for doing <em class="rte-italic">responsive design</em> has been the media query. Most commonly, we use the width of the viewport to conditionally apply some CSS:</p>\n<pre class="rte-code-block"><code>@media (min-width: 40rem) {\r\n  .mobile-only {    \r\n    display: none;  \r\n  }\r\n}</code></pre>\n<p class="rte-paragraph">Media queries are great, but they’re only concerned with <em class="rte-italic">global</em> properties, things like the viewport dimensions or the operating system’s color theme. Sometimes, we want to apply CSS conditionally based on something <em class="rte-italic">local</em>, like the size of the element’s container.</p>\n<p class="rte-paragraph">For example, suppose we have a <code class="rte-code">ProfileCard</code> component, to display critical info about a user’s profile:</p>\n<p class="rte-paragraph">In this particular circumstance, each <code class="rte-code">ProfileCard</code> is pretty narrow, and so the information stacks vertically in 1 tall column.</p>\n<p class="rte-paragraph">In other circumstances, though, we might have a bit more breathing room. Wouldn’t it be cool if our ProfileCard could automatically shift between layouts, depending on the available space?</p>\n<p class="rte-paragraph">In <em class="rte-italic">some</em> cases, we can use media queries for this, if our <code class="rte-code">ProfileCard</code> scales with the size of the viewport… But this won’t always be the case.</p>\n<p class="rte-paragraph">With dynamic layouts like this, each <code class="rte-code">ProfileCard</code> will use whichever layout makes the most sense given the amount of space available. It has nothing to do with the size of the viewport!</p>\n<p class="rte-paragraph">Clearly, media queries aren’t the right tool for this job. Instead, we can use <em class="rte-italic">container queries</em> to solve this problem. Here’s what it looks like:</p>\n<p class="rte-paragraph">Copy to clipboard</p>\n<pre class="rte-code-block"><code>.child-wrapper { \r\n  container-type: inline-size;\r\n}\r\n\r\n.child {  \r\n  /* Narrow layout stuff here */ \r\n\r\n  @container (min-width: 15rem) {\r\n    /* Wide layout stuff here */  \r\n  }\r\n}</code></pre>\n<p class="rte-paragraph">Pretty cool, right? I'm using native CSS nesting to place the <code class="rte-code">@container</code> at-rule right inside the <code class="rte-code">.child</code> block so that all of the CSS declarations for this element are in the same chunk of CSS.</p>\n<p class="rte-paragraph"><strong class="rte-bold">But wait, what’s the deal with </strong><code class="rte-code">.child-wrapper</code><strong class="rte-bold">?</strong> What is that <code class="rte-code">container-type</code> property doing??</p>\n<p class="rte-paragraph">Well, this is where things get a bit tricky. In order to use a container query, we first need to explicitly define its container. This can have some unintended consequences.</p>\n<p class="rte-paragraph"><strong class="rte-bold">It’s worth spending a few minutes digging into this.</strong> Understanding this core mechanism will save us <em class="rte-italic">hours</em> of frustration down the line. Let’s talk about the “impossible problem” with container queries.<br><br><a target="_blank" rel="noopener noreferrer nofollow" class="rte-link" href="https://www.joshwcomeau.com/css/container-queries-introduction/">https://www.joshwcomeau.com/css/container-queries-introduction/</a></p>`
})

const collectionMock = CollectionMother.create()

const meta: Meta<typeof FeaturedItemView> = {
  title: 'Pages/FeaturedItem',
  component: FeaturedItemView,
  decorators: [WithI18next],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}

export default meta
type Story = StoryObj<typeof FeaturedItemView>

export const Default: Story = {
  render: () => (
    <FeaturedItemView
      featuredItem={customFeaturedItemOne}
      showBreadcrumbs
      collectionHierarchy={collectionMock.hierarchy}
    />
  )
}

export const WithoutBreadcrumbs: Story = {
  render: () => <FeaturedItemView featuredItem={customFeaturedItemOne} />
}

export const WithoutImage: Story = {
  render: () => (
    <FeaturedItemView
      featuredItem={{ ...customFeaturedItemOne, imageFileUrl: undefined }}
      showBreadcrumbs
      collectionHierarchy={collectionMock.hierarchy}
    />
  )
}
