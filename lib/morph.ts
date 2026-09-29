import { flushSync } from "react-dom";

export function morphTo(update: () => void) {
  if (typeof document !== "undefined" && "startViewTransition" in document) {
    document.startViewTransition(() => {
      flushSync(update);
    });
    return;
  }
  update();
}
