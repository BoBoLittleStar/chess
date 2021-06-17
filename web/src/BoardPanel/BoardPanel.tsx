import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { id } from "../config";
import { TypeState } from "../reducers";
import { decorations, gap, segment, unit } from "./constants";
import { Div } from "./styles";

export const BoardPanel = () => {
  const textChuHe = <text className="board-background chu">楚&emsp;河</text>;
  const textHanJie = <text className="board-background han">汉&emsp;界</text>;
  const [player, setPlayer] = useState<"red" | "black">();
  const { redId, blackId, red, black } = useSelector((state: TypeState) => ({
    redId: state.currentGame?.redId,
    blackId: state.currentGame?.blackId,
    red: state.currentGame?.red,
    black: state.currentGame?.black,
  }));
  useEffect(() => {
    id === redId && setPlayer("red");
    id === blackId && setPlayer("black");
  }, [redId, blackId]);
  useEffect(() => {
    red && console.log(red);
    black && console.log(black);
  }, [red, black]);

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
        <rect x={3} y={3} width={30} height={30} />
      </svg>
    </Div>
  );
};
