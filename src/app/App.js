import React, { Fragment } from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-firebase";
import { app as firebaseApp } from "../firebase";

import Layout from "./Layout";

export default function App() {
  return (
    <Provider firebaseApp={firebaseApp}>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </Provider>
  );
}
