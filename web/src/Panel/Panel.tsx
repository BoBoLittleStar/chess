import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { id, name, random, storeName } from "../config";
import { selectMatch, selectOnlines } from "../reducers";
import { Div } from "./style";

export const Panel = () => {
  const [nick, setNick] = useState(name);
  const storeNick = useCallback(
    (newNick: string | null) => {
      if (newNick) {
        storeName(newNick);
        setNick(newNick);
      }
    },
    [setNick]
  );
  const match = useSelector(selectMatch);
  const onlines = useSelector(selectOnlines);
  const [refreshing, setRefreshing] = useState(false);
  const [count, setCount] = useState(1);
  const call = async () => await new Promise((f) => setTimeout(f, 750));
  useEffect(() => {
    call().then(() => refreshing && setCount((count % 3) + 1));
  }, [refreshing, count]);
  return (
    <Div>
      <div className="p-id">
        <p>当前在线人数：{onlines}</p>
        <p>你的 ID：{id}</p>
        <p>你的昵称：{nick}</p>
        {refreshing &&
          (match ? (
            <p>你的对手：{match}</p>
          ) : (
            <p>正在寻找对手{".".repeat(count)}</p>
          ))}
      </div>
      <div className="button-group">
        <button onClick={() => storeNick(prompt("输入一个新昵称"))}>
          改名
        </button>
        <button onClick={() => storeNick(random())}>&#x1f3b2;</button>
        <button onClick={() => setRefreshing(!refreshing)}>
          {!refreshing ? "开始" : "取消"}
        </button>
      </div>
    </Div>
  );
};
