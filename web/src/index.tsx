import styled from "@emotion/styled";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { App } from "./App";
import { Panel } from "./Panel";
import { store } from "./reducers/store";

const Div = styled.div`
  margin: auto;
  width: min-content;
  display: flex;
`;
ReactDOM.render(
  <Provider store={store}>
    <Div>
      <App />
      <Panel />
    </Div>
  </Provider>,
  document.getElementById("root")
);
