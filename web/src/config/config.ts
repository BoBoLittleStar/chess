import { v4 } from "uuid";

const storedKey = "chess-uuid";
const api = "http://localhost:8080/api";
const refresh = `${api}/refresh`;
const match = `${api}/match`;
const ready = `${api}/ready`;

const register = () => {
  let id: string | null;
  (id = localStorage.getItem(storedKey)) ||
    localStorage.setItem(storedKey, (id = v4()));
  return id;
};

export const id = register();

export const Path = {
  api,
  refresh,
  match,
  ready,
};
