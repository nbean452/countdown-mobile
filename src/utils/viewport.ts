import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const vh = (number: number) => number * (height / 100);

export const vw = (number: number) => number * (width / 100);
