import { createKcPageStory } from '@/stories/keycloak-theme/KcPageStory'
import type { Meta, StoryObj } from '@storybook/react'

/**
 * This file was originally generated with keycloakify(https://docs.keycloakify.dev/) by running the command:
 *  `npx keycloakify add-story` and then select `login.ftl` option.
 */

const { KcPageStory } = createKcPageStory({ pageId: 'login.ftl' })

const meta: Meta<typeof KcPageStory> = {
  title: 'Keycloak Theme/Login Page',
  component: KcPageStory,
  tags: ['skip-test'], // TODO: Skipping a11 test on this story because it is throwing many errors not related to a11 like: "page.evaluate: TypeError: globalThis.__getContext is not a function"
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}

export default meta

type Story = StoryObj<typeof KcPageStory>

const defaultRealmArgs = {
  registrationAllowed: false,
  rememberMe: false,
  resetPasswordAllowed: false,
  internationalizationEnabled: false
}

export const CurrentConfiguration: Story = {
  render: () => <KcPageStory kcContext={{ realm: defaultRealmArgs }} />
}

export const WithInvalidCredential: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        realm: defaultRealmArgs,
        login: {
          username: 'johndoe'
        },
        messagesPerField: {
          // NOTE: The other functions of messagesPerField are derived from get() and
          // existsError() so they are the only ones that need to mock.
          existsError: (fieldName: string, ...otherFieldNames: string[]) => {
            const fieldNames = [fieldName, ...otherFieldNames]
            return fieldNames.includes('username') || fieldNames.includes('password')
          },
          get: (fieldName: string) => {
            if (fieldName === 'username' || fieldName === 'password') {
              return 'Invalid username or password.'
            }
            return ''
          }
        }
      }}
    />
  )
}

export const WithErrorMessage: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        realm: defaultRealmArgs,
        message: {
          summary:
            'The time allotted for the connection has elapsed.<br/>The login process will restart from the beginning.',
          type: 'error'
        }
      }}
    />
  )
}

/*
  Below are some examples of the Login Page with different props we dont really use yet.
  The custom Login Page theme is prepared for these variants but we do not use them in the application.
  You can uncomment them if you want to see how they look like.
*/

// export const Default: Story = {
//   render: () => <KcPageStory />
// }

// export const WithoutRegistration: Story = {
//   render: () => (
//     <KcPageStory
//       kcContext={{
//         realm: { registrationAllowed: false }
//       }}
//     />
//   )
// }

// export const WithoutRememberMe: Story = {
//   render: () => (
//     <KcPageStory
//       kcContext={{
//         realm: { rememberMe: false }
//       }}
//     />
//   )
// }

// export const WithoutPasswordReset: Story = {
//   render: () => (
//     <KcPageStory
//       kcContext={{
//         realm: { resetPasswordAllowed: false }
//       }}
//     />
//   )
// }

// export const WithEmailAsUsername: Story = {
//   render: () => (
//     <KcPageStory
//       kcContext={{
//         realm: { loginWithEmailAllowed: false }
//       }}
//     />
//   )
// }

// export const WithPresetUsername: Story = {
//   render: () => (
//     <KcPageStory
//       kcContext={{
//         login: { username: 'max.mustermann@mail.com' }
//       }}
//     />
//   )
// }

// export const WithImmutablePresetUsername: Story = {
//   render: () => (
//     <KcPageStory
//       kcContext={{
//         auth: {
//           attemptedUsername: 'max.mustermann@mail.com',
//           showUsername: true
//         },
//         usernameHidden: true,
//         message: {
//           type: 'info',
//           summary: 'Please re-authenticate to continue'
//         }
//       }}
//     />
//   )
// }

// export const WithSocialProviders: Story = {
//   render: () => (
//     <KcPageStory
//       kcContext={{
//         social: {
//           displayInfo: true,
//           providers: [
//             {
//               loginUrl: 'google',
//               alias: 'google',
//               providerId: 'google',
//               displayName: 'Google',
//               iconClasses: 'fa fa-google'
//             },
//             {
//               loginUrl: 'microsoft',
//               alias: 'microsoft',
//               providerId: 'microsoft',
//               displayName: 'Microsoft',
//               iconClasses: 'fa fa-windows'
//             },
//             {
//               loginUrl: 'facebook',
//               alias: 'facebook',
//               providerId: 'facebook',
//               displayName: 'Facebook',
//               iconClasses: 'fa fa-facebook'
//             },
//             {
//               loginUrl: 'instagram',
//               alias: 'instagram',
//               providerId: 'instagram',
//               displayName: 'Instagram',
//               iconClasses: 'fa fa-instagram'
//             },
//             {
//               loginUrl: 'twitter',
//               alias: 'twitter',
//               providerId: 'twitter',
//               displayName: 'Twitter',
//               iconClasses: 'fa fa-twitter'
//             },
//             {
//               loginUrl: 'linkedin',
//               alias: 'linkedin',
//               providerId: 'linkedin',
//               displayName: 'LinkedIn',
//               iconClasses: 'fa fa-linkedin'
//             },
//             {
//               loginUrl: 'stackoverflow',
//               alias: 'stackoverflow',
//               providerId: 'stackoverflow',
//               displayName: 'Stackoverflow',
//               iconClasses: 'fa fa-stack-overflow'
//             },
//             {
//               loginUrl: 'github',
//               alias: 'github',
//               providerId: 'github',
//               displayName: 'Github',
//               iconClasses: 'fa fa-github'
//             },
//             {
//               loginUrl: 'gitlab',
//               alias: 'gitlab',
//               providerId: 'gitlab',
//               displayName: 'Gitlab',
//               iconClasses: 'fa fa-gitlab'
//             },
//             {
//               loginUrl: 'bitbucket',
//               alias: 'bitbucket',
//               providerId: 'bitbucket',
//               displayName: 'Bitbucket',
//               iconClasses: 'fa fa-bitbucket'
//             },
//             {
//               loginUrl: 'paypal',
//               alias: 'paypal',
//               providerId: 'paypal',
//               displayName: 'PayPal',
//               iconClasses: 'fa fa-paypal'
//             },
//             {
//               loginUrl: 'openshift',
//               alias: 'openshift',
//               providerId: 'openshift',
//               displayName: 'OpenShift',
//               iconClasses: 'fa fa-cloud'
//             }
//           ]
//         }
//       }}
//     />
//   )
// }

// export const WithoutPasswordField: Story = {
//   render: () => (
//     <KcPageStory
//       kcContext={{
//         realm: { password: false }
//       }}
//     />
//   )
// }

// export const WithOneSocialProvider: Story = {
//   render: (args) => (
//     <KcPageStory
//       {...args}
//       kcContext={{
//         social: {
//           displayInfo: true,
//           providers: [
//             {
//               loginUrl: 'google',
//               alias: 'google',
//               providerId: 'google',
//               displayName: 'Google',
//               iconClasses: 'fa fa-google'
//             }
//           ]
//         }
//       }}
//     />
//   )
// }

// export const WithTwoSocialProviders: Story = {
//   render: (args) => (
//     <KcPageStory
//       {...args}
//       kcContext={{
//         social: {
//           displayInfo: true,
//           providers: [
//             {
//               loginUrl: 'google',
//               alias: 'google',
//               providerId: 'google',
//               displayName: 'Google',
//               iconClasses: 'fa fa-google'
//             },
//             {
//               loginUrl: 'microsoft',
//               alias: 'microsoft',
//               providerId: 'microsoft',
//               displayName: 'Microsoft',
//               iconClasses: 'fa fa-windows'
//             }
//           ]
//         }
//       }}
//     />
//   )
// }

// export const WithNoSocialProviders: Story = {
//   render: (args) => (
//     <KcPageStory
//       {...args}
//       kcContext={{
//         social: {
//           displayInfo: true,
//           providers: []
//         }
//       }}
//     />
//   )
// }

// export const WithMoreThanTwoSocialProviders: Story = {
//   render: (args) => (
//     <KcPageStory
//       {...args}
//       kcContext={{
//         social: {
//           displayInfo: true,
//           providers: [
//             {
//               loginUrl: 'google',
//               alias: 'google',
//               providerId: 'google',
//               displayName: 'Google',
//               iconClasses: 'fa fa-google'
//             },
//             {
//               loginUrl: 'microsoft',
//               alias: 'microsoft',
//               providerId: 'microsoft',
//               displayName: 'Microsoft',
//               iconClasses: 'fa fa-windows'
//             },
//             {
//               loginUrl: 'facebook',
//               alias: 'facebook',
//               providerId: 'facebook',
//               displayName: 'Facebook',
//               iconClasses: 'fa fa-facebook'
//             },
//             {
//               loginUrl: 'twitter',
//               alias: 'twitter',
//               providerId: 'twitter',
//               displayName: 'Twitter',
//               iconClasses: 'fa fa-twitter'
//             }
//           ]
//         }
//       }}
//     />
//   )
// }

// export const WithSocialProvidersAndWithoutRememberMe: Story = {
//   render: (args) => (
//     <KcPageStory
//       {...args}
//       kcContext={{
//         social: {
//           displayInfo: true,
//           providers: [
//             {
//               loginUrl: 'google',
//               alias: 'google',
//               providerId: 'google',
//               displayName: 'Google',
//               iconClasses: 'fa fa-google'
//             }
//           ]
//         },
//         realm: { rememberMe: false }
//       }}
//     />
//   )
// }
