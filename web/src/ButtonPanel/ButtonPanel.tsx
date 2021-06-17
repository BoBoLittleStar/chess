import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { id, name, random, send, sleep, storeName } from "../config";
import { resetMatch, TypeState } from "../reducers";
import { Div } from "./style";

export const ButtonPanel = () => {
  const dispatch = useDispatch();
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
  const { onlineCount, matchedOpponent, opponentStatus, gameStarted } =
    useSelector((state: TypeState) => ({
      onlineCount: state.onlineCount,
      matchedOpponent: state.matchedOpponent,
      opponentStatus: state.opponentStatus,
      gameStarted: !!state.currentGame,
    }));

  const [refreshing, setRefreshing] = useState(false);
  const handleStart = useCallback((flag: boolean) => {
    setRefreshing(flag);
    send(id, "match", { match: flag });
  }, []);

  const [ready, setReady] = useState(false);
  const handleReady = useCallback(
    (flag: boolean) => {
      setReady(flag);
      !flag && dispatch(resetMatch());
      matchedOpponent && send(id, "ready", { ready: flag });
    },
    [dispatch, matchedOpponent]
  );

  const [count, setCount] = useState(1);
  useEffect(() => {
    refreshing && sleep(750).then(() => setCount((count % 6) + 1));
  }, [count, matchedOpponent, refreshing]);

  useEffect(() => {
    matchedOpponent && setRefreshing(false);
  }, [matchedOpponent]);
  return (
    <Div>
      <div className="content">
        <p>当前在线人数：{onlineCount}</p>
        <p>{`你的昵称：${storedName}`}</p>
        {refreshing ? (
          <p>正在寻找对手{".".repeat(count)}</p>
        ) : (
          matchedOpponent && <p>你的对手：{matchedOpponent}</p>
        )}
        {matchedOpponent || opponentStatus ? (
          !gameStarted && (
            <div>
              {
                <div>
                  <button onClick={() => handleReady(true)} disabled={ready}>
                    准备
                  </button>
                  <button
                    onClick={() => handleReady(false)}
                    disabled={ready && !!matchedOpponent}
                  >
                    返回
                  </button>
                </div>
              }
              {opponentStatus && (
                <div>
                  {opponentStatus === "ready" ? "对手已准备" : "对手已离开"}
                </div>
              )}
            </div>
          )
        ) : (
          <>
            {!refreshing && (
              <div>
                <button onClick={() => handleName(prompt("输入一个新昵称"))}>
                  改名
                </button>
                <button onClick={() => handleName(random())}>&#x1f3b2;</button>
              </div>
            )}
            <button onClick={() => handleStart(!refreshing)}>
              {!refreshing ? "开始" : "取消"}
            </button>
          </>
        )}
      </div>
    </Div>
  );
};
