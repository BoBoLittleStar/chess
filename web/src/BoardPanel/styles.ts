import styled from "@emotion/styled";

export const color = "gray";
export const unit = 120;
export const segment = unit / 5;
export const gap = unit / 15;
export const fontFamily = "Wawati SC";
export const fontSize = 4;
export const Div = styled.div`
  width: 800px;
  background: cornsilk;
  border: 8px double black;

  svg {
    line {
      stroke: ${color};
      stroke-width: 1;
    }

    circle {
      &.red {
        stroke: red;
      }

      &.black {
        stroke: black;
      }

      &.circle-empty {
        fill: transparent;
      }

      &.circle-outer {
        cursor: pointer;
        fill: white;
        stroke-width: 2;
      }

      &.circle-inner {
        cursor: pointer;
        fill: white;
        stroke-width: 4;
      }
    }

    rect {
      &.rect-selected {
        fill: none;
        stroke-width: 5px;
        stroke: blue;
      }
    }

    text {
      user-select: none;

      &.board-background {
        cursor: default;
        fill: ${color};
        font-family: ${fontFamily};
        font-size: ${fontSize}em;
        text-anchor: middle;

        &.chu {
          transform: translate(-3em, 0.3em);
        }

        &.han {
          transform: translate(3em, 0.3em);
        }
      }

      &.chess {
        cursor: pointer;
        font-family: ${fontFamily};
        font-size: ${fontSize}em;
        text-anchor: middle;
        text-blink: 1;
        transform: translateY(0.3em);

        &.red {
          fill: red;
        }

        &.black {
          fill: black;
        }
      }
    }
  }
`;
