import authSide from "./auth-side.png";
import googleIcon from "./google.svg";

export const images = {
  authSide,
  googleIcon,
} as const;

export type ImageName = keyof typeof images;
