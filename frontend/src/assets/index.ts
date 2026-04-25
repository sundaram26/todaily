import authSide from "./auth-side.png";
import googleIcon from "./google.svg";
import githubIcon from "./github.svg";

export const images = {
  authSide,
  googleIcon,
  githubIcon
} as const;

export type ImageName = keyof typeof images;
