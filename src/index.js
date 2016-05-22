import 'react-hot-loader/patch'

import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from './app/App'

const rootEl = document.getElementById('app')

render(
  <AppContainer>
    <App />
  </AppContainer>,
  rootEl
)

if (module.hot) {
  module.hot.accept('./app/App', () => {
    const NextApp = require('./app/App').default
    render(
      <AppContainer>
        <NextApp />
      </AppContainer>,
      rootEl
    )
  })
}
