import styled from "@emotion/styled";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BoardPanel } from "./BoardPanel";
import { ButtonPanel } from "./ButtonPanel";
import { store } from "./reducers";

const Div = styled.div`
  margin: auto;
  width: min-content;
  display: flex;
`;

ReactDOM.render(
  <Provider store={store}>
    <Div>
      <BoardPanel />
      <ButtonPanel />
    </Div>
  </Provider>,
  document.getElementById("root")
);
