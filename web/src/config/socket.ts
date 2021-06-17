import { id, name } from ".";
import { receiveData, store } from "../reducers";

const socket = new WebSocket("ws://localhost:8080/socket");

export const send = (id: string, command: string, payload?: object) =>
  socket.send(JSON.stringify({ id, command, payload }));

socket.onopen = () => send(id, "open", { name });
socket.onmessage = (m) => {
  store.dispatch(receiveData(JSON.parse(m.data)));
};
