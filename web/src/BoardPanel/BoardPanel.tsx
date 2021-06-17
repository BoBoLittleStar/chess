import React, { Fragment, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { id, send } from "../config";
import { TypeState } from "../reducers";
import { decorations } from "./constants";
import { Div, gap, segment, unit } from "./styles";

export const BoardPanel = () => {
  const textChuHe = <text className="board-background chu">楚&emsp;河</text>;
  const textHanJie = <text className="board-background han">汉&emsp;界</text>;
  const { redId, blackId, player, reds, blacks } = useSelector(
    (state: TypeState) => ({
      ...state.currentGame,
    })
  );

  const listReds = useCallback(
    () =>
      reds &&
      Object.entries(reds).map(([pos, chess]) => {
        const name = (() => {
          switch (chess) {
            case "ROOK":
              return "车";
            case "KNIGHT":
              return "马";
            case "CANNON":
              return "炮";
            case "GUARD":
              return "仕";
            case "BISHOP":
              return "相";
            case "KING":
              return "帅";
            case "SOLDIER":
              return "兵";
          }
        })();

        let x = Number(pos) >>> 4;
        let y = Number(pos) & 0xf;
        if (id === blackId) {
          x = 8 - x;
          y = 9 - y;
        }
        return { x, y, name };
      }),
    [blackId, reds]
  );

  const listBlacks = useCallback(
    () =>
      blacks &&
      Object.entries(blacks).map(([pos, chess]) => {
        const name = (() => {
          switch (chess) {
            case "ROOK":
              return "车";
            case "KNIGHT":
              return "马";
            case "CANNON":
              return "炮";
            case "GUARD":
              return "仕";
            case "BISHOP":
              return "象";
            case "KING":
              return "将";
            case "SOLDIER":
              return "卒";
          }
        })();

        let x = Number(pos) >>> 4;
        let y = Number(pos) & 0xf;
        if (id === redId) {
          x = 8 - x;
          y = 9 - y;
        }
        return { x, y, name };
      }),
    [redId, blacks]
  );

  const [pos, setPos] = useState(-1);
  const handleClick = useCallback(
    (x: number, y: number) => {
      if (id === player)
        if (pos === -1) {
          const list =
            id === redId ? reds : id === blackId ? blacks : undefined;
          if (
            list &&
            Object.keys(list).some((v) => Number(v) === ((x << 4) | y))
          ) {
            setPos((x << 4) | y);
          }
        } else {
          send(id, "move", { from: pos, to: (x << 4) | y });
          setPos(-1);
        }
    },
    [player, redId, blackId, reds, blacks, pos]
  );

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
        {Array.from(Array(10).keys()).map((y) =>
          Array.from(Array(9).keys()).map((x) => (
            <Fragment key={`empty${x}${y}`}>
              <circle
                className="circle-empty"
                cx={(4 - x) * unit}
                cy={(4.5 - y) * unit}
                r={unit / 2}
                onClick={() => handleClick(x, y)}
              />
            </Fragment>
          ))
        )}
        {listReds()?.map(({ x, y, name }) => (
          <Fragment key={`red${x}${y}`}>
            <circle
              className="circle-outer red"
              cx={(4 - x) * unit}
              cy={(4.5 - y) * unit}
              r={unit / 2 - gap}
              onClick={() => handleClick(x, y)}
            />
            <circle
              className="circle-inner red"
              cx={(4 - x) * unit}
              cy={(4.5 - y) * unit}
              r={unit / 2 - gap * 2}
              onClick={() => handleClick(x, y)}
            />
            <text
              className="chess red"
              x={(4 - x) * unit}
              y={(4.5 - y) * unit}
              onClick={() => handleClick(x, y)}
            >
              {name}
            </text>
          </Fragment>
        ))}
        {listBlacks()?.map(({ x, y, name }) => (
          <Fragment key={`black${x}${y}`}>
            <circle
              className="circle-outer black"
              cx={(4 - x) * unit}
              cy={(4.5 - y) * unit}
              r={unit / 2 - gap}
              onClick={() => handleClick(x, y)}
            />
            <circle
              className="circle-inner black"
              cx={(4 - x) * unit}
              cy={(4.5 - y) * unit}
              r={unit / 2 - gap * 2}
              onClick={() => handleClick(x, y)}
            />
            <text
              className="chess black"
              x={(4 - x) * unit}
              y={(4.5 - y) * unit}
              onClick={() => handleClick(x, y)}
            >
              {name}
            </text>
          </Fragment>
        ))}
        {pos && (
          <rect
            className="rect-selected"
            x={(3.5 - (pos >>> 4)) * unit}
            y={(4 - (pos & 0xf)) * unit}
            width={unit}
            height={unit}
          />
        )}
      </svg>
    </Div>
  );
};
