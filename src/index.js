import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRedirect, Link, browserHistory } from 'react-router'

import App from './App'
import Manager from './Manager'
import * as models from './models'

// TODO: make sure we're routing to a valid model, otherwise redirect

const firstModel = models[Object.keys(models)[0]]

render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRedirect to={`/content/${firstModel.property}`} />
      <Route path="content">
        <Route path=":model" component={Manager} />
      </Route>
    </Route>
  </Router>,
  document.getElementById('app')
)
