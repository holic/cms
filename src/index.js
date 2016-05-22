import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, IndexRedirect, Link, browserHistory } from 'react-router'

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
      <Route path="content/:model">
        <IndexRoute component={List} />
        <Route path=":id" component={Edit} />
      </Route>
    </Route>
  </Router>,
  document.getElementById('app')
)
