import React from 'react'
import { Router, Route, IndexRoute, IndexRedirect, Link, browserHistory } from 'react-router'

import Layout from './Layout'
import List from './List'
import Edit from './Edit'
import * as models from './models'

// TODO: make sure we're routing to a valid model, otherwise redirect

const firstModel = models[Object.keys(models)[0]]

export default function App () {
  return (
    <Router history={browserHistory}>
      <Route path="/" component={Layout}>
        <IndexRedirect to={`/content/${firstModel.property}`} />
        <Route path="content/:model">
          <IndexRoute component={List} />
          <Route path=":id" component={Edit} />
        </Route>
      </Route>
    </Router>
  )
}
