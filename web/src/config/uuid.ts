import { v4 } from "uuid";

const storedKey = "chess-uuid";

const register = () => {
  let id: string | null;
  (id = localStorage.getItem(storedKey)) ||
    localStorage.setItem(storedKey, (id = v4()));
  return id;
};

export const id = register();
