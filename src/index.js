import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRedirect, Link, browserHistory } from 'react-router'

import App from './App'
import List from './List'
import Edit from './Edit'
import * as models from './models'

// TODO: make sure we're routing to a valid model, otherwise redirect

const firstModel = models[Object.keys(models)[0]]

render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRedirect to={`/content/${firstModel.property}`} />
      <Route path="content/:model" component={List} />
      <Route path="content/:model/:id" component={Edit} />
    </Route>
  </Router>,
  document.getElementById('app')
)
