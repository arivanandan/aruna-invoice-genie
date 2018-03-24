import React from "react";
import ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";
import { createStore } from "redux-jetpack";
import initialState from "./initial-state";
import App from "./app";

const root = document.getElementById("container");

const store = createStore(initialState);

delete AppContainer.prototype.unstable_handleError;
//FTW!

const render = Component =>
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    root
  );

render(App(store));

if (module.hot) module.hot.accept("./app", () => render(App(store)));
