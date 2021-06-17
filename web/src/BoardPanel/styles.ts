import styled from "@emotion/styled";
import { color, unit } from "./constants";

export const Div = styled.div`
  width: 800px;
  background: cornsilk;
  border: 2px solid black;

  svg {
    line {
      stroke: ${color};
      stroke-width: 1;
    }

    text.board-background {
      fill: ${color};
      font-family: serif;
      font-size: ${unit / 2}px;

      &.chu {
        transform: translate(-6em, 0.3em);
      }

      &.han {
        transform: translate(3em, 0.3em);
      }
    }
  }
`;
