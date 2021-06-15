export * from "./name";
export * from "./socket";
export * from "./uuid";

export const sleep = async (ms: number) =>
  await new Promise((r) => setTimeout(r, ms));
