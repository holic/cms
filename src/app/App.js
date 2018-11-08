import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { Provider } from "react-firebase";
import { app as firebaseApp } from "../firebase";
import Layout from "./Layout";

const App = () => (
  <Provider firebaseApp={firebaseApp}>
    <BrowserRouter>
      {/*
        We're using a Route with render prop to render the Layout instead of
        rendering it directly so that we can pass in a location and break
        memoization of the Layout component.
      */}
      <Route render={({ location }) => <Layout location={location} />} />
    </BrowserRouter>
  </Provider>
);

export default React.memo(App);
