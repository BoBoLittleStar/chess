import styled from "@emotion/styled";
import React, { Fragment } from "react";

const unit = 120;
const segment = unit / 5;
const gap = unit / 15;
const color = "gray";

const decorations: { x: number; y: number }[] = [
  { x: 1, y: 2 },
  { x: 7, y: 2 },
  { x: 0, y: 3 },
  { x: 2, y: 3 },
  { x: 4, y: 3 },
  { x: 6, y: 3 },
  { x: 8, y: 3 },
  { x: 1, y: 7 },
  { x: 7, y: 7 },
  { x: 0, y: 6 },
  { x: 2, y: 6 },
  { x: 4, y: 6 },
  { x: 6, y: 6 },
  { x: 8, y: 6 },
];

export const App = () => {
  const Div = styled.div`
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
  const textChuHe = <text className="board-background chu">楚&emsp;河</text>;
  const textHanJie = <text className="board-background han">汉&emsp;界</text>;
  return (
    <Div>
      <svg viewBox={`-${unit * 5} -${unit * 5.5} ${unit * 10} ${unit * 11}`}>
        <line x1={unit * -4} y1={unit * -4.5} x2={unit * -4} y2={unit * 4.5} />
        <line x1={unit * 4} y1={unit * -4.5} x2={unit * 4} y2={unit * 4.5} />
        {Array.from(Array(10).keys()).map((n) => (
          <line
            key={`h${n}`}
            x1={unit * -4}
            y1={unit * (n - 4.5)}
            x2={unit * 4}
            y2={unit * (n - 4.5)}
          />
        ))}
        {Array.from(Array(7).keys()).map((n) => (
          <Fragment key={`v${n}`}>
            <line
              x1={unit * (n - 3)}
              y1={unit * -4.5}
              x2={unit * (n - 3)}
              y2={unit * -0.5}
            />
            <line
              x1={unit * (n - 3)}
              y1={unit * 0.5}
              x2={unit * (n - 3)}
              y2={unit * 4.5}
            />
          </Fragment>
        ))}
        <line x1={-unit} y1={unit * -4.5} x2={unit} y2={unit * -2.5} />
        <line x1={unit} y1={unit * -4.5} x2={-unit} y2={unit * -2.5} />
        <line x1={-unit} y1={unit * 2.5} x2={unit} y2={unit * 4.5} />
        <line x1={-unit} y1={unit * 4.5} x2={unit} y2={unit * 2.5} />
        {textChuHe}
        {textHanJie}
        {decorations.map(({ x, y }) => (
          <Fragment key={`${x}-${y}`}>
            {x > 0 && (
              <>
                <line
                  x1={unit * (x - 4) - segment - gap}
                  y1={unit * (y - 4.5) - gap}
                  x2={unit * (x - 4) - gap}
                  y2={unit * (y - 4.5) - gap}
                />
                <line
                  x1={unit * (x - 4) - segment - gap}
                  y1={unit * (y - 4.5) + gap}
                  x2={unit * (x - 4) - gap}
                  y2={unit * (y - 4.5) + gap}
                />
                <line
                  x1={unit * (x - 4) - gap}
                  y1={unit * (y - 4.5) - segment - gap}
                  x2={unit * (x - 4) - gap}
                  y2={unit * (y - 4.5) - gap}
                />
                <line
                  x1={unit * (x - 4) - gap}
                  y1={unit * (y - 4.5) + segment + gap}
                  x2={unit * (x - 4) - gap}
                  y2={unit * (y - 4.5) + gap}
                />
              </>
            )}
            {x < 8 && (
              <>
                <line
                  x1={unit * (x - 4) + segment + gap}
                  y1={unit * (y - 4.5) - gap}
                  x2={unit * (x - 4) + gap}
                  y2={unit * (y - 4.5) - gap}
                />
                <line
                  x1={unit * (x - 4) + segment + gap}
                  y1={unit * (y - 4.5) + gap}
                  x2={unit * (x - 4) + gap}
                  y2={unit * (y - 4.5) + gap}
                />
                <line
                  x1={unit * (x - 4) + gap}
                  y1={unit * (y - 4.5) - segment - gap}
                  x2={unit * (x - 4) + gap}
                  y2={unit * (y - 4.5) - gap}
                />
                <line
                  x1={unit * (x - 4) + gap}
                  y1={unit * (y - 4.5) + segment + gap}
                  x2={unit * (x - 4) + gap}
                  y2={unit * (y - 4.5) + gap}
                />
              </>
            )}
          </Fragment>
        ))}
      </svg>
    </Div>
  );
};
