import React from "react";
import ReactDOM from "react-dom";

const container = document.getElementById("react-root");

const render = () => {
  const App = require("./app/App").default;
  ReactDOM.render(<App />, container);
};

render();

if (module.hot) {
  module.hot.accept(render);
}
