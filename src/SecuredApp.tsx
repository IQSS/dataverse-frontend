import React from 'react'
import App from './App'
import { AuthProvider, TAuthConfig } from 'react-oauth2-code-pkce'

const authConfig: TAuthConfig = {
  clientId: 'test',
  authorizationEndpoint: 'http://localhost:8000/realms/test/protocol/openid-connect/auth',
  tokenEndpoint: 'http://localhost:8000/realms/test/protocol/openid-connect/token',
  logoutEndpoint: 'http://localhost:8000/realms/test/protocol/openid-connect/logout',
  redirectUri: 'http://localhost:8000/spa',
  scope: 'openid'
}

class SecuredApp extends React.Component {
  public render() {
    return (
      <AuthProvider authConfig={authConfig}>
        <App />
      </AuthProvider>
    )
  }
}

export default SecuredApp
