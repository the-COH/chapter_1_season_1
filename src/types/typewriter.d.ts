import { Options } from "typewriter-effect";

declare module "typewriter-effect" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface TypewriterOptions {
    pauseFor: number & Options;
  }
}
