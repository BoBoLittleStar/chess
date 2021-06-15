import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { id, name, random, send, sleep, storeName } from "../config";
import { selectMatch, selectOnlines } from "../reducers";
import { Div } from "./style";

export const ButtonPanel = () => {
  const [storedName, setStoredName] = useState(name);
  const handleName = useCallback(
    (name: string | null) => {
      const valid = name?.trim();
      if (valid) {
        storeName(valid);
        send(id, "rename", { name });
        setStoredName(valid);
      }
    },
    [setStoredName]
  );
  const onlines = useSelector(selectOnlines);
  const match = useSelector(selectMatch);
  const [refreshing, setRefreshing] = useState(false);
  const handleMatch = useCallback((flag: boolean) => {
    setRefreshing(flag);
    send(id, flag ? "match" : "match-cancel");
  }, []);
  const [count, setCount] = useState(1);
  useEffect(() => {
    refreshing && sleep(750).then(() => setCount((count % 3) + 1));
  }, [refreshing, count]);
  return (
    <Div>
      <div className="content">
        <p>当前在线人数：{onlines}</p>
        <p>
          你的昵称
          <button onClick={() => handleName(random())}>&#x1f3b2;</button>
          {storedName}
        </p>
        {refreshing &&
          (match ? (
            <p>你的对手：{match}</p>
          ) : (
            <p>正在寻找对手{".".repeat(count)}</p>
          ))}
        {match ? (
          <div>{/*<button onClick={() => handleReady()}>准备</button>*/}</div>
        ) : (
          <div>
            <button onClick={() => handleName(prompt("输入一个新昵称"))}>
              改名
            </button>
            <br />
            <button onClick={() => handleMatch(!refreshing)}>
              {!refreshing ? "开始" : "取消"}
            </button>
          </div>
        )}
      </div>
    </Div>
  );
};
