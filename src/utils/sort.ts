import { CountdownProps } from "./types";

export default (a: CountdownProps, b: CountdownProps) =>
  new Date(a.endDate).getTime() - new Date(b.endDate).getTime() ||
  a.name.localeCompare(b.name);
