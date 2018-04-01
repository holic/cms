import React, { PureComponent } from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-firebase";
import { app as firebaseApp } from "../firebase";
import Layout from "./Layout";

export default class App extends PureComponent {
  render() {
    return (
      <Provider firebaseApp={firebaseApp}>
        <BrowserRouter>
          <Layout />
        </BrowserRouter>
      </Provider>
    );
  }
}
