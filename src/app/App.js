import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Layout from "./Layout";

const App = () => (
  <BrowserRouter>
    {/*
        We're using a Route with render prop to render the Layout instead of
        rendering it directly so that we can pass in a location and break
        memoization of the Layout component.
      */}
    <Route render={({ location }) => <Layout location={location} />} />
  </BrowserRouter>
);

export default React.memo(App);
