import { id, name } from ".";
import { match, onlines, store } from "../reducers";

const socket = new WebSocket("ws://localhost:8080/socket");
socket.onopen = () => send(id, "open", { name });
socket.onmessage = (m) => {
  const data = JSON.parse(m.data);
  if (data.onlines) store.dispatch(onlines(data.onlines));
  else if (data.matched) store.dispatch(match(data.matched));
};

export const send = (id: string, command: string, payload?: object) =>
  socket.send(JSON.stringify({ id, command, payload }));
