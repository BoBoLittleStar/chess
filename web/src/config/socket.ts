import { onlines, store } from "../reducers";
import { id } from "./uuid";

const socket = new WebSocket("ws://192.168.1.4:8080/socket");
socket.onopen = (e) => send(id, "open");
socket.onmessage = (m) => {
  const data = JSON.parse(m.data);
  if (data.onlines) store.dispatch(onlines(data.onlines));
};

export const send = (id: string, data: string) =>
  socket.send(JSON.stringify({ id, data }));
