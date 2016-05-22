import 'react-hot-loader/patch'

import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from './App'

const rootEl = document.getElementById('app')

render(
  <AppContainer>
    <App />
  </AppContainer>,
  rootEl
)

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default
    render(
      <AppContainer>
        <NextApp />
      </AppContainer>,
      rootEl
    )
  })
}
