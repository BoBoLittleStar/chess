import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { id } from "../config";
import { match, selectMatch } from "../reducers/match";
import { refresh, selectRefresh } from "../reducers/refresh";

export const Panel = () => {
  const Div = styled.div`
    width: max-content;

    .p-id {
      text-align: center;
      font-size: 14pt;
      margin-top: 1em;
      margin-left: 1em;
    }

    .button-group {
      text-align: center;
      font-size: 14pt;
      margin-left: 1em;
      margin-right: 1em;
      button {
        font-size: 14pt;
        margin: 1em;
      }
    }
  `;
  const { state: stateRefresh, message: messageRefresh } =
    useSelector(selectRefresh);
  const { state: stateMatch } = useSelector(selectMatch);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    const call = async () => {
      if (refreshing) {
        await dispatch(refresh(id));
        messageRefresh && setRefreshing(false);
      }
    };
    call();
  }, [dispatch, refreshing, stateRefresh, messageRefresh]);
  const [count, setCount] = useState(1);
  useEffect(() => {
    const call = async () => {
      await new Promise((r) => setTimeout(r, 750));
      refreshing && setCount((count % 3) + 1);
    };
    call();
  }, [refreshing, count]);
  return (
    <Div>
      <div className="p-id">
        <p>ID: {id}</p>
        {refreshing &&
          (stateMatch ? (
            <p>你的对手：{stateMatch}</p>
          ) : (
            <p>正在寻找对手{Array.from(Array(count).keys()).map((i) => ".")}</p>
          ))}
      </div>
      <div className="button-group">
        {!refreshing ? (
          <button
            onClick={async () => {
              setRefreshing(true);
              await dispatch(match(id));
            }}
          >
            开始
          </button>
        ) : (
          <button onClick={() => setRefreshing(false)}>取消</button>
        )}
      </div>
    </Div>
  );
};
