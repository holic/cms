import React from "react";
import ReactDOM from "react-dom";

const container = document.getElementById("app");

const render = () => {
  const App = require("./app/App").default;
  ReactDOM.render(<App />, container);
};

render();

if (module.hot) {
  module.hot.accept(render);
}
